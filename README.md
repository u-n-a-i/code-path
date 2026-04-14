<div align="center">

<h1>
  <img src="img/code.svg" width="25">
  {Code-Path}
  <img src="img/path.svg" width="25">
</h1>
</div>

Este repositorio forma parte del proyecto [Bóveda-IT](https://github.com/u-n-a-i/boveda-it). Mientras el otro proyecto documenta los fundamentos, arquitecturas y marcos conceptuales, aquí encontrarás el **código, configuraciones y laboratorios** para llevar esa teoría a entornos reales.

<h2>📑 Contenido</h2>

<!-- - [Entorno de desarrollo](#entorno-de-desarrollo)
  - [Linux](#linux)
  - [Git \& GitHub](#git--github)
  - [Docker](#docker) -->

- [Estructura y estilos](#estructura-y-estilos)
  - [HTML](#html)
  - [CSS](#css)
- [Ecosistema JavaScript](#ecosistema-javascript)
  - [JavaScript](#javascript)
    - [Core](#core)
    - [Web](#web)
  - [TypeScript](#typescript)
  - [Jest](#jest)
  - [Node.js](#nodejs)
  - [Angular](#angular)

---

> [!WARNING]
>
> El proyecto **está en desarrollo**, por lo que puede que encuentres enlaces vacíos o secciones aún en construcción, pensadas como guía para el futuro.

[![Estado: En desarrollo](https://img.shields.io/badge/Estado-En%20desarrollo-yellow?style=plastic)]()

<br/>

<!-- ## Entorno de desarrollo

### Linux

[![Linux](https://img.shields.io/badge/notas-FCC624?style=for-the-badge&logo=Linux&logoColor=black)]()

### Git & GitHub

[![Git](https://img.shields.io/badge/notas-F05032?style=for-the-badge&logo=Git&logoColor=white)]()

### Docker

[![Docker](https://img.shields.io/badge/notas-2496ED?style=for-the-badge&logo=Docker&logoColor=white)]()

--- -->

## Estructura y estilos

### HTML

[![HTML](https://img.shields.io/badge/cabecera-E34F26?style=for-the-badge&logo=HTML5&logoColor=white)](https://github.com/u-n-a-i/code-path/blob/master/html/cabecera/cabecera.html)
[![HTML](https://img.shields.io/badge/textos-E34F26?style=for-the-badge&logo=HTML5&logoColor=white)](https://github.com/u-n-a-i/code-path/blob/master/html/elementos/texto.html)
[![HTML](https://img.shields.io/badge/enlaces-E34F26?style=for-the-badge&logo=HTML5&logoColor=white)](https://github.com/u-n-a-i/code-path/blob/master/html/elementos/enlaces.html)
[![HTML](https://img.shields.io/badge/listas-E34F26?style=for-the-badge&logo=HTML5&logoColor=white)](https://github.com/u-n-a-i/code-path/blob/master/html/elementos/listas.html)
[![HTML](https://img.shields.io/badge/tablas-E34F26?style=for-the-badge&logo=HTML5&logoColor=white)](https://github.com/u-n-a-i/code-path/blob/master/html/elementos/tablas.html)
[![HTML](https://img.shields.io/badge/formularios-E34F26?style=for-the-badge&logo=HTML5&logoColor=white)](https://github.com/u-n-a-i/code-path/blob/master/html/elementos/formularios.html)
[![HTML](https://img.shields.io/badge/multimedia-E34F26?style=for-the-badge&logo=HTML5&logoColor=white)](https://github.com/u-n-a-i/code-path/blob/master/html/elementos/multimedia.html)
[![HTML](https://img.shields.io/badge/interactivas-E34F26?style=for-the-badge&logo=HTML5&logoColor=white)](https://github.com/u-n-a-i/code-path/blob/master/html/elementos/interactivas.html)
[![HTML](https://img.shields.io/badge/semantica-E34F26?style=for-the-badge&logo=HTML5&logoColor=white)](https://github.com/u-n-a-i/code-path/blob/master/html/buenas-practicas/semantica.html)
[![HTML](https://img.shields.io/badge/aria%20role-E34F26?style=for-the-badge&logo=HTML5&logoColor=white)](https://github.com/u-n-a-i/code-path/blob/master/html/buenas-practicas/aria_role.html)
[![HTML](https://img.shields.io/badge/tab%20index-E34F26?style=for-the-badge&logo=HTML5&logoColor=white)](https://github.com/u-n-a-i/code-path/blob/master/html/buenas-practicas/tabindex.html)

### CSS

[![CSS](https://img.shields.io/badge/bases-663399?style=for-the-badge&logo=css&logoColor=white)](https://github.com/u-n-a-i/code-path/tree/master/css/bases)
[![CSS](https://img.shields.io/badge/selectores-663399?style=for-the-badge&logo=css&logoColor=white)](https://github.com/u-n-a-i/code-path/tree/master/css/selectores)
[![CSS](https://img.shields.io/badge/pseudoclases-663399?style=for-the-badge&logo=css&logoColor=white)](https://github.com/u-n-a-i/code-path/tree/master/css/pseudoclases)
[![CSS](https://img.shields.io/badge/pseudolementos-663399?style=for-the-badge&logo=css&logoColor=white)](https://github.com/u-n-a-i/code-path/tree/master/css/pseudoelementos)
[![CSS](https://img.shields.io/badge/estructuracion-663399?style=for-the-badge&logo=css&logoColor=white)](https://github.com/u-n-a-i/code-path/tree/master/css/estructuracion)
[![CSS](https://img.shields.io/badge/flexbox-663399?style=for-the-badge&logo=css&logoColor=white)](https://github.com/u-n-a-i/code-path/tree/master/css/flexbox)
[![CSS](https://img.shields.io/badge/grid-663399?style=for-the-badge&logo=css&logoColor=white)](https://github.com/u-n-a-i/code-path/tree/master/css/grid)
[![CSS](https://img.shields.io/badge/diseño%20adaptativo-663399?style=for-the-badge&logo=css&logoColor=white)](https://github.com/u-n-a-i/code-path/tree/master/css/dise%C3%B1o-adaptativo)
[![CSS](https://img.shields.io/badge/reglas%20de%20arroba-663399?style=for-the-badge&logo=css&logoColor=white)](https://github.com/u-n-a-i/code-path/tree/master/css/reglas-arroba)
[![CSS](https://img.shields.io/badge/animaciones-663399?style=for-the-badge&logo=css&logoColor=white)](https://github.com/u-n-a-i/code-path/tree/master/css/animaciones)
[![CSS](https://img.shields.io/badge/filtros%20mascaras-663399?style=for-the-badge&logo=css&logoColor=white)](https://github.com/u-n-a-i/code-path/tree/master/css/filtros-mascaras)

<!-- ### SQL {PostgreSQL}

[![PostgreSQL](https://img.shields.io/badge/notas-336791?style=for-the-badge&logo=postgresql&logoColor=white)]() -->

---

## Ecosistema JavaScript

### JavaScript

#### Core

[![JavaScript](https://img.shields.io/badge/notas-F7DF1E?style=for-the-badge&logo=JavaScript&logoColor=black)]()

#### Web

[![JavaScript](https://img.shields.io/badge/notas-F7DF1E?style=for-the-badge&logo=JavaScript&logoColor=black)]()

### TypeScript

[![TypeScript](https://img.shields.io/badge/notas-3178C6?style=for-the-badge&logo=TypeScript&logoColor=white)]()

### Jest

[![Jest](https://img.shields.io/badge/notas-C21325?style=for-the-badge&logo=Jest&logoColor=white)]()

### Node.js

[![Node.js](https://img.shields.io/badge/notas-339933?style=for-the-badge&logo=node.js&logoColor=white)]()

### Angular

[![Angular](https://img.shields.io/badge/notas-FF0037?style=for-the-badge&logo=Angular&logoColor=white)]()

---
