# 🔧 Mantenimiento · ServiFood

Plataforma web para centralizar la gestión operativa y de mantenimiento de ServiFood: trabajos diarios, personal, costos, vehículos, planta, documentación y reportes.

## Funcionalidades principales

- Registro y seguimiento de trabajos diarios.
- Solicitudes de mantenimiento con estados, prioridades y asignaciones.
- Gestión de trabajadores y grupos de trabajo.
- Panel diario y panel mensual con filtros e indicadores.
- Control de costos, importes y balance estimado.
- Exportación de reportes a Excel.
- Gestión de vehículos, choferes, combustible y recorridos.
- Mantenimiento preventivo y correctivo.
- Control de documentación y vencimientos.
- Registro de equipos, sectores, incidencias y revisiones de planta.
- Roles, permisos y rutas protegidas.
- Interfaz responsive con modo claro/oscuro y soporte ES/EN.

## Tecnologías utilizadas

### Frontend

- **React 18** — interfaz de usuario.
- **Vite 5** — desarrollo y build.
- **React Router 6** — navegación.
- **Tailwind CSS 3** — estilos.
- **Radix UI** — componentes accesibles.
- **Framer Motion** — animaciones y transiciones.
- **Lucide React** — iconografía.
- **date-fns / React Day Picker** — fechas y calendarios.
- **Driver.js** — tutoriales guiados.

### Backend y datos

- **Supabase** — backend y acceso a datos.
- **PostgreSQL** — base de datos.
- **Supabase Auth** — autenticación y sesiones.
- **Supabase JS** — cliente de integración con el frontend.

### Reportes y calidad

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

Crear un archivo `.env`:

```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-clave-publica
```

Iniciar el entorno de desarrollo:

```bash
npm run dev
```

## Scripts

```bash
npm run dev
npm run build
npm run preview
npm run lint
npm test
```

## Seguridad

Las variables `VITE_*` quedan expuestas al frontend y deben contener únicamente credenciales aptas para cliente. Nunca incluir `service_role`, contraseñas, tokens privados ni secretos administrativos.

## Estado

Proyecto en desarrollo activo y uso operativo.

## Autor

**Agustin Wojtyszyn** · Full-Stack Developer  
GitHub: [@AgustinWojtyszyn](https://github.com/AgustinWojtyszyn)
