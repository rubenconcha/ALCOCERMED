# Encéfalo: dos rondas visuales

Acceso: `/juegos/encefalo.html`. Está enlazado desde la entrada y la página Jugar.

- Ronda 1: 10 preguntas, diapositivas 2–14, hasta meninges.
- Ronda 2: 10 preguntas, diapositivas 15–26. La diapositiva 27 es la portada de rombencéfalo y mesencéfalo; no contiene desarrollo de ese tema.
- Ambas rondas incluyen selección única, selección múltiple, verdadero/falso y relación. Todas las preguntas tienen imagen, explicación y diapositiva de referencia.
- `encefalo-preguntas.json` y las imágenes se publican junto con el sitio por GitHub/Vercel. No hay que importar SQL ni crear cuentas.

## Uso en clase

1. Abre el juego y pulsa Crear sala de clase.
2. Pulsa Abrir solo el podio y luego Copiar enlace para estudiantes.
3. Cada estudiante entra por ese enlace y escribe su nombre. No usa Supabase Auth, correo ni contraseña.
4. Mantén abierto el podio. Se suman 100 puntos por pregunta correcta, hasta 2000 entre ambas rondas. Los empates comparten puesto.
5. Descarga el CSV de resultados al terminar. Para otra clase crea una sala nueva.

La identidad y el progreso se guardan en localStorage por sala. Recargar y volver a entrar con el mismo nombre conserva el avance; cada ronda puntúa una sola vez por identidad. Los nombres iguales no se fusionan entre dispositivos. Cambiar de nombre crea otra identidad.

El podio usa Broadcast y Presence de Supabase Realtime con la clave pública del proyecto existente. No crea registros en Auth ni en tablas. Los participantes conectados comparten resultados y recuperan un snapshot al entrar o reconectar. Cada navegador conserva los resultados que recibió, también cuando alguien sale; no es un historial central permanente. Es una actividad de clase con identidad declarada, no una evaluación con identidad o puntajes verificados por servidor.

## Anki

`encefalo-anki-1.csv` y `encefalo-anki-2.csv`: UTF-8, dos campos Front/Back, diez notas cada uno. Importar como Básico. Las primeras tres líneas son directivas de importación de Anki, no tarjetas. No dependen de archivos multimedia.

## Validación del 30 de septiembre de 2026

- `node tools/check_encefalo.cjs`: cuenta, tipos, respuestas, imágenes y CSV.
- Prueba de navegador Edge Chromium: 20 preguntas completas, 2000 puntos, respuesta incorrecta, regreso a rondas, recarga, cambio de estudiante, imagen ampliada y guardado sin conexión.
- Revisión visual: PC 1440 px y móvil 390 px; sin desbordamiento horizontal.
- Comunicación entre dos contextos de navegador verificada con transporte simulado. No equivale a una prueba de Supabase en producción.
- Bloqueo externo: el dominio configurado `asnwhddmurstzmghuyin.supabase.co` no resolvió DNS en la prueba real. El juego permite estudiar y guardar resultados locales, pero no puede compartir el podio hasta que el proyecto Supabase esté disponible. No mostrarlo como verificado en vivo hasta repetir una prueba real con dos dispositivos.
