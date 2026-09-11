# Tejido nervioso: 2 rondas de 15 preguntas

Enlace de clase: https://alcocermed.com/juegos/?tema=tejido-nervioso

Las 25 preguntas de selección incluyen ilustraciones originales de Servier Medical Art obtenidas de Wikimedia Commons; las 5 de verdadero/falso permanecen sin imagen. La asignación por ID está en `tejido-nervioso-imagenes.js`, con archivos locales y créditos en `assets/tejido-nervioso/README.md`. No requiere volver a importar las preguntas a Supabase.

El acceso solicita nombre y apellidos y crea una sesión individual, separada de la cuenta habitual del navegador. Al regresar desde el mismo navegador conserva esa sesión. El motor existente registra participación y resultados en Supabase. «Entrar con otro nombre» cierra la sesión de clase para un dispositivo compartido.

Antes de compartirlo, importar el SQL y comprobar ambas rondas con una sesión de estudiante. Mientras las evaluaciones no estén publicadas, el formulario muestra que el profesor está habilitando el juego y no crea cuentas.

Fuente: presentación del usuario, hasta la primera diapositiva titulada Mielina (40). La 39 es un resumen de neuroglía.

Cada ronda se abre como una evaluación en MORFOFUNCION. Se juegan sus 15 preguntas completas, en orden, sin repetición entre rondas. Se mantienen puntuación, temporizador y comodines de la plataforma.

Para activar ambos juegos, ejecutar `SUPABASE_IMPORT_MORFO_TEJIDO_NERVIOSO_2_RONDAS_30.sql` en Supabase SQL Editor. El archivo por sí solo no publica las preguntas.

## Tejido nervioso — Ronda 1: organización y neuronas
Código: NEURO26R1

1. **¡Ubica el centro de mando! ¿Qué estructuras forman el sistema nervioso central?** (mc; diap. 2–5)
   - Encéfalo y médula espinal ✓
   - Nervios y ganglios
   - Encéfalo y nervios periféricos
   - Ganglios y médula espinal

2. **Selecciona los dos componentes del sistema nervioso periférico.** (ms; diap. 4–5)
   - Encéfalo
   - Nervios ✓
   - Médula espinal
   - Ganglios ✓

3. **Detectas un cambio en el ambiente. ¿Qué secuencia resume la respuesta del sistema nervioso?** (mc; diap. 2–4)
   - Respuesta motora, integración y detección
   - Integración, respuesta motora y detección
   - Detección sensorial, integración y respuesta motora ✓
   - Detección sensorial, respuesta motora e integración

4. **Una señal viaja desde un receptor hacia el SNC. ¿Por qué división circula?** (mc; diap. 6–7)
   - Motora somática
   - Motora visceral
   - Eferente
   - Sensorial o aferente ✓

5. **Verdadero o falso: la división motora o eferente lleva señales desde el SNC hacia músculos y glándulas.** (tf; diap. 7)
   - Verdadero ✓
   - Falso

6. **¿Cuál es un ejemplo de información sensorial visceral?** (mc; diap. 6–7)
   - Señales de la piel
   - Señales del estómago ✓
   - Señales de las articulaciones
   - Señales de los músculos esqueléticos

7. **Levantas la mano para responder en clase. ¿Qué división lleva la orden al músculo esquelético?** (mc; diap. 7–8)
   - Sensorial visceral
   - Motora visceral
   - Motora somática ✓
   - Sensorial somática

8. **Selecciona las dos divisiones del sistema nervioso autónomo.** (ms; diap. 8)
   - Central
   - Somática
   - Simpática ✓
   - Parasimpática ✓

9. **¡Suena la alarma! ¿Qué división prepara al organismo para actuar aumentando la frecuencia cardiaca?** (mc; diap. 8)
   - Simpática ✓
   - Parasimpática
   - Sensorial somática
   - Sensorial visceral

10. **Verdadero o falso: la división parasimpática estimula la digestión.** (tf; diap. 8)
   - Verdadero ✓
   - Falso

11. **¿Qué clase funcional de neurona detecta estímulos y lleva información hacia el SNC?** (mc; diap. 10–12)
   - Motora
   - Sensorial ✓
   - Interneurona
   - Célula de Schwann

12. **¿Dónde se encuentran las interneuronas según el esquema de clases funcionales?** (mc; diap. 10–12)
   - Solo en los nervios periféricos
   - Solo en los músculos
   - Dentro del SNC ✓
   - En las glándulas

