---
title: "Alias y Configuración de Git"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [Alias y Configuración de Git](#alias-y-configuración-de-git)
  - [Alias: abreviar operaciones frecuentes](#alias-abreviar-operaciones-frecuentes)
    - [Alias básicos esenciales](#alias-básicos-esenciales)
    - [Alias avanzados con parámetros](#alias-avanzados-con-parámetros)
    - [Alias que ejecutan comandos de shell](#alias-que-ejecutan-comandos-de-shell)
  - [Configurar editor predeterminado](#configurar-editor-predeterminado)
    - [Configurar editor común](#configurar-editor-común)
  - [Configurar colores y salida](#configurar-colores-y-salida)
    - [Habilitar colores automáticos](#habilitar-colores-automáticos)
    - [Personalizar colores por comando](#personalizar-colores-por-comando)
    - [Configurar pager (less) para navegación](#configurar-pager-less-para-navegación)
  - [Configurar comportamiento de pull y merge](#configurar-comportamiento-de-pull-y-merge)
    - [Estrategia de pull](#estrategia-de-pull)
    - [Estrategia de merge](#estrategia-de-merge)
    - [Configurar comportamiento de push](#configurar-comportamiento-de-push)
  - [Configuración adicional recomendada](#configuración-adicional-recomendada)
    - [Credenciales y autenticación](#credenciales-y-autenticación)
    - [Ignorar archivos globalmente](#ignorar-archivos-globalmente)
    - [Nombres de ramas por defecto](#nombres-de-ramas-por-defecto)
    - [Herramientas de diff y merge](#herramientas-de-diff-y-merge)
  - [Verificar y gestionar configuración](#verificar-y-gestionar-configuración)
    - [Ubicación de archivos de configuración](#ubicación-de-archivos-de-configuración)
  - [Ejemplo de configuración completa](#ejemplo-de-configuración-completa)
  - [Quédate con...](#quédate-con)

</div>

# Alias y Configuración de Git

Git es una herramienta poderosa pero verbosa: comandos como `git checkout`, `git status` o `git commit --amend` se escriben cientos de veces durante el desarrollo. Los alias permiten abreviar operaciones frecuentes, reducir errores de tipeo y estandarizar flujos de trabajo entre miembros del equipo. Más allá de los alias, Git ofrece opciones de configuración que ajustan el comportamiento del sistema a tus preferencias: editor predeterminado, esquema de colores, estrategia de merge y más. Esta personalización no es cosmética: impacta directamente en productividad, consistencia y prevención de errores.

## Alias: abreviar operaciones frecuentes

Los alias de Git son atajos de comando que se definen en la configuración y permiten ejecutar operaciones complejas con menos tecleo. Se almacenan en el archivo de configuración global (`~/.gitconfig`) o local del repositorio.

### Alias básicos esenciales

```bash
# Estado del repositorio
$ git config --global alias.st status

# Commit rápido con mensaje
$ git config --global alias.ci commit

# Checkout de ramas
$ git config --global alias.co checkout

# Branches listadas
$ git config --global alias.br branch

# Diff visual
$ git config --global alias.di diff

# Log compacto en una línea
$ git config --global alias.lg "log --oneline --graph --decorate"
```

**Uso después de configurar:**

```bash
# En lugar de:
$ git status
$ git commit -m "mensaje"
$ git checkout feature-x
$ git branch -a
$ git diff
$ git log --oneline --graph --decorate

# Ahora puedes:
$ git st
$ git ci -m "mensaje"
$ git co feature-x
$ git br -a
$ git di
$ git lg
```

### Alias avanzados con parámetros

Los alias pueden incluir comandos compuestos y aceptar parámetros posicionales, permitiendo automatizar flujos complejos.

```bash
# Undo del último commit (soft, mantiene cambios en staging)
$ git config --global alias.undo "reset --soft HEAD~1"

# Undo hard (pierde cambios, usar con precaución)
$ git config --global alias.undo-hard "reset --hard HEAD~1"

# Ver últimos commits de un archivo
$ git config --global alias.blame "blame -L 1,20"

# Listar ramas mergeadas a la actual
$ git config --global alias.merged "branch --merged"

# Listar ramas no mergeadas
$ git config --global alias.unmerged "branch --no-merged"

# Cleanup de ramas locales ya mergeadas
$ git config --global alias.cleanup "branch --merged | grep -v '\*\|main\|develop' | xargs -n 1 git branch -d"

# Buscar en el historial por contenido
$ git config --global alias.search "log --all --grep"

# Mostrar estadísticas de cambios por commit
$ git config --global alias.stat "log --stat"
```

### Alias que ejecutan comandos de shell

Prefijar un alias con `!` permite ejecutar comandos de shell arbitrarios, habilitando automatizaciones complejas.

```bash
# Contar commits del usuario actual
$ git config --global alias.count "!git log --author='$(git config --get user.name)' --oneline | wc -l"

# Abrir repositorio en navegador (GitHub)
$ git config --global alias.open "!gh repo view --web"

# Ver cambios no commiteados con pager
$ git config --global alias.uncommitted "!git diff HEAD | less"

# Listar archivos modificados en el último commit
$ git config --global alias.last-files "!git show --name-only --pretty=format: HEAD"
```

> Los alias con `!` ejecutan shell commands y pueden tener efectos secundarios. Prueba siempre en un repositorio de prueba antes de usarlos en producción. Los alias se almacenan en `~/.gitconfig` y pueden sincronizarse entre máquinas copiando este archivo o usando dotfiles management.

## Configurar editor predeterminado

Git requiere un editor de texto para operaciones como commits sin mensaje inline, rebase interactivo, merge conflicts y más. El editor predeterminado varía por sistema (vim en Linux/macOS, Notepad en Windows), pero puede personalizarse según preferencia.

### Configurar editor común

```bash
# VS Code (recomendado para principiantes)
$ git config --global core.editor "code --wait"

# Sublime Text
$ git config --global core.editor "subl -n -w"

# Atom
$ git config --global core.editor "atom --wait"

# Nano (simple, terminal-based)
$ git config --global core.editor "nano"

# Vim (default en muchos sistemas)
$ git config --global core.editor "vim"

# Notepad++ (Windows)
$ git config --global core.editor "'C:/Program Files/Notepad++/notepad++.exe' -multiInst -notabbar -nosession -noPlugin"
```

El flag `--wait` es crucial: le dice a Git que espere hasta que cierres la ventana del editor antes de continuar. Sin él, Git asume que el commit se completó inmediatamente, resultando en mensajes vacíos.

> Para VS Code, el comando `code` debe estar en tu PATH. En macOS, instala desde VS Code con `Cmd+Shift+P` → "Shell Command: Install 'code' command in PATH". En Windows, el instalador de VS Code ofrece esta opción durante la instalación.

## Configurar colores y salida

Git usa colores para diferenciar tipos de información en la salida de comandos. Esta personalización mejora la legibilidad y reduce errores de interpretación.

### Habilitar colores automáticos

```bash
# Colores automáticos (activa en terminal, desactiva en pipes/archivos)
$ git config --global color.ui auto

# Colores siempre (incluso en pipes)
$ git config --global color.ui always

# Colores nunca (solo texto plano)
$ git config --global color.ui never
```

### Personalizar colores por comando

```bash
# Color para diffs añadidos
$ git config --global color.diff.new "green bold"

# Color para diffs eliminados
$ git config --global color.diff.old "red bold"

# Color para ramas en git branch
$ git config --global color.branch.current "yellow reverse"
$ git config --global color.branch.local "yellow"
$ git config --global color.branch.remote "green"

# Color para estado en git status
$ git config --global color.status.added "green"
$ git config --global color.status.changed "yellow"
$ git config --global color.status.untracked "cyan"
```

### Configurar pager (less) para navegación

```bash
# Usar less como pager con colores
$ git config --global core.pager "less -R"

# Salir de less con una tecla (q)
$ git config --global core.pager "less -FX"
```

>  `color.ui auto` es la configuración recomendada: muestra colores en terminal pero los desactiva cuando la salida se redirige a archivos o pipes, evitando caracteres de control en logs.

## Configurar comportamiento de pull y merge

Git permite definir cómo se comportan operaciones de integración como `pull`, `merge` y `rebase`. Estas configuraciones estandarizan flujos de trabajo y previenen sorpresas.

### Estrategia de pull

```bash
# Pull con rebase en lugar de merge (historial lineal)
$ git config --global pull.rebase true

# Pull con merge (default, crea merge commits)
$ git config --global pull.rebase false

# Pull interactivo (pregunta cada vez)
$ git config --global pull.rebase interactive
```

**Recomendación:** Usa `pull.rebase true` para mantener historial lineal en ramas de feature. Usa `pull.rebase false` en ramas compartidas (`main`, `develop`) donde el historial de merge es importante para trazabilidad.

### Estrategia de merge

```bash
# Fast-forward cuando sea posible (default)
$ git config --global merge.ff true

# Siempre crear merge commit (preserva historial de ramas)
$ git config --global merge.ff false

# Fast-forward solo, rechaza si requiere merge commit
$ git config --global merge.ff only
```

**Cuándo usar cada uno:**
| Opción | Resultado | Cuándo usar |
|--------|-----------|-------------|
| `merge.ff true` | Historial lineal si es posible | Ramas de feature personales |
| `merge.ff false` | Siempre merge commit visible | Ramas principales para trazabilidad |
| `merge.ff only` | Falla si no puede fast-forward | Cuando quieres rechazar merges complejos |

### Configurar comportamiento de push

```bash
# Push solo la rama actual (recomendado)
$ git config --global push.default current

# Push solo si upstream está configurado (más seguro)
$ git config --global push.default tracking

# Push matching (todas las ramas con mismo nombre)
$ git config --global push.default matching
```

> `push.default current` es la opción más segura para la mayoría de usuarios: solo pusha la rama en la que estás trabajando, previniendo push accidental de ramas no intencionadas.

## Configuración adicional recomendada

### Credenciales y autenticación

```bash
# Guardar credenciales HTTPS (inseguro, solo desarrollo local)
$ git config --global credential.helper store

# Guardar credenciales en memoria (15 minutos default)
$ git config --global credential.helper cache

# Usar credential manager del sistema (recomendado)
$ git config --global credential.helper manager
```

### Ignorar archivos globalmente

```bash
# Configurar archivo global de gitignore
$ git config --global core.excludesfile ~/.gitignore_global

# Ejemplo de ~/.gitignore_global:
# .DS_Store
# Thumbs.db
# *.log
# .env
# node_modules/
```

### Nombres de ramas por defecto

```bash
# Cambiar nombre de rama inicial de 'master' a 'main'
$ git config --global init.defaultBranch main
```

### Herramientas de diff y merge

```bash
# Configurar herramienta de diff externa
$ git config --global diff.tool vscode
$ git config --global difftool.vscode.cmd "code --wait --diff \$LOCAL \$REMOTE"

# Configurar herramienta de merge externa
$ git config --global merge.tool vscode
$ git config --global mergetool.vscode.cmd "code --wait \$MERGED"

# Usar herramienta automáticamente
$ git config --global difftool.prompt false
$ git config --global mergetool.prompt false
```

## Verificar y gestionar configuración

```bash
# Listar toda la configuración
$ git config --list

# Listar configuración global
$ git config --global --list

# Listar configuración local del repositorio
$ git config --local --list

# Ver valor específico
$ git config user.name
$ git config --global core.editor

# Editar configuración global directamente
$ git config --global --edit

# Eliminar configuración
$ git config --global --unset alias.st
```

### Ubicación de archivos de configuración

| Ámbito | Archivo | Prioridad |
|--------|---------|-----------|
| **System** | `/etc/gitconfig` | Más baja |
| **Global** | `~/.gitconfig` o `~/.config/git/config` | Media |
| **Local** | `.git/config` en el repositorio | Más alta |

> La configuración local del repositorio sobrescribe la global, que a su vez sobrescribe la del sistema. Usa configuración local para ajustes específicos del proyecto (como hooks o remotes) y global para preferencias personales.

## Ejemplo de configuración completa

```bash
# Identidad
git config --global user.name "Tu Nombre"
git config --global user.email "tu@email.com"

# Editor
git config --global core.editor "code --wait"

# Colores
git config --global color.ui auto

# Alias básicos
git config --global alias.st status
git config --global alias.ci commit
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.lg "log --oneline --graph --decorate"

# Pull y merge
git config --global pull.rebase true
git config --global merge.ff false

# Push
git config --global push.default current

# Rama inicial
git config --global init.defaultBranch main

# Ignorar global
git config --global core.excludesfile ~/.gitignore_global
```

## Quédate con...

*   Los alias de Git abrevian comandos frecuentes (`st`, `ci`, `co`, `lg`) y pueden incluir operaciones complejas con parámetros o comandos de shell.
*   Configurar `core.editor` con tu editor preferido (VS Code, Nano, etc.) mejora la experiencia en commits, rebase y resolución de conflictos.
*   `color.ui auto` habilita colores en terminal sin afectar salida redirigida; personaliza colores por comando para mayor claridad visual.
*   `pull.rebase true` produce historial lineal en ramas de feature; `pull.rebase false` preserva historial de merge en ramas principales.
*   `push.default current` es la opción más segura: solo pusha la rama actual, previniendo publicación accidental de ramas no intencionadas.
*   La configuración sigue jerarquía: local > global > system; usa local para ajustes de proyecto y global para preferencias personales.
*   Verifica configuración con `git config --list` y edita con `git config --global --edit` para gestión centralizada.
*   Los alias con `!` ejecutan shell commands y permiten automatizaciones avanzadas, pero requieren prueba previa por posibles efectos secundarios.

<div class="pagination">
  <a href="/markdown/sistemas/git/herramientas/graficas" class="prev">Anterior</a>
  <a href="/markdown/sistemas/git/herramientas/hooks" class="next">Siguiente</a>
</div>
