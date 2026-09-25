import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Pencil, Loader2 } from 'lucide-react';
import { useJobById } from '@/hooks/useJobById';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/contexts/ToastContext';
import { jobsService } from '@/services/jobs.service';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ConfirmationModal from '@/components/common/ConfirmationModal';
import { Button } from '@/components/ui/button';
import { formatDate, formatCurrency } from '@/utils/formatters';
import { normalizeStoredJobImageAttachments, resolveImageDisplayTitle } from '@/utils/jobImageAttachments';
import { normalizeJobStatus } from '@/utils/jobStatus';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const resolveSectorLabel = (job) => {
  const sectorType = (job?.sector_type || '').trim();
  const custom = (job?.sector_custom || '').trim();
  if (sectorType === 'Otro' && custom) return custom;
  return sectorType || '-';
};

const getStatusMeta = (status) => {
  if (status === 'completed') return { label: 'Completado', className: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200' };
  if (status === 'pending') return { label: 'Pendiente', className: 'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-200' };
  if (status === 'in_progress') return { label: 'En proceso', className: 'bg-blue-100 text-blue-800 dark:bg-blue-950/40 dark:text-blue-200' };
  if (status === 'cancelled') return { label: 'Cancelado', className: 'bg-red-100 text-red-800 dark:bg-red-950/40 dark:text-red-200' };
  if (status === 'archived') return { label: 'Archivado', className: 'bg-gray-100 text-gray-700 dark:bg-slate-800 dark:text-slate-200' };
  return { label: 'No informado', className: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200' };
};

export default function JobDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToast } = useToast();
  const { data, loading, error, refetch } = useJobById(id);
  const [selectedImage, setSelectedImage] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const handleComplete = async () => {
    if (!data?.id || updatingStatus) return;
    setUpdatingStatus(true);
    const result = await jobsService.updateJob(data.id, { status: 'completed' }, user?.id || null);
    if (result.success) {
      addToast('Trabajo marcado como completado.', 'success');
      refetch();
    } else {
      addToast(result.error || 'No se pudo completar el trabajo.', 'error');
    }
    setUpdatingStatus(false);
  };

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-gray-600 dark:text-slate-300">
        {error}
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-gray-600 dark:text-slate-300">
        No se encontró el trabajo.
      </div>
    );
  }

  const attachments = normalizeStoredJobImageAttachments(data.image_attachments);
  const title = data.title || data.description || 'Detalle del trabajo';
  const normalizedStatus = normalizeJobStatus(data?.estado || data?.status);
  const statusMeta = getStatusMeta(normalizedStatus);
  const sectorLabel = resolveSectorLabel(data);
  const selectedImageTitle = selectedImage ? resolveImageDisplayTitle(selectedImage, title) : 'Imagen adjunta';
  const canComplete = !['completed', 'archived', 'cancelled'].includes(normalizedStatus);

  return (
    <div className="maintenance-page space-y-4">
      <section className="orders-page-header">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => navigate('/app/trabajos-diarios')}
                className="h-9 px-2 text-sm text-gray-600 hover:text-[#1e3a8a] dark:text-slate-300"
              >
                <ArrowLeft className="mr-1.5 h-4 w-4" />
                Volver
              </Button>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusMeta.className}`}>{statusMeta.label}</span>
              <span className="text-sm text-gray-500 dark:text-slate-400">{formatDate(data.date)}</span>
            </div>
            <h1 className="max-w-4xl text-2xl font-bold leading-tight text-gray-950 dark:text-slate-50 md:text-3xl">
              {title}
            </h1>
          </div>

          <div className="flex w-full flex-col gap-2 sm:flex-row lg:w-auto lg:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(`/app/trabajos-diarios/${data.id}/editar`)}
              className="h-10 gap-2 px-4 text-sm font-semibold"
            >
              <Pencil className="h-4 w-4" />
              Editar trabajo
            </Button>

            {canComplete && (
              <ConfirmationModal
                title="¿Completar trabajo?"
                description="El trabajo quedará marcado como completado."
                confirmLabel="Completar"
                onConfirm={handleComplete}
                trigger={
                  <Button
                    type="button"
                    disabled={updatingStatus}
                    className="h-10 gap-2 bg-emerald-600 px-4 text-sm font-semibold text-white hover:bg-emerald-700"
                  >
                    {updatingStatus ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                    {updatingStatus ? 'Guardando...' : 'Completar'}
                  </Button>
                }
              />
            )}
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:p-5">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-gray-950 dark:text-slate-50">Resumen operativo</h2>
            <p className="mt-0.5 text-xs text-gray-500 dark:text-slate-400">Datos principales del trabajo.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2 xl:grid-cols-3">
          {[
            ['Ubicación', data.location || '-'],
            ['Solicitante', data.requested_by || data.creator?.full_name || data.creator?.email || 'Sin solicitante'],
            ['Trabajador', data.workers?.display_name || data.workers?.alias || 'Sin trabajador'],
            ['Grupo', data.groups?.name || 'Personal'],
            ['Tipo de acción', data.action_type || '-'],
            ['Sector / equipo', sectorLabel],
          ].map(([label, value]) => (
            <div key={label} className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-slate-400">{label}</p>
              <p className="mt-1 break-words text-sm font-medium text-gray-950 dark:text-slate-100 md:text-base">{value}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
        <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:p-5">
          <h2 className="text-base font-semibold text-gray-950 dark:text-slate-50">Descripción</h2>
          <p className="mt-3 whitespace-pre-line text-sm leading-6 text-gray-700 dark:text-slate-200 md:text-base">
            {data.description || 'Sin descripción'}
          </p>
        </section>

        <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:p-5">
          <h2 className="text-base font-semibold text-gray-950 dark:text-slate-50">Facturación</h2>
          <div className="mt-3 grid grid-cols-2 gap-3 xl:grid-cols-1">
            <div className="rounded-lg bg-gray-50 p-3 dark:bg-slate-950/40">
              <p className="text-xs text-gray-500 dark:text-slate-400">Costo trabajador</p>
              <p className="mt-1 text-lg font-bold text-gray-950 dark:text-slate-50">{formatCurrency(data.cost_spent)}</p>
            </div>
            <div className="rounded-lg bg-gray-50 p-3 dark:bg-slate-950/40">
              <p className="text-xs text-gray-500 dark:text-slate-400">A cobrar</p>
              <p className="mt-1 text-lg font-bold text-gray-950 dark:text-slate-50">{formatCurrency(data.amount_to_charge)}</p>
            </div>
          </div>
        </section>
      </div>

      <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:p-5">
        <div className="mb-4">
          <h2 className="text-base font-semibold text-gray-950 dark:text-slate-50">Imágenes</h2>
          <p className="mt-0.5 text-xs text-gray-500 dark:text-slate-400">Evidencia visual asociada al trabajo.</p>
        </div>

        {attachments.length > 0 ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {attachments.map((attachment, index) => {
              const caption = resolveImageDisplayTitle(attachment, title);
              return (
                <button
                  type="button"
                  key={`${attachment.image_path || 'text-only'}-${index}`}
                  onClick={() => attachment.image_url && setSelectedImage(attachment)}
                  className="overflow-hidden rounded-xl border border-gray-200 bg-gray-50 text-left transition hover:border-[#1e3a8a]/40 hover:shadow-sm dark:border-slate-700 dark:bg-slate-950/40"
                >
                  {attachment.image_url ? (
                    <img
                      src={attachment.image_url}
                      alt={attachment.image_description || `Imagen ${index + 1}`}
                      className="h-36 w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-36 items-center justify-center text-xs text-gray-400 dark:text-slate-500">
                      Sin imagen cargada
                    </div>
                  )}
                  <div className="p-3">
                    <p className="truncate text-sm font-semibold text-gray-900 dark:text-slate-100">{caption}</p>
                    {attachment.image_description?.trim() ? (
                      <p className="mt-1 line-clamp-2 text-xs text-gray-500 dark:text-slate-400">{attachment.image_description}</p>
                    ) : null}
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 px-4 py-6 text-center text-sm text-gray-500 dark:border-slate-700 dark:bg-slate-950/30 dark:text-slate-400">
            Sin imágenes
          </div>
        )}
      </section>

      {selectedImage?.image_url && (
        <Dialog open={!!selectedImage} onOpenChange={(open) => { if (!open) setSelectedImage(null); }}>
          <DialogContent className="sm:max-w-3xl bg-white dark:bg-slate-900 dark:text-slate-50">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-[#1e3a8a] dark:text-blue-200">{selectedImageTitle}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="overflow-hidden rounded-xl border border-gray-200 bg-gray-100 dark:border-slate-700 dark:bg-slate-800">
                <img
                  src={selectedImage.image_url}
                  alt={selectedImage.image_description || selectedImageTitle}
                  className="max-h-[70vh] w-full object-contain"
                />
              </div>
              {selectedImage.image_description?.trim() ? (
                <p className="whitespace-pre-line text-sm text-gray-700 dark:text-slate-200">
                  {selectedImage.image_description}
                </p>
              ) : null}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