13. **¿Cómo se llama el cuerpo celular de la neurona?** (mc; diap. 14)
   - Axolema
   - Dendrita
   - Botón sináptico
   - Soma o pericarion ✓

14. **Selecciona las afirmaciones correctas sobre los cuerpos de Nissl.** (ms; diap. 14)
   - Se relacionan con el retículo endoplasmático rugoso ✓
   - Se encuentran en el soma ✓
   - Son vainas de mielina
   - Son los núcleos de las células de Schwann

15. **Verdadero o falso: las dendritas suelen ser el principal sitio de recepción de señales de otras neuronas.** (tf; diap. 16)
   - Verdadero ✓
   - Falso

## Tejido nervioso — Ronda 2: neuroglía y mielina
Código: NEURO26R2

1. **La señal debe viajar hacia otras células. ¿Qué prolongación neuronal está especializada en conducirla?** (mc; diap. 16–17)
   - Dendrita
   - Axón ✓
   - Nucléolo
   - Cuerpo de Nissl

2. **¿Cómo se denomina la membrana plasmática del axón?** (mc; diap. 17)
   - Axoplasma
   - Neurilema
   - Axolema ✓
   - Soma

3. **¿Qué contienen las vesículas de un botón sináptico?** (mc; diap. 18–19)
   - Cuerpos de Nissl
   - Núcleos de neuronas
   - Capas de mielina
   - Neurotransmisores ✓

4. **Una neurona tiene un axón y varias dendritas. ¿Cómo se clasifica por su estructura?** (mc; diap. 20–27)
   - Multipolar ✓
   - Bipolar
   - Unipolar
   - Anaxónica

5. **Verdadero o falso: una neurona bipolar tiene un axón y una dendrita que salen del soma.** (tf; diap. 20–27)
   - Verdadero ✓
   - Falso

6. **Un paquete sale del soma y avanza por el axón. ¿Qué transporte está realizando?** (mc; diap. 28)
   - Retrógrado
   - Anterógrado ✓
   - Exclusivamente dendrítico
   - Desde el axón hacia el soma

7. **Selecciona las asociaciones correctas del transporte axonal.** (ms; diap. 28–30)
   - Anterógrado: desde el soma hacia el axón ✓
   - Retrógrado: desde el axón hacia el soma ✓
   - Anterógrado: siempre hacia el soma
   - Retrógrado: siempre se aleja del soma

8. **¿Qué célula produce mielina en el sistema nervioso central?** (mc; diap. 32)
   - Célula satélite
   - Microglía
   - Oligodendrocito ✓
   - Célula ependimaria

9. **¿Qué células revisten las cavidades internas del encéfalo y el conducto central de la médula espinal?** (mc; diap. 32–34)
   - Células de Schwann
   - Células satélite
   - Oligodendrocitos
   - Células ependimarias ✓

10. **¡Equipo de limpieza! ¿Qué células retiran microorganismos y restos celulares por fagocitosis en el SNC?** (mc; diap. 33–34)
   - Microglía ✓
   - Astrocitos
   - Células satélite
   - Células de Schwann

11. **Selecciona dos funciones de los astrocitos.** (ms; diap. 35–36)
   - Formar toda la mielina periférica
   - Ayudar a mantener la barrera hematoencefálica ✓
   - Regular la composición química del líquido tisular ✓
   - Revestir los somas de los ganglios periféricos

12. **¿Qué células rodean los somas neuronales de los ganglios del SNP y regulan su entorno?** (mc; diap. 37)
   - Microglía
   - Células ependimarias
   - Células satélite ✓
   - Oligodendrocitos

13. **Verdadero o falso: las células de Schwann producen la mielina del sistema nervioso central.** (tf; diap. 37–40)
   - Verdadero
   - Falso ✓

14. **¿Qué describe mejor la vaina de mielina?** (mc; diap. 40)
   - Una agrupación de somas en un ganglio
   - Una prolongación que recibe señales
   - El núcleo de una neurona
   - Una cubierta aislante alrededor de una fibra nerviosa ✓

15. **Reto final: selecciona las afirmaciones correctas sobre la mielina.** (ms; diap. 40)
   - Tiene un alto contenido de lípidos ✓
   - La producen oligodendrocitos en el SNC ✓
   - La producen células de Schwann en el SNP ✓
   - Está compuesta únicamente por proteínas
