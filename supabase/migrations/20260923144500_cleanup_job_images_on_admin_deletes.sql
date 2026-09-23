-- Return deleted image paths from bulk job cleanup so the frontend can remove
-- private Storage objects as well. Also allow admins to delete job images that
-- belong to other users when they delete those users' jobs.

drop function if exists public.bulk_delete_jobs(date, date, text, text, text, text);

create or replace function public.bulk_delete_jobs(
  p_start_date date,
  p_end_date date,
  p_status text,
  p_location text default null::text,
  p_requested_by text default null::text,
  p_search text default null::text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  deleted_count integer := 0;
  image_paths jsonb := '[]'::jsonb;
begin
  if auth.uid() is null then
    raise exception 'Authentication required' using errcode = '28000';
  end if;

  if not public.app_is_admin(auth.uid()) then
    raise exception 'Only administrators can delete jobs in bulk' using errcode = '42501';
  end if;

  if p_start_date is null or p_end_date is null or p_start_date > p_end_date then
    raise exception 'Invalid date range' using errcode = '22007';
  end if;

  if p_status not in ('completed', 'pending') then
    raise exception 'Invalid status' using errcode = '22023';
  end if;

  select coalesce(
    jsonb_agg(distinct attachment ->> 'image_path')
      filter (where nullif(attachment ->> 'image_path', '') is not null),
    '[]'::jsonb
  )
  into image_paths
  from public.jobs j
  left join lateral jsonb_array_elements(
    case
      when jsonb_typeof(j.image_attachments) = 'array' then j.image_attachments
      else '[]'::jsonb
    end
  ) as attachment on true
  where j.status = p_status
    and j.date >= p_start_date
    and j.date <= p_end_date
    and (
      nullif(btrim(p_location), '') is null
      or lower(btrim(j.location)) = lower(btrim(p_location))
    )
    and (
      nullif(btrim(p_requested_by), '') is null
      or j.requested_by ilike '%' || btrim(p_requested_by) || '%'
    )
    and (
      nullif(btrim(p_search), '') is null
      or concat_ws(
        ' ',
        coalesce(j.title, ''),
        coalesce(j.description, ''),
        coalesce(j.location, ''),
        coalesce(j.requested_by, ''),
        coalesce(j.action_type, ''),
        coalesce(j.sector_type, ''),
        coalesce(j.sector_custom, '')
      ) ilike '%' || btrim(p_search) || '%'
    );

  delete from public.jobs j
  where j.status = p_status
    and j.date >= p_start_date
    and j.date <= p_end_date
    and (
      nullif(btrim(p_location), '') is null
      or lower(btrim(j.location)) = lower(btrim(p_location))
    )
    and (
      nullif(btrim(p_requested_by), '') is null
      or j.requested_by ilike '%' || btrim(p_requested_by) || '%'
    )
    and (
      nullif(btrim(p_search), '') is null
      or concat_ws(
        ' ',
        coalesce(j.title, ''),
        coalesce(j.description, ''),
        coalesce(j.location, ''),
        coalesce(j.requested_by, ''),
        coalesce(j.action_type, ''),
        coalesce(j.sector_type, ''),
        coalesce(j.sector_custom, '')
      ) ilike '%' || btrim(p_search) || '%'
    );

  get diagnostics deleted_count = row_count;

  return jsonb_build_object(
    'deleted_count', deleted_count,
    'image_paths', image_paths
  );
end;
$$;

revoke all on function public.bulk_delete_jobs(date, date, text, text, text, text) from public, anon;
grant execute on function public.bulk_delete_jobs(date, date, text, text, text, text) to authenticated;

drop policy if exists "Job request images delete own path" on storage.objects;
create policy "Job request images delete own path"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'job-request-images'
  and (
    (
      name like auth.uid()::text || '/%'
      and split_part(name, '/', 1) = auth.uid()::text
    )
    or public.app_is_admin(auth.uid())
  )
);

notify pgrst, 'reload schema';
