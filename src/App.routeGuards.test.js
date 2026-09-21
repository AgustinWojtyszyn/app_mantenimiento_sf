import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const source = readFileSync(resolve(process.cwd(), 'src/App.jsx'), 'utf8');

describe('App route guards', () => {
  it('mantiene grupos y administracion restringidos a admin', () => {
    expect(source).toMatch(/path="grupos"[\s\S]*?<ProtectedRoute adminOnly=\{true\}>/);
    expect(source).toMatch(/path="admin"[\s\S]*?<ProtectedRoute adminOnly=\{true\}>/);
  });

  it('mantiene el libro de mantenimiento limitado a roles conocidos', () => {
    expect(source).toMatch(
      /path="equipment-log"[\s\S]*?allowedRoles=\{\['admin', 'chofer', 'user', 'solicitante', 'trabajador'\]\}/
    );
  });

  it('mantiene todas las rutas internas dentro del ProtectedRoute principal', () => {
    expect(source).toMatch(/<Route path="\/app" element=\{[\s\S]*?<ProtectedRoute>[\s\S]*?<AppLayout \/>[\s\S]*?<\/ProtectedRoute>/);
  });
});
