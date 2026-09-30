# Encéfalo dentro del juego original

Entrada: https://www.alcocermed.com/juegos/ → MORFOFUNCION.

Las dos nuevas tarjetas aparecen primero en la lista original:
- Ronda 1: Organización y meninges, 10 preguntas (diapositivas 2–14).
- Ronda 2: Ventrículos, LCR y barreras, 10 preguntas (15–26; la 27 es la portada de rombencéfalo).

Todas tienen imágenes de la presentación. Se usan selección única, selección múltiple, verdadero/falso y relación. Conservan el motor existente, sus comodines, rachas, resultados y podio. Las relaciones se responden mediante selectores accesibles en PC y celular. Las explicaciones se incluyen en el resumen final.

## Acceso temporal

El login original pide nombre y apellidos hasta el 1 de octubre de 2026 a las 06:00 de Bolivia (10:00 UTC). Después vuelve automáticamente a correo y contraseña. El botón «Entrar con mi cuenta / Profesor» conserva el acceso habitual durante la clase.

Se reutiliza el alta automática de invitados que ya estaba habilitada: el alumno no introduce correo ni contraseña y el profesor no registra alumnos manualmente. Internamente Supabase Auth conserva una identidad automática para cumplir la referencia de los resultados a auth.users; no es un acceso sin registros de Auth. La sesión invitada tiene vencimiento y el cliente comprueba su cierre cada 15 segundos. No se cambian las políticas de acceso de Supabase. Las cuentas habituales conservan su funcionamiento.

El resultado se actualiza al responder. El podio original consulta los resultados cada cinco segundos. Cada ronda tiene su podio; se puede mantener abierto mientras terminan otros estudiantes. La conexión a Internet es necesaria para guardar y compartir puntajes.

## Datos y publicación

`SUPABASE_ENCEFALO_20.sql` añade las dos evaluaciones y veinte preguntas a las tablas originales. Es reejecutable por ID y conserva otras evaluaciones. `tools/build_encefalo_native.cjs` lo genera desde el banco revisado y prepara el mapa de imágenes. El SQL se ejecutó en el proyecto existente asnwhddmurstzmghuyin y confirmó dos rondas de diez.

El antiguo enlace `/juegos/encefalo.html` redirige al juego original. Ya no se ofrece un juego separado.

## Anki

`encefalo-anki-1.csv` y `encefalo-anki-2.csv`: diez notas cada uno, UTF-8, campos Front y Back, importación como Básico. Las tres primeras líneas son directivas de Anki.

## Verificación

- `node --test tests/*.test.cjs`: vencimiento en hora de Bolivia, relaciones completas/incorrectas, imágenes, integración y regresiones del motor de comodines y tejido nervioso.
- `node tools/check_encefalo.cjs`: 20 preguntas, cuatro tipos en cada ronda, imágenes y 20 notas Anki.
- Prueba real con Supabase en el motor original: acceso por nombre, respuestas, puntuación y podio.
- Revisión de presentación en celular de 390 px y escritorio.
