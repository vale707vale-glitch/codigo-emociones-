# Ascenso

Herramienta de autoconocimiento inspirada en el Mapa de Conciencia de David R. Hawkins. Permite calibrar tu estado emocional actual, registrar disparadores y recibir micro-intervenciones para subir de nivel hacia el Coraje (200).

## Stack

- Next.js 16 (App Router) + React 19 + TypeScript
- Tailwind CSS 4
- Recharts (graficos), canvas-confetti
- Persistencia local en `localStorage` (sin backend)

## Desarrollo

```bash
npm install
npm run dev
```

Abrir http://localhost:3000

## Build de produccion

```bash
npm run build
npm run start
```

## Estructura

- `app/` paginas: inicio, mapa, recursos, insights, diario
- `components/` UI y ejercicios (respiracion, rueda de enfoque, soltar, etc.)
- `lib/` logica: mapa Hawkins, contenido por nivel, intervenciones, insights, storage
- `hooks/useAscenso.ts` estado global del cliente
- `types/` tipos compartidos

## Datos

Todos los datos se guardan en el navegador (`localStorage`). Usa la opcion de backup en Insights para exportar/importar un JSON y no perder tu historial.

## Nota

Es una herramienta de autoconocimiento, no un diagnostico ni sustituto de acompañamiento profesional de salud mental.
