# Suficiencia académica

Menú lateral: simulacro integral, matemáticas, física, química y lectura comprensiva. El simulacro elige 10 preguntas por área, incluyendo dos lecturas completas de cinco preguntas cada una; 40 preguntas y 60 minutos de práctica. La selección cambia en cada intento. Práctica por materia con el banco completo y seis lecturas individuales.

Fuente nueva autorizada expresamente por el usuario el 30/10/2026: `MEDICINA EXÁMENES PASADOS ABP.pdf` (44 páginas escaneadas, UMSA). Se conserva el SHA-256 y la referencia de cada pregunta en el banco privado. Claves razonadas; no se recibió un patrón oficial. El origen UMSA se distingue de la plataforma de preparación UMSS.

Lectura: seis adaptaciones didácticas del capítulo 1 de Kenneth S. Saladin, Anatomía y fisiología: la unidad entre forma y función, 6.ª edición. Créditos verificados en páginas PDF 5 y 6; contenido en páginas PDF 36, 37, 42 y 45, páginas impresas 8, 9, 14 y 17. Cada texto conserva su sección, páginas y autor. No se atribuyen esas lecturas al examen ABP.

`api/_sufficiency/source-audit.json` registra exclusiones, adaptaciones, fuentes y criterio de corrección. No se han alterado ni publicado los PDF originales. Las preguntas ambiguas o con opciones incompatibles con el cálculo quedan fuera de calificación.

El banco se entrega por `/api/suficiencia` con sesión y suscripción activa verificadas en Supabase. Sin caché compartida ni service role. La ruta de archivos privados se deniega en Vercel. El progreso, marcas, respuestas y resultado del último intento se guardan por usuario en localStorage del navegador; no se guardan textos ni claves en ese estado. El plazo se basa en una fecha absoluta y continúa al salir de la sección o recargar. No se sincroniza el progreso entre dispositivos. Cambiar de cuenta limpia la memoria del módulo.

Verificación: `node --test tests/suficiencia.test.cjs`. Cubre selección equilibrada, pasajes completos, alternativas A–E, corrección, restauración y aislamiento por cuenta, referencias, erratas y permisos del endpoint. Validación visual con la interfaz real del módulo en escritorio y 390 px de ancho.
