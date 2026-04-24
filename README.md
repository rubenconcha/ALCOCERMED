# Prepa Ben Carson — Plataforma Académica Propedéutico

Plataforma de estudio para estudiantes del propedéutico de medicina de la Preparatoria Ben Carson.

## 🚀 Tecnologías

- **Frontend**: HTML5 + CSS3 + JavaScript (Vanilla)
- **Backend / Auth / DB**: [Supabase](https://supabase.com)
- **Hosting**: [Vercel](https://vercel.com)
- **CDN**: Font Awesome, Google Fonts (Outfit)

## 📁 Estructura del proyecto

```
alcocermed/
├── index.html               ← App principal (login + todas las pantallas)
├── styles.css               ← Estilos globales
├── script.js                ← Lógica completa + integración Supabase
├── alcocermed-dashboard.html← Redirige automáticamente a index.html
├── vercel.json              ← Configuración de despliegue Vercel
├── .gitignore               ← Archivos excluidos de git
└── README.md                ← Este archivo
```

## 🗄️ Tablas en Supabase

| Tabla | Descripción |
|-------|-------------|
| `flashcards` | Tarjetas de estudio (columnas: MATERIA, TEMA, PREGUNTA, RESPUESTA) |
| `banco_preguntas` | Preguntas tipo examen (MATERIA, TEMA, PREGUNTA, opciones A-D, RESPUESTA, DIFICULTAD, COMENTARIO) |
| `simulacros` | Exámenes cronometrados oficiales |
| `user_devices` | Control de sesión por dispositivo (máx. 2) |
| `mapas_mentales` | Imágenes de mapas mentales (MATERIA, TITULO, URL_IMAGEN, DESCRIPCION) |
| `videoclases` | Videos por materia |

## 🔐 Variables de entorno (Supabase)

Las credenciales están en `script.js` (líneas 1-2). Son las claves **anon/public** de Supabase — esto es normal y seguro para apps frontend. No expongas la clave `service_role`.

```js
const SUPABASE_URL = 'https://asnwhddmurstzmghuyin.supabase.co';
const SUPABASE_KEY = 'eyJhbGci...'; // anon key — pública
```

## 🛠️ Despliegue en Vercel

### Opción A — Desde GitHub (recomendado)

1. Sube este proyecto a tu repositorio de GitHub
2. Ve a [vercel.com](https://vercel.com) → **New Project**
3. Importa tu repositorio
4. Vercel detecta automáticamente que es un sitio estático
5. Click en **Deploy** — listo ✅

### Opción B — Vercel CLI

```bash
npm i -g vercel
vercel login
vercel --prod
```

## 📱 Módulos disponibles

| Módulo | Función |
|--------|---------|
| **Flashcards** | Técnica Alcocer con spaced repetition (SRS) |
| **Banco de preguntas** | Preguntas tipo examen por materia/tema/dificultad |
| **Simulacros** | Examen cronometrado tipo admisión (30–120 min) |
| **Quiz relámpago** | 10 preguntas a 15 segundos |
| **Ahorcado médico** | Términos de biología celular y morfofunción |
| **Videoclases** | Clases grabadas por materia |
| **Intocables 🔥** | Mapas mentales de temas prioritarios |
| **Mis evaluaciones** | Historial y estadísticas de desempeño |

## 🔒 Seguridad de sesión

- Máximo **2 dispositivos** autorizados por cuenta
- Control de dispositivo activo en tiempo real via Supabase Realtime
- Token de dispositivo guardado en `localStorage` y sincronizado con `user_metadata`
- Al limpiar caché, el token se recupera automáticamente desde la nube

## ⚠️ Notas importantes

- El archivo `alcocermed-dashboard.html` redirige automáticamente a `index.html`
- Toda la app vive en `index.html` — es una SPA (Single Page Application)
- El CSS usa la fuente **Outfit** de Google Fonts — requiere conexión a internet
