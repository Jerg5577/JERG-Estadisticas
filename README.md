# Fútbol Stats — adaptado a tu tabla real

La plataforma está preparada para los encabezados de estadísticas que compartiste. El archivo enviado contiene **501 partidos en 8 ligas**. La página puede mostrar tus datos una vez que los pongas en Google Sheets y publiques Apps Script.

## Columnas que aprovecha
Liga, Fecha, Hora, Equipo_Local, Equipo_Visitante, Goles_Local, Goles_Visitante, Goles esperados (xG), tiros totales, tiros a puerta, faltas, córners, tarjetas amarillas y rojas, además de los goles al descanso y el resultado al descanso.

## 1. Prepara Google Sheets
1. Abre tu Google Sheets.
2. Crea o renombra la pestaña de datos a `Partidos`.
3. Pega la tabla con los encabezados originales en la fila 1. Los nombres deben coincidir exactamente con los de tu archivo, por ejemplo `Equipo_Local`, `Goles_Esperados_Local`, `Tiros_Totales_Local`.
4. Si la tabla está en un archivo de texto TSV, copia todo el contenido y pégalo en la celda A1; Google Sheets suele distribuirlo por columnas automáticamente. Comprueba que cada encabezado quede en su propia columna.

## 2. Publica Apps Script
1. Desde esa hoja abre **Extensiones > Apps Script**.
2. Pega el contenido de `Code.gs` y guarda.
3. Ve a **Implementar > Nueva implementación**.
4. Tipo: **Aplicación web**.
5. Ejecutar como: **Yo**.
6. Quién tiene acceso: **Cualquier persona** para permitir que la web pública lea las estadísticas.
7. Implementa, acepta permisos y copia la URL que termina en `/exec`.

**Privacidad:** la web será pública y el endpoint expone los datos de la pestaña `Partidos`. No pongas datos privados en esa pestaña. Este código es de solo lectura.

## 3. Conecta el frontend
En `app.js`, cambia la línea:

```js
const API_URL = "";
```

por:

```js
const API_URL = "PEGA_AQUI_TU_URL_REAL_DE_APPS_SCRIPT";
```

No escribas el ejemplo literalmente; pega la URL que te dio Google y termina en `/exec`.

## 4. Publica en GitHub Pages
1. Crea un repositorio en GitHub, por ejemplo `futbol-stats`.
2. Sube `index.html`, `styles.css` y `app.js` a la raíz. Puedes subir `README.md` también.
3. En **Settings > Pages**, selecciona **Deploy from a branch**, rama `main`, carpeta `/(root)` y guarda.
4. Espera a que GitHub muestre la URL pública de Pages.

`Code.gs` se pega en Apps Script; no es necesario subirlo al repositorio público.

## 5. Funciones incluidas
- Buscador por liga y equipos.
- Resumen de partidos, goles, promedio de goles y ligas.
- Tabla de partidos con marcador y xG.
- Comparador entre equipos: partidos, victorias/empates/derrotas, puntos, goles, xG/xGA, tiros, tiros a puerta, córners, faltas y tarjetas.
- Diseño adaptable a móvil y computadora.

## Nota sobre los datos
La interfaz presenta los registros que existan en tu hoja; no descarga resultados nuevos automáticamente. El campo `Resultado_Final` usa los códigos de tu fuente (`H`, `D`, `A`), y la primera versión asume que los registros importados son partidos finalizados. Revisa fechas y nombres de equipo antes de usar estadísticas para análisis.


## Módulo Analizador

La sección **Analizador** usa los últimos cinco partidos de cada equipo en general (sin separar local/visitante). Permite elegir una liga, equipo, rival y estadística; muestra los valores individuales, promedios, una referencia combinada, líneas candidatas, frecuencias históricas y una comparación descriptiva con la probabilidad implícita de la cuota.

Las frecuencias son descriptivas de muestras pequeñas y no garantizan el resultado de un partido. Verifica que los partidos tengan fechas válidas y que la pestaña `Partidos` tenga los encabezados esperados.
