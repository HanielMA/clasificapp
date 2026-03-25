# AGENTS.md

## Propósito del proyecto

Este proyecto no debe construirse como una prueba de concepto, demo rápida o prototipo desechable.  
Debe plantearse como una aplicación real, mantenible, extensible y bien estructurada, siguiendo buenas prácticas de arquitectura y desarrollo de software.

La aplicación consiste en un sistema de clasificación personal con una única aplicación y múltiples módulos funcionales. Inicialmente tendrá dos dominios principales:

- Plantas
- Libros

En el futuro podrán añadirse nuevas categorías.

---

## ⚠️ Restricción clave: NO HAY BACKEND

Actualmente la aplicación es **100% frontend**.

Esto implica:

- No existe backend
- No existen APIs propias
- No existe base de datos persistente en servidor
- No hay autenticación ni usuarios

La gestión de datos será:

- En memoria (volátil), o
- Persistida en `localStorage`

### Reglas obligatorias sobre datos

- No diseñar endpoints backend
- No simular microservicios innecesariamente
- No inventar APIs internas

Pero:

- Sí diseñar como si en el futuro hubiera backend
- Sí usar abstracciones (repositorios, servicios)
- Sí mantener arquitectura limpia

👉 Ahora = frontend-only  
👉 Diseño = preparado para backend futuro

---

## Rol esperado del agente

Actúa como:

- Arquitecto de software senior
- Ingeniero frontend avanzado

Debes:

- Diseñar antes de implementar
- Separar responsabilidades
- Mantener arquitectura limpia
- Evitar soluciones rápidas mal diseñadas

---

## Arquitectura obligatoria

Separación clara en capas incluso siendo frontend:

- Presentación (componentes UI)
- Aplicación (casos de uso / services)
- Dominio (modelos)
- Infraestructura (localStorage, APIs externas)

---

## Gestión de datos (localStorage)

❌ PROHIBIDO:

- usar `localStorage` directamente en componentes

✅ OBLIGATORIO:

- encapsular acceso en repositorios
- definir interfaces
- permitir cambiar implementación en el futuro

Ejemplo:

- `PlantRepository`
- `LocalStoragePlantRepository`

---

## Integraciones externas

Solo permitido:

- API pública para libros (ISBN)

Reglas:

- usar adapter/gateway
- desacoplar del dominio
- manejar errores
- permitir sustituir proveedor

---

## 🎨 Uso de librerías UI (IMPORTANTE)

La prioridad es construir una UI limpia, reutilizable y consistente.

### Regla principal

Si los componentes nativos no son suficientes:

👉 **Está permitido usar PrimeNG directamente e instalarlo**

### Uso de PrimeNG

- Se puede usar sin pedir permiso
- Debe usarse con criterio (no sobrecargar)
- Priorizar:
  - tablas
  - formularios
  - inputs
  - cards
  - dialogs
  - calendar
  - dropdowns

Debe integrarse de forma limpia:

- sin romper la arquitectura
- sin meter lógica de negocio en componentes de PrimeNG
- manteniendo separación de responsabilidades

---

### Uso de otras librerías

❗ REGLA OBLIGATORIA:

Si se necesita cualquier otra librería externa (UI o no):

👉 **DEBES preguntar primero antes de usarla**

No está permitido:

- instalar librerías sin justificar
- añadir dependencias innecesarias
- introducir frameworks paralelos

Antes de usar otra librería, debes:

1. Explicar por qué es necesaria
2. Qué problema resuelve
3. Qué impacto tiene
4. Proponer alternativa sin librería si existe

---

## Código limpio

Obligatorio:

- nombres claros
- funciones pequeñas
- clases con responsabilidad única
- sin duplicidad
- sin lógica en componentes innecesaria
- sin acoplamientos fuertes

---

## Diseño para evolución

Aunque ahora uses localStorage:

- diseñar repositorios como si fueran backend
- desacoplar almacenamiento
- permitir crecimiento a nuevas categorías

---

## Dominio

### Plant

- id
- nombre
- nombreCientifico
- categoria
- familia
- latitud
- longitud
- fechaRegistro
- fotos

### Book

- id
- isbn
- titulo
- autor
- categoria
- portadaUrl
- descripcion
- ubicacion
- estrellas

---

## Casos de uso

### Plantas

- crear planta
- añadir fotos
- listar
- filtrar por nombre
- filtrar por fecha
- ver detalle

### Libros

- buscar por ISBN
- consumir API externa
- guardar libro
- listar libros
- valorar libro

---

## Persistencia

- memoria o localStorage
- serialización clara
- validación de datos
- acceso encapsulado

---

## Patrones recomendados

Usar cuando aporte valor:

- Repository
- Service / Use Case
- Adapter
- Mapper
- Strategy (si escala)

---

## UX

- simple pero profesional
- orientado a móvil
- rápido
- visual
- formularios ágiles
- tarjetas limpias

---

## Qué NO debes hacer

- ❌ crear backend
- ❌ simular APIs
- ❌ usar localStorage en componentes
- ❌ meter toda la lógica en UI
- ❌ hacer PoC
- ❌ instalar librerías sin control
- ❌ sobreingeniería absurda

---

## Forma de trabajo

Antes de implementar:

1. arquitectura
2. estructura de carpetas
3. modelos
4. casos de uso
5. estrategia de datos

Después implementar por capas.

---

## Objetivo final

Construir una aplicación frontend:

- limpia
- mantenible
- escalable
- preparada para backend futuro

Pregunta clave:

👉 ¿Podría conectar un backend mañana sin rehacer todo?

Si no, el diseño es incorrecto.

## Regla de calidad

Prefiero una solución simple pero bien diseñada antes que una solución rápida pero mal estructurada.
No sacrifiques la arquitectura por velocidad.
