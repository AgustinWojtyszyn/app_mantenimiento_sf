import React from 'react';
import {
  JOB_IMAGE_ACCEPT,
  JOB_IMAGE_MAX_DESCRIPTION_LENGTH,
  JOB_IMAGE_MAX_TITLE_LENGTH,
} from '@/utils/jobImageAttachments';
import { ImagePlus, RefreshCw, Trash2 } from 'lucide-react';

const hasAttachment = (attachment) => Boolean(
  attachment?.file || attachment?.previewUrl || attachment?.image_url
);

export default function JobImagesSection({
  imageAttachments,
  imageErrors,
  isPage,
  imageSectionDescription,
  onImageChange,
  onImageRemove,
  onTitleChange,
  onDescriptionChange
}) {
  const filledEntries = imageAttachments
    .map((attachment, index) => ({ attachment, index }))
    .filter(({ attachment }) => hasAttachment(attachment));

  const emptyIndexes = imageAttachments
    .map((attachment, index) => ({ attachment, index }))
    .filter(({ attachment }) => !hasAttachment(attachment))
    .map(({ index }) => index);

  const remaining = emptyIndexes.length;

  const handleMultipleFiles = (event) => {
    const files = Array.from(event.target.files || []);
    files.slice(0, remaining).forEach((file, fileIndex) => {
      onImageChange(emptyIndexes[fileIndex], file);
    });
    event.target.value = '';
  };

  return (
    <div className={isPage ? 'space-y-3' : 'space-y-3 rounded-xl border border-gray-200 bg-gray-50/70 p-4 dark:border-slate-700 dark:bg-slate-800/40'}>
      {!isPage && (
        <div>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-slate-50">Imágenes del trabajo</h3>
          <p className="mt-1 text-xs text-gray-500 dark:text-slate-300">{imageSectionDescription}</p>
        </div>
      )}

      <div className="flex flex-col gap-3 rounded-xl border border-dashed border-gray-300 bg-gray-50/70 p-3 dark:border-slate-700 dark:bg-slate-950/30 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-800 dark:text-slate-100">
            <ImagePlus className="h-4 w-4 text-[#1e3a8a] dark:text-blue-300" />
            Evidencia visual
          </div>
          <p className="mt-1 text-xs text-gray-500 dark:text-slate-400">
            {filledEntries.length} de {imageAttachments.length} imágenes cargadas · {remaining} disponibles
          </p>
        </div>
        <label className={`inline-flex h-10 cursor-pointer items-center justify-center rounded-lg px-4 text-sm font-semibold transition ${
          remaining > 0
            ? 'bg-[#1e3a8a] text-white hover:bg-blue-900'
            : 'cursor-not-allowed bg-gray-200 text-gray-500 dark:bg-slate-800 dark:text-slate-500'
        }`}>
          <ImagePlus className="mr-2 h-4 w-4" />
          {filledEntries.length === 0 ? 'Agregar imágenes' : 'Agregar más'}
          <input
            type="file"
            accept={JOB_IMAGE_ACCEPT}
            multiple
            disabled={remaining === 0}
            onChange={handleMultipleFiles}
            className="sr-only"
          />
        </label>
      </div>

      {filledEntries.length > 0 ? (
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
          {filledEntries.map(({ attachment, index }) => (
            <div
              key={`job-image-${index}`}
              className="rounded-xl border border-gray-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-900"
            >
              <div className="flex gap-3">
                <div className="h-20 w-24 shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-gray-100 dark:border-slate-700 dark:bg-slate-800">
                  <img
                    src={attachment.previewUrl || attachment.image_url}
                    alt={attachment.image_description || `Vista previa de la imagen ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="min-w-0 flex-1 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-semibold text-gray-700 dark:text-slate-200">Imagen {index + 1}</p>
                    <button
                      type="button"
                      onClick={() => onImageRemove(index)}
                      className="inline-flex h-7 w-7 items-center justify-center rounded-md text-red-600 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-950/30"
                      aria-label={`Quitar imagen ${index + 1}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <label className="inline-flex cursor-pointer items-center text-xs font-semibold text-[#1e3a8a] hover:text-blue-900 dark:text-blue-300">
                    <RefreshCw className="mr-1 h-3.5 w-3.5" />
                    Reemplazar
                    <input
                      type="file"
                      accept={JOB_IMAGE_ACCEPT}
                      onChange={(event) => {
                        const nextFile = event.target.files?.[0] || null;
                        if (nextFile) onImageChange(index, nextFile);
                        event.target.value = '';
                      }}
                      className="sr-only"
                    />
                  </label>
                </div>
              </div>

              <div className="mt-3 grid gap-2">
                <input
                  type="text"
                  maxLength={JOB_IMAGE_MAX_TITLE_LENGTH}
                  className="h-9 w-full rounded-lg border border-gray-300 bg-white px-3 text-xs text-gray-900 outline-none focus:border-[#1e3a8a] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50"
                  value={attachment.image_title || ''}
                  onChange={(event) => onTitleChange(index, event.target.value)}
                  placeholder="Título opcional"
                />
                <input
                  type="text"
                  maxLength={JOB_IMAGE_MAX_DESCRIPTION_LENGTH}
                  className="h-9 w-full rounded-lg border border-gray-300 bg-white px-3 text-xs text-gray-900 outline-none focus:border-[#1e3a8a] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50"
                  value={attachment.image_description || ''}
                  onChange={(event) => onDescriptionChange(index, event.target.value)}
                  placeholder="Descripción breve"
                />
              </div>

              {imageErrors[index] && <span className="mt-2 block text-xs text-red-500">{imageErrors[index]}</span>}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xs text-gray-500 dark:text-slate-400">
          No hay imágenes cargadas. Podés continuar sin evidencia visual.
        </p>
      )}
    </div>
  );
}
