import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const source = readFileSync(resolve(process.cwd(), 'src/components/jobs/JobForm.jsx'), 'utf8');

describe('JobForm submission safety', () => {
  it('bloquea envios duplicados antes de guardar', () => {
    expect(source).toMatch(/if \(submitLockRef\.current\) return;/);
    expect(source).toMatch(/submitLockRef\.current = true;/);
  });

  it('libera el bloqueo despues de finalizar el guardado', () => {
    expect(source).toMatch(/setLoading\(false\);\s*submitLockRef\.current = false;/);
  });

  it('guarda trabajo y adjuntos en una sola operacion de servicio', () => {
    expect(source).toMatch(/jobsService\.saveJobWithImages\(/);
  });

  it('solo notifica al trabajador luego de crear un registro con id', () => {
    expect(source).toMatch(/if \(!jobToEdit && result\?\.data\?\.id\)[\s\S]*notifyWorker\(result\.data\.id\)/);
  });
});
