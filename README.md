# Portal PEvAU - Matemáticas Aplicadas a las Ciencias Sociales II

Web estática para organizar vídeos de resolución de ejercicios de PEvAU de 2.º de Bachillerato del IES Marqués de Comares.

## Añadir un vídeo

Toda la información está en `data/videos.json`. Para añadir un vídeo, localiza el bloque correspondiente y agrega un objeto dentro de su lista `videos`:

```json
{
  "year": "2026",
  "convocatoria": "Junio",
  "title": "Ejercicio de programación lineal",
  "description": "Resolución paso a paso",
  "youtube": "https://www.youtube.com/watch?v=ID_REAL_DEL_VIDEO",
  "origen": "sergio"
}
```

No es necesario modificar HTML, CSS ni JavaScript. La portada calculará el número de vídeos y la ficha aparecerá con filtros y buscador. Si la URL es válida de YouTube, se mostrará automáticamente su miniatura.

### Sello de procedencia

Cada tarjeta muestra un sello sobre la miniatura. Usa `"origen": "sergio"` para los vídeos del profesor Sergio Jodral. Para un vídeo de otro docente de YouTube, usa `"origen": "profesor"` e indica su nombre en `autor`:

```json
{
  "year": "2026",
  "convocatoria": "Junio",
  "title": "Ejercicio resuelto por otro profesor",
  "description": "Resolución paso a paso",
  "youtube": "https://www.youtube.com/watch?v=ID_REAL_DEL_VIDEO",
  "origen": "profesor",
  "autor": "Nombre del profesor"
}
```

Si no se especifica `origen`, el vídeo se mostrará como propio.

## Añadir o editar bloques

En el mismo archivo, cada bloque tiene `id`, `numero`, `nombre` y `videos`. Puedes cambiar el orden, añadir bloques o renombrarlos sin tocar el resto de la web. El `id` debe ser único y sencillo, por ejemplo `algebra-lineal`.

## Logotipos

Consulta `assets/README.md` para los nombres previstos de los logotipos.

## Publicación

Al ser una web HTML, CSS y JavaScript sin compilación, puede publicarse directamente con GitHub Pages. En el repositorio de GitHub, activa Pages desde la rama principal y la carpeta raíz.

Para probarla en local, utiliza un servidor estático, por ejemplo la extensión Live Server de VS Code. Abrir `index.html` directamente no permitirá que el navegador lea `data/videos.json` por las restricciones de seguridad del navegador.
