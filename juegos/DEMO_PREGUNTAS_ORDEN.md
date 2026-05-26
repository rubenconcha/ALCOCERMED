# Preguntas del demo — mismo orden para todos

Por defecto, **evaluacion 1** ya usa las preguntas en orden según el campo **`orden`** en Supabase (1, 2, 3…), sin mezclar al azar. Todos los estudiantes ven las mismas 10 primeras (por orden).

## Cómo decirme / cambiar el orden tú mismo

Edita en `juegos/app.js` el bloque **`DEMO_FIXED_QUIZZES`** (busca ese nombre en el archivo).

### Opción A — Orden del editor (recomendado)

En Supabase o en el editor de la evaluación, cada pregunta tiene un número **orden** (0, 1, 2… o 1, 2, 3…).

Para forzar un orden concreto, descomenta y edita:

```javascript
questionOrden: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
```

Eso significa: primero la pregunta con `orden = 1`, luego la de `orden = 2`, etc.

### Opción B — Por UUID (máximo control)

1. En Supabase → Table Editor → `evaluacion_preguntas`
2. Filtra por tu `evaluacion_id` de **evaluacion 1**
3. Copia los `id` (UUID) en el orden que quieras

```javascript
evaluacionId: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
questionIds: [
  'uuid-pregunta-1',
  'uuid-pregunta-2',
  'uuid-pregunta-3'
],
maxQuestions: 10
```

### Opción C — Solo por título de la evaluación

Si el título contiene `evaluacion 1`:

```javascript
matchTitle: 'EVALUACION 1',
maxQuestions: 10,
orderMode: 'orden'
```

## Cómo enviármelo por chat

Puedes mandarme cualquiera de estos formatos:

1. **Lista de números de orden:**  
   `1, 2, 5, 3, 4, 6, 7, 8, 9, 10`

2. **Lista de UUIDs** (de Supabase)

3. **Captura** del editor con las preguntas numeradas

4. **Texto de las preguntas** en el orden deseado (yo localizo el orden en la BD)

## Después de cambiar `app.js`

Sube el archivo al servidor y recarga con **Ctrl+F5**, o dime y lo ajusto en el repo.
