<div align="center">

# Mantenimiento · ServiFood

**Plataforma web para centralizar la operación diaria y el mantenimiento de ServiFood.**

<p>
  <img src="https://img.shields.io/badge/Estado-En%20desarrollo%20activo-16a34a?style=for-the-badge" alt="Estado: desarrollo activo" />
  <img src="https://img.shields.io/badge/Responsive-Desktop%20%7C%20Mobile-2563eb?style=for-the-badge" alt="Responsive" />
  <img src="https://img.shields.io/badge/Idioma-ES%20%7C%20EN-475569?style=for-the-badge" alt="Idiomas ES y EN" />
</p>

<p>
  <img src="https://img.shields.io/badge/React-18-20232A?style=flat-square&logo=react&logoColor=61DAFB" alt="React 18" />
  <img src="https://img.shields.io/badge/Vite-5-646CFF?style=flat-square&logo=vite&logoColor=white" alt="Vite 5" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind CSS 3" />
  <img src="https://img.shields.io/badge/Supabase-Backend-3FCF8E?style=flat-square&logo=supabase&logoColor=white" alt="Supabase" />
  <img src="https://img.shields.io/badge/PostgreSQL-Database-4169E1?style=flat-square&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Vitest-Testing-6E9F18?style=flat-square&logo=vitest&logoColor=white" alt="Vitest" />
</p>

</div>

---

## Sobre el proyecto

**Mantenimiento · ServiFood** reúne en una sola aplicación la gestión de trabajos, personal, costos, vehículos, equipos, documentación y reportes operativos.

| Operación | Mantenimiento |
|---|---|
| Trabajos diarios y solicitudes | Preventivo y correctivo |
| Personal y grupos | Vehículos, choferes y recorridos |
| Costos e importes | Combustible y kilometraje |
| Panel diario y mensual | Documentación y vencimientos |
| Filtros, estados y asignaciones | Equipos, sectores e incidencias |
| Exportación a Excel | Revisiones y controles |

## Stack tecnológico

### Frontend

![React](https://img.shields.io/badge/React_18-20232A?style=flat-square&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite_5-646CFF?style=flat-square&logo=vite&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router_6-CA4245?style=flat-square&logo=reactrouter&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_3-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![Radix UI](https://img.shields.io/badge/Radix_UI-161618?style=flat-square&logo=radixui&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=flat-square&logo=framer&logoColor=white)

Interfaz construida con **React 18**, **Vite 5**, **React Router 6**, **Tailwind CSS**, **Radix UI**, **Framer Motion**, **Lucide React**, **date-fns**, **React Day Picker** y **Driver.js**.

### Backend y datos

![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?style=flat-square&logo=supabase&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white)

**Supabase** concentra autenticación y acceso a datos sobre **PostgreSQL**, integrado desde el frontend mediante **Supabase JS**.

### Reportes y calidad

![ExcelJS](https://img.shields.io/badge/ExcelJS-217346?style=flat-square&logo=microsoftexcel&logoColor=white)
![Vitest](https://img.shields.io/badge/Vitest-6E9F18?style=flat-square&logo=vitest&logoColor=white)
![ESLint](https://img.shields.io/badge/ESLint-4B32C3?style=flat-square&logo=eslint&logoColor=white)
![Locust](https://img.shields.io/badge/Locust-Load_Testing-2F855A?style=flat-square)

- **ExcelJS** — generación de archivos Excel.
- **Vitest** — tests automatizados.
- **ESLint** — análisis estático.
- **Locust** — pruebas de carga.

## Instalación local

```bash
git clone https://github.com/AgustinWojtyszyn/app_mantenimiento_sf.git
cd app_mantenimiento_sf
npm install
```

Crear `.env`:

```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-clave-publica
```

Ejecutar:

```bash
npm run dev
```

## Scripts

| Comando | Uso |
|---|---|
| `npm run dev` | Desarrollo local |
| `npm run build` | Build de producción |
| `npm run preview` | Preview del build |
| `npm run lint` | Análisis estático |
| `npm test` | Tests automatizados |

## Seguridad

Las variables `VITE_*` quedan expuestas al frontend y deben contener únicamente credenciales aptas para cliente. No incluir `service_role`, contraseñas, tokens privados ni secretos administrativos.

---

<div align="center">

**Desarrollado por [Agustin Wojtyszyn](https://github.com/AgustinWojtyszyn)**

</div>
