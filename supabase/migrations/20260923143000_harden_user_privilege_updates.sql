-- Prevent authenticated users from escalating privileges through their own public.users row.
-- Keeps normal self-service profile edits working while protecting role, permissions and deleted_at.

create or replace function public.protect_user_privileged_fields()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  -- Service-role / trusted database operations do not carry auth.uid().
  if auth.uid() is null then
    return new;
  end if;

  -- A client-created self profile must always start unprivileged. This closes
  -- the insert path as well as the update path.
  if tg_op = 'INSERT' then
    if new.id is distinct from auth.uid()
      or coalesce(new.role, 'user') <> 'user'
      or coalesce(to_jsonb(new.permissions), '[]'::jsonb) <> '[]'::jsonb
      or new.deleted_at is not null
    then
      raise exception 'New user profiles cannot contain privileged fields'
        using errcode = '42501';
    end if;

    return new;
  end if;

  -- Existing administrators may manage privileged fields for the admin console.
  -- Non-admin users may edit profile data and may deactivate their own account,
  -- but they cannot change role/permissions or reactivate themselves.
  if not public.app_is_admin(auth.uid()) then
    if new.role is distinct from old.role
      or new.permissions is distinct from old.permissions
      or (
        new.deleted_at is distinct from old.deleted_at
        and not (
          old.deleted_at is null
          and new.deleted_at is not null
          and new.id = auth.uid()
        )
      )
    then
      raise exception 'Privileged user fields cannot be changed by this account'
        using errcode = '42501';
    end if;
  end if;

  return new;
end;
$$;

revoke all on function public.protect_user_privileged_fields() from public, anon, authenticated;

drop trigger if exists protect_user_privileged_fields on public.users;
create trigger protect_user_privileged_fields
before insert or update on public.users
for each row
execute function public.protect_user_privileged_fields();

-- Make the intended admin-console access explicit and reproducible.
drop policy if exists "Admins can view users" on public.users;
create policy "Admins can view users"
  on public.users
  for select
  to authenticated
  using (public.app_is_admin(auth.uid()));

drop policy if exists "Admins can update users" on public.users;
create policy "Admins can update users"
  on public.users
  for update
  to authenticated
  using (public.app_is_admin(auth.uid()))
  with check (public.app_is_admin(auth.uid()));

-- Preserve the existing self-service policies, but the trigger above prevents
-- self-promotion, permission changes and self-clearing deleted_at.
drop policy if exists "Users can view their own profile" on public.users;
create policy "Users can view their own profile"
  on public.users
  for select
  to authenticated
  using (id = auth.uid());

drop policy if exists "Users can update their own profile" on public.users;
create policy "Users can update their own profile"
  on public.users
  for update
  to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

notify pgrst, 'reload schema';
