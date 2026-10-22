# Fútbol Stats — tabla de últimos cinco partidos

Esta versión reemplaza la vista anterior por una pantalla enfocada en un solo equipo: escudo de liga/equipo, tarjetas de los cinco partidos más recientes y tabla estadística con promedios.

## Archivos
- `index.html`: estructura de la página.
- `styles.css`: diseño responsive oscuro.
- `app.js`: lectura JSONP de Google Apps Script, selectores, escudos y cálculos.
- `Code.gs`: conector de Apps Script (se mantiene en Google Apps Script; no hace falta subirlo al repositorio público).

## Publicar en GitHub Pages
1. Haz una copia de seguridad de los archivos actuales del repositorio.
2. Sube/reemplaza `index.html`, `styles.css` y `app.js` en la raíz del repositorio `JERG-Analisis-Deportivo`.
3. Mantén la URL activa de Apps Script en `API_URL` dentro de `app.js`. La URL incluida es la que estaba configurada en el proyecto anterior; si tu implementación activa tiene otra URL, reemplázala.
4. Guarda con **Commit changes** y espera la publicación de GitHub Pages.
5. Abre la web y recarga con `Ctrl + F5`.

## Requisitos de Google Sheets
- La pestaña se llama `Partidos`.
- La primera fila contiene los encabezados originales, incluyendo `Liga`, `Fecha`, `Equipo_Local`, `Equipo_Visitante`, goles, xG, tiros, córners, faltas y tarjetas.
- La aplicación muestra los cinco partidos más recientes por fecha. `General`, `Local` y `Visitante` filtran la muestra según la condición del equipo seleccionado.

## Escudos
Se intenta cargar los escudos desde football-data.org. Para clubes no reconocidos o logos que no estén disponibles, la interfaz usa iniciales como alternativa. Los nombres de los equipos deben coincidir con los de la hoja.

## Nota sobre promedios
Los promedios usan únicamente valores numéricos disponibles en los partidos mostrados. En las filas de defensa, las cifras representan los valores del rival frente al equipo seleccionado, usando las estadísticas local/visitante de cada partido.
