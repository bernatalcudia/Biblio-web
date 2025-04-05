## **"BiblioWeb Interactiva" 📚🛒**

**Introducción:**
¡Es hora de poner en práctica todo lo aprendido! En este proyecto, construiremos una aplicación web interactiva desde cero utilizando HTML, CSS y JavaScript vanilla. Integraremos una API externa para buscar libros, gestionaremos un carrito de la compra simulado usando `localStorage` y trabajaremos en equipo siguiendo buenas prácticas con Git y Trello.

**Objetivo General:**
Desarrollar una Single Page Application (SPA) que permita a los usuarios buscar libros en la API de OpenLibrary, ver los resultados, añadirlos a un carrito de la compra virtual y simular el proceso de compra. La aplicación debe ser funcional, visualmente agradable y estar desplegada online.

**Descripción Funcional de la Aplicación:**

La aplicación constará de una única página (`index.html`) con diferentes secciones (contenedores) que se mostrarán u ocultarán según la interacción del usuario:

1.  **Página de Inicio / Búsqueda (Contenedor 1 - Visible por defecto):**
    *   Un título claro para la aplicación (Ej: "BiblioWeb Interactiva").
    *   Un campo de entrada (`input type="text"`) para que el usuario escriba su búsqueda.
    *   Un menú desplegable (`select` o `radio`) para elegir el tipo de búsqueda: por Título, por Autor o por Año de publicación.
    *   Un botón (`button`) "Buscar".
    *   **Acción:** Al hacer clic en "Buscar":
        *   Se realiza una petición `fetch` a la API de OpenLibrary (`https://openlibrary.org/search.json?...`) usando el término de búsqueda y el tipo seleccionado.
        *   **Importante:** Limitar siempre los resultados a un máximo de 10 libros.
        *   Los resultados obtenidos se mostrarán en el Contenedor 2.
        *   Cualquier búsqueda previa en el Contenedor 2 debe ser eliminada antes de mostrar los nuevos resultados.

2.  **Resultados de Búsqueda (Contenedor 2 - Oculto por defecto, visible tras búsqueda):**
    *   Este contenedor mostrará los resultados de la búsqueda.
    *   Cada libro se presentará en una "tarjeta" individual que debe mostrar:
        *   Título del libro.
        *   Autor(es).
        *   Año de la primera publicación.
        *   Género(s) (si la API lo proporciona fácilmente, ¡investigad!).
        *   Imagen de la portada (si la API la proporciona, ¡investigad cómo obtenerla!). Si no hay imagen, mostrar un placeholder o nada.
        *   Un botón "Añadir a la Cesta" 🛒.
    *   **Acción:** Al hacer clic en "Añadir a la Cesta":
        *   El libro se añade al carrito (gestionado con `localStorage`).
        *   Se debe almacenar el identificador único del libro (busquen qué campo de la API sirve para esto, ej: `key`) y la cantidad (inicialmente 1).
        *   **Importante:** Si se intenta añadir el mismo libro varias veces, solo debe contar como una entrada en el carrito, pero su cantidad sí podría incrementarse (ver Contenedor 3).
        *   El contador del icono del carrito (ver punto 4) se actualiza para reflejar el número total de *tipos* de libros diferentes en la cesta (no la suma total de unidades).

3.  **Icono del Carrito y Contador (Siempre visible, excepto quizás en la vista de cesta):**
    *   En una esquina superior (ej: derecha), mostrar un icono de carrito de la compra.
    *   Al lado del icono, mostrar un número que represente cuántos *tipos diferentes* de libros hay en la cesta. Inicialmente será "0" (o que no ponga nada).
    *   **Acción:** Al hacer clic en este icono:
        *   Se ocultan los Contenedores 1 y 2.
        *   Se muestra el Contenedor 3 (la vista detallada del carrito).

4.  **Vista del Carrito (Contenedor 3 - Oculto por defecto):**
    *   Un título (Ej: "Tu Cesta de Libros").
    *   Una lista/tabla con los libros añadidos. Cada fila/elemento debe mostrar:
        *   Título del libro.
        *   Imagen (si se obtuvo).
        *   Cantidad actual de ese libro en la cesta.
        *   Controles para modificar la cantidad:
            *   Un botón "+" para añadir una unidad más de ese libro.
            *   Un botón "-" para quitar una unidad.
            *   Un botón "Quitar" (o un icono de papelera 🗑️) para eliminar completamente ese libro de la cesta.
    *   **Acción de los controles:**
        *   `+`: Incrementa la cantidad en `localStorage` y actualiza la vista del carrito.
        *   `-`: Decrementa la cantidad en `localStorage`. Si la cantidad llega a 0, el libro se elimina automáticamente de la cesta. Actualiza la vista.
        *   `Quitar`: Elimina el libro directamente de `localStorage` y actualiza la vista.
        *   **Importante:** Cada vez que el carrito se modifica (añadir, quitar, cambiar cantidad), el contador del icono del carrito (punto 3) debe actualizarse si cambia el número de *tipos* de libros.
    *   Al final del contenedor, un botón "Procesar Compra".
    *   **Acción "Procesar Compra":**
        *   Muestra un mensaje emergente (`alert` o un modal simple) confirmando la compra (Ej: "¡Gracias por tu compra!").
        *   Vacía completamente el carrito en `localStorage`.
        *   Oculta el Contenedor 3.
        *   Muestra el Contenedor 1 (la vista inicial de búsqueda).
        *   Resetea el contador del icono del carrito a "0".

