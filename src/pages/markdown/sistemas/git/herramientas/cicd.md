---
title: "Integración con CI/CD"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [Integración con CI/CD](#integración-con-cicd)
  - [GitHub Actions: ejecutar tests al hacer push](#github-actions-ejecutar-tests-al-hacer-push)
    - [Estructura básica de un workflow](#estructura-básica-de-un-workflow)
    - [Componentes clave](#componentes-clave)
    - [Validar que el código no rompa el build](#validar-que-el-código-no-rompa-el-build)
    - [Notificaciones y estado visible](#notificaciones-y-estado-visible)
  - [GitLab CI: alternativa con enfoque DevOps](#gitlab-ci-alternativa-con-enfoque-devops)
    - [Estructura básica de GitLab CI](#estructura-básica-de-gitlab-ci)
    - [Diferencias clave con GitHub Actions](#diferencias-clave-con-github-actions)
    - [Caché y optimización de pipelines](#caché-y-optimización-de-pipelines)
  - [Validar que el código no rompa el build](#validar-que-el-código-no-rompa-el-build-1)
    - [Configuración de protección de ramas](#configuración-de-protección-de-ramas)
    - [Tests que validan más que funcionalidad](#tests-que-validan-más-que-funcionalidad)
    - [Fail-fast y paralelización](#fail-fast-y-paralelización)
  - [Quédate con...](#quédate-con)

</div>

# Integración con CI/CD

La integración continua y el despliegue continuo (CI/CD) transforman el control de versiones de un sistema de registro histórico en un motor de calidad automatizada. Cada push a un repositorio desencadena una serie de validaciones —tests, linting, builds— que verifican que el código nuevo no rompe funcionalidad existente. Esta automatización detecta errores minutos después de ser introducidos, no días o semanas después en producción. GitHub Actions y GitLab CI son plataformas nativas que permiten definir estos flujos directamente en el repositorio, eliminando la necesidad de infraestructura externa y manteniendo la configuración de build versionada junto al código.

## GitHub Actions: ejecutar tests al hacer push

GitHub Actions permite definir workflows en archivos YAML dentro del directorio `.github/workflows/`. Cada workflow se activa ante eventos específicos: push, pull request, creación de tag, o incluso de forma programada.

### Estructura básica de un workflow

```yaml
# .github/workflows/ci.yml
name: CI Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout código
        uses: actions/checkout@v4
      
      - name: Configurar Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
      
      - name: Instalar dependencias
        run: npm ci
      
      - name: Ejecutar linter
        run: npm run lint
      
      - name: Ejecutar tests
        run: npm test
      
      - name: Build de producción
        run: npm run build
```

### Componentes clave

| Elemento | Propósito | Ejemplo |
|----------|-----------|---------|
| `on` | Define qué eventos activan el workflow | `push`, `pull_request`, `schedule` |
| `jobs` | Conjunto de tareas que se ejecutan en paralelo o secuencia | `test`, `build`, `deploy` |
| `runs-on` | Sistema operativo del runner que ejecuta el job | `ubuntu-latest`, `windows-latest`, `macos-latest` |
| `steps` | Secuencia de acciones dentro de un job | Checkout, setup, run commands |
| `uses` | Reutiliza acciones predefinidas del marketplace | `actions/checkout@v4` |
| `run` | Ejecuta comandos de shell directamente | `npm test`, `pytest` |

### Validar que el código no rompa el build

El propósito central de CI es rechazar cambios que fallen validaciones. GitHub Actions marca el workflow como fallido si cualquier paso retorna código de error distinto de cero, bloqueando automáticamente el merge en pull requests configurados con protección de ramas.

```yaml
# Ejemplo con matriz de pruebas para múltiples versiones
jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [18, 20, 22]
        os: [ubuntu-latest, windows-latest]
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
      
      - run: npm ci
      - run: npm run lint
      - run: npm test
      - run: npm run build
```

> Los workflows fallan rápido: si `npm run lint` retorna error, los pasos posteriores no se ejecutan. Esto ahorra tiempo de CI y proporciona feedback inmediato al desarrollador.

### Notificaciones y estado visible

Cada ejecución de workflow muestra badges de estado que pueden incrustarse en el README:

```markdown
![CI Status](https://github.com/usuario/repo/actions/workflows/ci.yml/badge.svg)
```

Además, GitHub muestra el estado directamente en el pull request:

```
✅ All checks have passed
  ✓ CI Pipeline / test (ubuntu-latest, node-20)
  ✓ CI Pipeline / test (ubuntu-latest, node-18)
  ✓ CI Pipeline / lint
```

> Los badges de estado proporcionan visibilidad inmediata de la salud del proyecto. Un badge rojo en el README alerta a colaboradores potenciales que la rama principal está inestable.

## GitLab CI: alternativa con enfoque DevOps

GitLab CI utiliza un archivo `.gitlab-ci.yml` en la raíz del repositorio para definir pipelines. Su filosofía es similar a GitHub Actions pero con diferencias sintácticas y de flujo.

### Estructura básica de GitLab CI

```yaml
# .gitlab-ci.yml
image: node:20

stages:
  - lint
  - test
  - build

lint:
  stage: lint
  script:
    - npm ci
    - npm run lint

test:
  stage: test
  script:
    - npm ci
    - npm test
  artifacts:
    paths:
      - coverage/
    reports:
      coverage_report:
        coverage_format: cobertura
        path: coverage/coverage.xml

build:
  stage: build
  script:
    - npm ci
    - npm run build
  artifacts:
    paths:
      - dist/
  only:
    - main
```

### Diferencias clave con GitHub Actions

| Característica | GitHub Actions | GitLab CI |
|---------------|---------------|-----------|
| Ubicación del config | `.github/workflows/*.yml` | `.gitlab-ci.yml` raíz |
| Definición de etapas | Implícita por dependencias | Explícita con `stages` |
| Reutilización de pasos | `uses: action@version` | `extends:` templates |
| Artifacts | `upload-artifact` action | `artifacts:` nativo |
| Ejecución local | `act` (third-party) | `gitlab-runner exec` |

### Caché y optimización de pipelines

Ambas plataformas permiten cachear dependencias para acelerar ejecuciones repetidas.

```yaml
# GitHub Actions: caché de node_modules
- name: Cache dependencies
  uses: actions/cache@v3
  with:
    path: node_modules
    key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}

# GitLab CI: caché nativo
cache:
  key: ${CI_COMMIT_REF_SLUG}
  paths:
    - node_modules/
```

> La caché reduce tiempos de CI drásticamente: instalar dependencias puede tomar minutos; recuperarlas de caché, segundos. Configura claves de caché basadas en lockfiles para invalidar automáticamente cuando cambian dependencias.

## Validar que el código no rompa el build

El objetivo de CI no es solo ejecutar tests: es prevenir que código defectuoso alcance producción. Esto requiere configuración estratégica de umbrales de fallo y protección de ramas.

### Configuración de protección de ramas

En GitHub: **Settings → Branches → Add rule**

```
Branch name pattern: main
✓ Require pull request reviews before merging
✓ Require status checks to pass before merging
  ✓ Status checks: CI Pipeline / test
✓ Require branches to be up to date before merging
✓ Include administrators
```

En GitLab: **Settings → Repository → Protected branches**

```
Branch: main
Allowed to merge: Maintainers
Allowed to push: No one
✓ Protect also matching tags
```

> Las reglas de protección de ramas son la última línea de defensa: incluso si un desarrollador intenta forzar un merge, el sistema bloquea cambios que no pasan los checks de CI.

### Tests que validan más que funcionalidad

Un pipeline robusto verifica múltiples dimensiones de calidad:

```yaml
jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      # Validar sintaxis y estilo
      - run: npm run lint
      
      # Validar tipos (TypeScript)
      - run: npm run type-check
      
      # Validar seguridad de dependencias
      - run: npm audit --audit-level=moderate
      
      # Validar tamaño de bundle
      - run: npm run build && ls -lh dist/
      
      # Validar tests unitarios
      - run: npm test -- --coverage
      
      # Validar tests de integración
      - run: npm run test:integration
```

> Ejecutar `npm audit` en CI detecta vulnerabilidades en dependencias antes de que lleguen a producción. Configura `--audit-level=moderate` para fallar el build si hay vulnerabilidades de severidad media o alta.

### Fail-fast y paralelización

Para pipelines largos, configura estrategias que optimicen tiempo y recursos.

```yaml
# GitHub Actions: fallar rápido si un job falla
jobs:
  test:
    strategy:
      fail-fast: true  # Detener otros jobs si uno falla
      matrix:
        os: [ubuntu, windows, macos]
        version: [18, 20]
```

```yaml
# GitLab CI: ejecutar jobs en paralelo
test:
  parallel:
    matrix:
      - NODE_VERSION: [18, 20]
        OS: [linux, windows]
```

> `fail-fast: true` ahorra recursos de CI: si los tests fallan en Ubuntu/Node-18, no tiene sentido ejecutarlos en las otras 5 combinaciones de la matriz. Desactívalo solo si necesitas resultados completos para diagnóstico.

## Quédate con...

*   GitHub Actions y GitLab CI permiten definir pipelines de CI/CD directamente en el repositorio mediante archivos YAML versionados junto al código.
*   Los workflows se activan ante eventos como `push` o `pull_request`, ejecutando automáticamente tests, linting y builds para validar cada cambio.
*   Un pipeline efectivo valida múltiples dimensiones: sintaxis (lint), tipos (TypeScript), seguridad (audit), funcionalidad (tests) y build (compilación).
*   La protección de ramas configura el repositorio para bloquear merges que no pasan los checks de CI, previniendo código roto en producción.
*   La caché de dependencias reduce drásticamente tiempos de ejecución: configura claves basadas en lockfiles para invalidación automática.
*   `fail-fast: true` optimiza recursos al detener jobs paralelos cuando uno falla, ahorrando tiempo y minutos de CI.
*   Los badges de estado en README y los checks visibles en pull requests proporcionan transparencia inmediata sobre la salud del proyecto.
*   CI no reemplaza tests locales: es una red de seguridad que captura lo que el desarrollador pudo haber pasado por alto.


<div class="pagination">
  <a href="/markdown/sistemas/git/herramientas/hooks" class="prev">Anterior</a>
  <a href="/markdown/sistemas/git/herramientas/auditoria" class="next">Siguiente</a>
</div>
