---
title: "Flujo de trabajo con Pull Requests (PR)"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [Flujo de trabajo con Pull Requests (PR)](#flujo-de-trabajo-con-pull-requests-pr)
  - [Crear rama → hacer commits → abrir PR → revisión → aprobación → merge](#crear-rama--hacer-commits--abrir-pr--revisión--aprobación--merge)
    - [Paso 1: Crear rama para la funcionalidad](#paso-1-crear-rama-para-la-funcionalidad)
    - [Paso 2: Hacer commits locales](#paso-2-hacer-commits-locales)
    - [Paso 3: Publicar rama y abrir PR](#paso-3-publicar-rama-y-abrir-pr)
    - [Paso 4: Revisión de código](#paso-4-revisión-de-código)
    - [Paso 5: Iterar sobre feedback](#paso-5-iterar-sobre-feedback)
    - [Paso 6: Aprobación y merge](#paso-6-aprobación-y-merge)
  - [Comentarios, sugerencias de código y aprobaciones](#comentarios-sugerencias-de-código-y-aprobaciones)
    - [Sugerencias de código (Code Suggestions)](#sugerencias-de-código-code-suggestions)
    - [Hilos de discusión](#hilos-de-discusión)
    - [Aprobaciones formales](#aprobaciones-formales)
  - [Mejores prácticas para PRs efectivos](#mejores-prácticas-para-prs-efectivos)
  - [Quédate con...](#quédate-con)

</div>

# Flujo de trabajo con Pull Requests (PR)

El Pull Request es el corazón de la colaboración moderna en GitHub. No es simplemente un mecanismo técnico para fusionar ramas: es un proceso estructurado que transforma el código individual en código del equipo mediante revisión, discusión y validación colectiva. Este flujo establece un contrato de calidad: ningún cambio llega a la rama principal sin haber sido examinado, probado y aprobado por pares. Comprender cada etapa del proceso —desde la creación de la rama hasta el merge final— permite participar efectivamente en proyectos colaborativos, contribuir a código abierto y mantener estándares de calidad en equipos de desarrollo.

## Crear rama → hacer commits → abrir PR → revisión → aprobación → merge

El flujo de PR sigue una secuencia definida que separa claramente el trabajo individual de la integración colectiva. Cada etapa tiene propósitos específicos y mejores prácticas asociadas.

### Paso 1: Crear rama para la funcionalidad

Cada PR debe originarse en una rama dedicada, nunca trabajar directamente sobre `main`. Esto aísla los cambios y permite desarrollo paralelo sin interferencias.

```bash
# Desde la rama principal actualizada
$ git switch main
$ git pull origin main

# Crear rama con nombre descriptivo
$ git switch -c feature/sistema-autenticacion
# O para correcciones:
$ git switch -c fix/error-validacion-email
```

Convenciones de nombres:
*   `feature/` — Nueva funcionalidad
*   `fix/` — Corrección de bug
*   `docs/` — Cambios de documentación
*   `refactor/` — Refactorización sin cambios de comportamiento
*   `chore/` — Tareas de mantenimiento

> Incluir el número de issue en el nombre de la rama facilita trazabilidad: `feature/123-sistema-autenticacion`. Esto vincula visualmente el trabajo con el ticket correspondiente en GitHub.

### Paso 2: Hacer commits locales

Desarrolla la funcionalidad en tu rama local con commits frecuentes y atómicos. Cada commit debe representar un cambio coherente y funcional.

```bash
# Trabajar iterativamente
$ git add src/auth.py
$ git commit -m "Implementar función de login básico"

$ git add src/auth.py tests/test_auth.py
$ git commit -m "Añadir validación de credenciales y tests"

$ git add src/auth.py src/models.py
$ git commit -m "Integrar con modelo de usuario"
```

Mejores prácticas de commits:
*   **Mensajes descriptivos:** Explica el *porqué*, no solo el *qué*
*   **Commits atómicos:** Cada commit debe ser funcional por sí mismo
*   **Tests incluidos:** Commits que añaden funcionalidad deberían incluir tests

### Paso 3: Publicar rama y abrir PR

Una vez el trabajo está listo para revisión, publica la rama y crea el Pull Request en GitHub.

```bash
# Publicar rama en remoto
$ git push -u origin feature/sistema-autenticacion
```

En la interfaz web de GitHub:

1.  Navega al repositorio
2.  GitHub detecta la rama nueva y muestra banner "Compare & pull request"
3.  Haz click para crear el PR
4.  Completa la plantilla con:
    *   **Título:** Descriptivo y conciso
    *   **Descripción:** Qué cambia, por qué, cómo probarlo
    *   **Reviewers:** Asigna colegas para revisión
    *   **Labels:** Etiqueta tipo (bug, feature, etc.)
    *   **Proyectos:** Vincula a project board si aplica

```markdown
# Ejemplo de descripción de PR

## Cambios
- Implementa autenticación con JWT
- Añade endpoints /login y /logout
- Integra con modelo de usuario existente

## Por qué
El sistema actual usa sesiones que no escalan bien en arquitectura distribuida.

## Cómo probar
1. `npm install`
2. `npm run test`
3. POST /login con credenciales válidas
4. Verificar token JWT en respuesta

## Checklist
- [ ] Tests pasan
- [ ] Documentación actualizada
- [ ] Sin warnings de lint
```

> GitHub permite vincular issues en la descripción usando `Fixes #123` o `Closes #456`. Al mergear el PR, el issue se cierra automáticamente. Esto mantiene trazabilidad entre trabajo y requisitos.

### Paso 4: Revisión de código

Una vez abierto, el PR entra en fase de revisión. Los revisores asignados examinan los cambios y proporcionan feedback.

**Tipos de feedback en GitHub:**

| Tipo | Descripción | Cuándo usar |
|------|-------------|-------------|
| **Comment** | Comentario general sin requerir acción | Observaciones, preguntas, elogios |
| **Request changes** | Feedback que requiere modificación antes de aprobar | Bugs, problemas de diseño, código incorrecto |
| **Approve** | Aprobación formal para merge | Cambios listos para integrar |

**Comentarios por línea de código:**

Los revisores pueden seleccionar líneas específicas y comentar:

```python
# En el diff del PR, revisor selecciona línea y comenta:
def validar_token(token):
    if not token:
        return False
    # 💬 Revisor: "¿Deberíamos validar también la expiración del token aquí?"
    return verify_signature(token)
```

Esto permite discusión contextualizada exactamente donde el código es relevante.

### Paso 5: Iterar sobre feedback

Si hay solicitudes de cambio, el autor responde creando nuevos commits en la misma rama. El PR se actualiza automáticamente.

```bash
# En rama local del PR
$ git add src/auth.py
$ git commit -m "Añadir validación de expiración de token"

# Push actualiza el PR automáticamente
$ git push
# No necesita -u porque upstream ya está configurado
```

GitHub muestra cada nuevo commit en la timeline del PR, permitiendo a los revisores ver qué cambió desde su última revisión.

> Algunos equipos prefieren `git commit --amend` y `git push --force-with-lease` para mantener historial limpio en el PR, evitando commits como "fix review comments", "another fix". Esto es válido en ramas de feature no compartidas.

### Paso 6: Aprobación y merge

Cuando todos los revisores han aprobado y los checks automatizados han pasado, el PR está listo para merge.

**Checks típicos requeridos:**

```
✅ 2/2 approvals de revisores requeridos
✅ CI Pipeline passed (tests, lint, build)
✅ No merge conflicts
✅ Branch protection rules satisfied
⏳ Ready to merge
```

**Opciones de merge en GitHub:**

| Opción | Resultado | Cuándo usar |
|--------|-----------|-------------|
| **Create a merge commit** | Preserva todos los commits de la rama feature | Historial detallado importante, features complejas |
| **Squash and merge** | Combina todos los commits en uno solo | Features simples, mantener main limpio |
| **Rebase and merge** | Reescribe commits sobre main linealmente | Historial lineal preferido, sin commits de merge |

```
# Squash and merge resulta en:
main: A --- B --- C --- D (un commit con todos los cambios)

# Merge commit resulta en:
main: A --- B --- C --- M (merge commit con dos padres)
                 \ /
                  D
```

Tras el merge:
*   La rama feature puede eliminarse (GitHub ofrece botón automático)
*   El issue vinculado se cierra si usó `Fixes #`
*   Notificaciones se envían a participantes del PR

> Las ramas protegidas (branch protection rules) pueden requerir aprobaciones mínimas, checks de CI obligatorios, o bloqueo de merge directo a `main`. Esto previene cambios no revisados de llegar a producción.

## Comentarios, sugerencias de código y aprobaciones

GitHub ofrece herramientas específicas para hacer la revisión más efectiva y accionable.

### Sugerencias de código (Code Suggestions)

Los revisores pueden proponer cambios directos que el autor puede aceptar con un click:

````markdown
💬 Revisor comenta en línea:
```suggestion
return token.is_valid() and not token.is_expired()
```
````

El autor ve la sugerencia en la interfaz y puede:
*   **Commit suggestion:** Aceptar y crear commit automáticamente
*   **Copy manually:** Copiar y aplicar manualmente en local
*   **Discard:** Rechazar la sugerencia con explicación

Esta funcionalidad acelera correcciones menores (typos, estilo, pequeñas mejoras) sin requerir que el autor edite localmente.

### Hilos de discusión

Los comentarios pueden generar hilos de conversación:

```
Revisor A: "¿Por qué usamos JWT en lugar de sesiones?"
  Autor: "Las sesiones no funcionan bien con múltiples servidores"
    Revisor A: "Entendido, tiene sentido para nuestra arquitectura"
      ✅ Resolved
```

Los hilos pueden marcarse como "Resolved" cuando la discusión concluye, ayudando a trackear qué puntos han sido abordados antes del merge.

### Aprobaciones formales

La aprobación no es solo un botón: es una responsabilidad. Al aprobar, el revisor certifica que:

*   El código funciona correctamente
*   Sigue estándares del proyecto
*   No introduce bugs o vulnerabilidades obvias
*   Los tests son adecuados

```
# Estado de aprobaciones en PR:
Reviews:
  ✅ @maria-dev - Approved (hace 2 horas)
  ✅ @juan-senior - Approved (hace 1 hora)
  ⏳ @ana-tech - Review requested (pendiente)
```

Algunos proyectos requieren aprobaciones de personas específicas (maintainers, security team) antes de permitir merge.

> Ser revisor es una responsabilidad. Aprobar código sin revisión adecuada puede introducir bugs a producción. Si no tienes tiempo para revisar completamente, no apruebes: comenta "no pude revisar a fondo" o solicita más tiempo.

## Mejores prácticas para PRs efectivos

| Práctica | Descripción | Beneficio |
|----------|-------------|-----------|
| **PRs pequeños** | Limitar a ~200-400 líneas de cambio | Revisión más rápida y completa |
| **Descripción clara** | Explicar contexto, cambios y cómo probar | Revisores entienden el propósito sin adivinar |
| **Tests incluidos** | PRs con funcionalidad nueva incluyen tests | Previene regresiones futuras |
| **Revisar antes de pedir review** | Auto-revisar el diff antes de asignar revisores | Reduce iteraciones innecesarias |
| **Responder feedback rápido** | Atender comentarios dentro de 24-48 horas | Mantiene momentum del PR |
| **Un tema por PR** | No mezclar funcionalidades distintas en un PR | Revisión enfocada, merge más seguro |

```bash
# ❌ PR demasiado grande (difícil de revisar)
$ git diff main feature-monolito | wc -l
2500 líneas cambiadas

# ✅ PR enfocado (fácil de revisar)
$ git diff main feature-autenticacion | wc -l
180 líneas cambiadas
$ git diff main feature-perfiles | wc -l
150 líneas cambiadas
```

> Si un cambio es demasiado grande para un PR razonable, considera dividirlo en múltiples PRs secuenciales. Ejemplo: PR 1 prepara la base de datos, PR 2 añade la API, PR 3 añade el frontend. Cada uno se revisa y mergea independientemente.

## Quédate con...

*   El flujo de PR es: crear rama → commits locales → push → abrir PR → revisión → iterar → aprobación → merge.
*   Cada PR debe tener rama dedicada, título descriptivo, y explicación clara de qué cambia y por qué.
*   Los revisores pueden comentar por línea, hacer sugerencias de código aplicables con un click, y aprobar formalmente.
*   Las aprobaciones son responsabilidad: certificar que el código es correcto, seguro y sigue estándares del proyecto.
*   PRs pequeños (~200-400 líneas) se revisan más rápido y completamente que cambios masivos.
*   GitHub ofrece tres opciones de merge: merge commit (preserva historial), squash (combina en uno), rebase (lineal).
*   Las branch protection rules pueden requerir aprobaciones mínimas y checks de CI antes de permitir merge a ramas críticas.
*   Vincular issues con `Fixes #` en la descripción cierra automáticamente el issue al mergear el PR.

<div class="pagination">
  <a href="/markdown/sistemas/git/github/funciones" class="prev">Anterior</a>
  <a href="/markdown/sistemas/git/github/contribuir" class="next">Siguiente</a>
</div>
