---
title: "Conectar con un remoto"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [Conectar con un remoto](#conectar-con-un-remoto)
  - [`git remote add origin <URL>`](#git-remote-add-origin-url)
  - [`git remote -v`: ver remotos configurados](#git-remote--v-ver-remotos-configurados)
  - [Gestión adicional de remotos](#gestión-adicional-de-remotos)
  - [Quédate con...](#quédate-con)

</div>

# Conectar con un remoto

Un repositorio local aislado es útil para control de versiones personal, pero el valor colaborativo de Git se activa al conectar ese repositorio con uno remoto. Esta conexión no transfiere datos inmediatamente: configura una referencia de red que permite futuras sincronizaciones. Existen dos escenarios principales: clonar un repositorio existente (que configura el remoto automáticamente) o iniciar un proyecto localmente y conectarlo después a un servidor vacío. Comprender cómo establecer y verificar esta conexión es el primer paso para publicar trabajo, colaborar con equipos y respaldar el historial en infraestructura externa.

## `git remote add origin <URL>`

El comando `git remote add` registra una nueva referencia remota en la configuración local del repositorio. Se utiliza típicamente cuando has inicializado un proyecto con `git init` en tu máquina y posteriormente has creado un repositorio vacío en una plataforma como GitHub, GitLab o Bitbucket.

```bash
# Conectar repositorio local con remoto vacío
$ git remote add origin https://github.com/usuario/proyecto.git

# Verificar que se añadió correctamente
$ git remote -v
origin  https://github.com/usuario/proyecto.git (fetch)
origin  https://github.com/usuario/proyecto.git (push)
```

La sintaxis requiere dos argumentos: un nombre alias para el remoto (convencionalmente `origin`) y la URL de acceso. El nombre `origin` no es obligatorio técnicamente, pero es la convención estándar que la mayoría de herramientas y tutoriales asumen por defecto. La URL determina el protocolo de comunicación: HTTPS requiere autenticación con usuario/contraseña o token, mientras que SSH requiere claves configuradas previamente.

Es importante distinguir este comando de `git clone`. Cuando clonas un repositorio (`git clone <url>`), Git crea el directorio local, inicializa el repositorio y configura automáticamente el remoto `origin`. El comando `git remote add` es necesario solo cuando el repositorio local ya existe independientemente.

> No puedes añadir dos remotos con el mismo nombre. Si intentas `git remote add origin` cuando ya existe, Git mostrará un error. Para cambiar la URL de un remoto existente, usa `git remote set-url origin <nueva-url>` en lugar de añadirlo nuevamente.

## `git remote -v`: ver remotos configurados

El comando `git remote -v` (verbose) lista todas las referencias remotas configuradas en el repositorio local, mostrando sus nombres y URLs asociadas. La salida incluye dos entradas por cada remoto: una para operaciones de lectura (`fetch`) y otra para operaciones de escritura (`push`).

```bash
$ git remote -v
origin  https://github.com/usuario/proyecto.git (fetch)
origin  https://github.com/usuario/proyecto.git (push)
upstream  https://github.com/proyecto-original/repo.git (fetch)
upstream  https://github.com/proyecto-original/repo.git (push)
```

En la mayoría de casos, las URLs de fetch y push son idénticas. Sin embargo, pueden configurarse por separado para escenarios avanzados: por ejemplo, leer desde un repositorio público mediante HTTPS pero escribir mediante SSH para autenticación segura. La presencia de múltiples remotos (como `origin` y `upstream`) es común en flujos de trabajo de código abierto donde se contribuye a proyectos externos mediante forks.

Este comando es esencial para diagnóstico: verifica que estás apuntando al servidor correcto antes de hacer push, confirma que las URLs no han cambiado inadvertidamente, y ayuda a identificar configuraciones obsoletas en repositorios antiguos.

> `git remote -v` solo muestra configuraciones locales. No verifica conectividad real con el servidor. Para probar si la conexión funciona realmente, necesitas ejecutar `git fetch` o `git ls-remote`, que intentarán comunicarse con el remoto usando las credenciales configuradas.

## Gestión adicional de remotos

Además de añadir y listar, existen comandos para modificar o eliminar referencias remotas según evoluciona el proyecto:

```bash
# Eliminar un remoto configurado
$ git remote remove origin

# Cambiar la URL de un remoto existente
$ git remote set-url origin git@github.com:usuario/nuevo-proyecto.git

# Ver información detallada de un remoto
$ git remote show origin
```

La eliminación de un remoto no afecta el repositorio local ni su historial: solo rompe el vínculo de sincronización con ese servidor específico. Cambiar la URL es útil cuando se migra el proyecto a otra plataforma (de GitHub a GitLab, por ejemplo) o cuando se modifica la estructura de rutas en el servidor.

> Las credenciales de autenticación no se almacenan en la configuración del remoto. HTTPS usa el gestor de credenciales del sistema operativo o tokens almacenados aparte; SSH usa claves en `~/.ssh`. Cambiar la URL de HTTPS a SSH (o viceversa) puede requerir configurar autenticación adicional antes de que las operaciones de push funcionen correctamente.

## Quédate con...

*   `git remote add origin <URL>` configura manualmente la conexión entre un repositorio local existente y un servidor remoto vacío.
*   `git clone` configura automáticamente el remoto `origin`; `git remote add` se usa cuando el repositorio local ya fue inicializado con `git init`.
*   `git remote -v` muestra todas las referencias remotas configuradas, indicando URLs separadas para operaciones de fetch (lectura) y push (escritura).
*   El nombre `origin` es una convención estándar para el remoto principal, pero pueden configurarse múltiples remotos con nombres distintos (`upstream`, `fork`, etc.).
*   Cambiar la URL de un remoto se hace con `git remote set-url`, no añadiendo un nuevo remoto con el mismo nombre.
*   Configurar un remoto no verifica conectividad automáticamente: prueba la conexión con `git fetch` para confirmar autenticación y acceso correcto.

<div class="pagination">
  <a href="/markdown/sistemas/git/remotos/conceptos" class="prev">Anterior</a>
  <a href="/markdown/sistemas/git/remotos/sincronizar" class="next">Siguiente</a>
</div>