**Requerimientos Técnicos:**

*   **HTML:** Un único archivo `index.html` semánticamente correcto.
*   **CSS:** Un único archivo `style.css` para dar estilo y layout a la aplicación. Se valora un diseño limpio y responsive (aunque no sea el foco principal).
*   **JavaScript:** Un único archivo `script.js`.
    *   Utilizar JavaScript Vanilla (ES6+).
    *   Uso obligatorio de `fetch` con `async/await` o Promesas para las llamadas a la API.
    *   Uso obligatorio de `localStorage` para persistir el estado del carrito.
    *   Manipulación del DOM para crear/modificar elementos y gestionar eventos.
    *   Código bien estructurado: usar funciones para modularizar (ej: `buscarLibros()`, `mostrarResultados()`, `añadirAlCarrito()`, `mostrarCarrito()`, `actualizarLocalStorage()`, etc.).
*   **API:** OpenLibrary API (`https://openlibrary.org/dev/docs/api/search`). Investiguen cómo construir las URLs de búsqueda según el tipo (título, autor, año) y cómo obtener los datos necesarios (título, autor, año, ID, portada, género). ¡La exploración de la API es parte del ejercicio!
*   **Control de Versiones:** Uso obligatorio de Git y GitHub.
    *   Trabajar en un repositorio **único** por equipo (aunque luego os los podéis compartir para quedar para vuestros portfolios).
    *   Cada miembro debe trabajar en **ramas separadas** para sus funcionalidades o tareas (`feature/nombre-funcionalidad`).
    *   Integrar el código mediante **Pull Requests (PRs)** que deben ser revisadas (al menos conceptualmente) por otro miembro del equipo antes de hacer `merge` a la rama principal (`main` o `master`).
*   **Gestión de Proyecto:**
    *   Crear y utilizar un tablero mínimo en **Trello**.
    *   Desglosar las tareas necesarias para construir la aplicación (Ej: "Crear estructura HTML", "Estilar contenedor búsqueda", "Implementar fetch a API", "Implementar lógica añadir carrito", "Guardar en localStorage", "Crear vista carrito", "Desplegar en Render", etc.).
    *   Asignar responsables y estimar (de forma sencilla) el esfuerzo.
    *   Mover las tareas por las columnas del tablero (Ej: Pendiente, En Progreso, Hecho) a medida que avanzan.

**Despliegue:**

*   La aplicación final debe estar desplegada y accesible públicamente a través de una URL.
*   Podéis usar **Render** o si no **Firebase**.

**Consejos y Pistas:**

*   **API de OpenLibrary:** Dedicad tiempo a explorar cómo funciona. Ved qué endpoints usar y qué parámetros aceptan. Probad las URLs directamente en el navegador para ver qué datos devuelve. ¡Ojo! No sabemos si todos los libros tendrán portada o género. Gestionadlo como creais que es mejor.
*   **Estructura JS:** Dividir el código en funciones pequeñas y reutilizables. Idealmente tener funciones específicas para:
    *   Realizar la petición fetch.
    *   Renderizar las tarjetas de resultados.
    *   Renderizar la vista del carrito.
    *   Actualizar el `localStorage`.
    *   Gestionar la visibilidad de los contenedores.
*   **Gestión de Estado Simple:** Se pueden usar clases CSS en el `<body>` o en los contenedores para controlar qué se muestra y qué se oculta.
*   **`localStorage`:** Ojo que solo almacena strings. Usar `JSON.stringify()` para guardar objetos/arrays y `JSON.parse()` para recuperarlos.
*   **Event Listeners:** Atención a cómo añadir listeners, especialmente a elementos que se crean dinámicamente (como los botones en las tarjetas de resultados o en el carrito). 


**Entregables:**

Al finalizar el plazo establecido, cada equipo deberá proporcionar:

1.  **Enlace al Repositorio de Git** (GitHub).
2.  **Enlace a la Aplicación Desplegada** (URL pública en Render, Firebase, etc.).
3.  **Enlace al Tablero de Trello**  utilizado para la gestión del proyecto.

