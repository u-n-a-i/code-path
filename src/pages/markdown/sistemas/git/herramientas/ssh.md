---
title: "Autenticación Segura con SSH"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [Autenticación Segura con SSH](#autenticación-segura-con-ssh)
  - [¿Por qué usar SSH con Git?](#por-qué-usar-ssh-con-git)
  - [Cómo funciona SSH: par de claves](#cómo-funciona-ssh-par-de-claves)
  - [Generar un par de claves SSH](#generar-un-par-de-claves-ssh)
  - [Iniciar el agente SSH y cargar la clave](#iniciar-el-agente-ssh-y-cargar-la-clave)
    - [Configurar agente persistente](#configurar-agente-persistente)
    - [Configurar carga automática al iniciar sesión](#configurar-carga-automática-al-iniciar-sesión)
  - [Agregar la clave pública a GitHub (u otro servicio)](#agregar-la-clave-pública-a-github-u-otro-servicio)
    - [Copiar la clave pública](#copiar-la-clave-pública)
    - [Registrar en GitHub](#registrar-en-github)
  - [Clonar o configurar repositorios con SSH](#clonar-o-configurar-repositorios-con-ssh)
    - [Diferencia entre URLs](#diferencia-entre-urls)
    - [Convertir repositorio existente de HTTPS a SSH](#convertir-repositorio-existente-de-https-a-ssh)
    - [Clonar nuevo repositorio con SSH](#clonar-nuevo-repositorio-con-ssh)
  - [Verificar la conexión](#verificar-la-conexión)
  - [Errores comunes y solución](#errores-comunes-y-solución)
    - [Permisos incorrectos en ~/.ssh](#permisos-incorrectos-en-ssh)
    - [Clave no cargada en el agente](#clave-no-cargada-en-el-agente)
    - [Usar HTTPS por error en lugar de SSH](#usar-https-por-error-en-lugar-de-ssh)
    - [Clave no reconocida por el servidor](#clave-no-reconocida-por-el-servidor)
  - [SSH vs. Tokens de Acceso Personal (PAT)](#ssh-vs-tokens-de-acceso-personal-pat)
    - [Cuándo elegir cada uno](#cuándo-elegir-cada-uno)
    - [Configurar múltiples cuentas con SSH](#configurar-múltiples-cuentas-con-ssh)
  - [Quédate con...](#quédate-con)

</div>

# Autenticación Segura con SSH

La autenticación en operaciones remotas de Git no es un detalle menor: define la seguridad, la comodidad y la escalabilidad de tu flujo de trabajo. Mientras que HTTPS requiere credenciales en cada operación (o gestión de tokens), SSH utiliza criptografía de clave pública para establecer identidad de forma automática y segura. Esta aproximación elimina la fricción de autenticación repetida, previene exposición de credenciales en logs o procesos, y se alinea con estándares profesionales de seguridad. Comprender cómo configurar y gestionar SSH con Git es fundamental para cualquier desarrollador que trabaje con repositorios remotos.

## ¿Por qué usar SSH con Git?

SSH (*Secure Shell*) resuelve limitaciones prácticas y de seguridad inherentes a la autenticación por contraseña o tokens HTTPS.

```
Ventajas clave de SSH:
• Autenticación automática: sin prompts de usuario/contraseña en cada push/pull
• Seguridad criptográfica: las claves privadas nunca se transmiten por red
• Imposible de adivinar: claves de 256-4096 bits vs contraseñas humanas predecibles
• Compatible con MFA: la plataforma puede requerir autenticación multifactor además de SSH
• Gestión centralizada: una clave sirve para múltiples repositorios y servicios
• Auditoría clara: cada clave puede identificarse por nombre ("laptop-trabajo", "server-ci")
```

En entornos profesionales, SSH es frecuentemente requerido por políticas de seguridad: las contraseñas pueden filtrarse en logs, historial de terminal o procesos del sistema; las claves SSH, almacenadas con permisos restrictivos y protegidas por passphrase, ofrecen garantías superiores.

> SSH no es solo conveniencia: es una capa de seguridad que protege tanto tu cuenta como los repositorios a los que accedes. Una clave comprometida puede revocarse individualmente sin afectar otras credenciales.

## Cómo funciona SSH: par de claves

SSH utiliza criptografía asimétrica: un par de claves matemáticamente vinculadas donde una cifra y la otra descifra.

```
Clave privada (id_ed25519):
• Se almacena en tu máquina (~/.ssh/)
• NUNCA se comparte ni se sube a servidores
• Protegida con permisos 600 y opcionalmente con passphrase
• Firmar desafíos criptográficos para probar identidad

Clave pública (id_ed25519.pub):
• Se comparte libremente con servidores (GitHub, GitLab, etc.)
• El servidor la usa para verificar firmas generadas por tu clave privada
• Puede añadirse a múltiples servicios sin riesgo
```

El protocolo de autenticación sigue este flujo:

1.  Cliente conecta al servidor y declara identidad ("tengo esta clave pública")
2.  Servidor genera un desafío aleatorio y lo cifra con la clave pública registrada
3.  Cliente descifra el desafío con su clave privada y lo devuelve
4.  Servidor verifica la respuesta: si coincide, autenticación exitosa

> La clave privada nunca abandona tu máquina. El servidor solo verifica que posees la clave correspondiente a la pública registrada, sin que la secreta se transmita jamás.

## Generar un par de claves SSH

El comando `ssh-keygen` crea pares de claves compatibles con Git y servicios modernos.

```bash
# Generar clave Ed25519 (recomendada por seguridad y rendimiento)
$ ssh-keygen -t ed25519 -C "tu@email.com"

# Para sistemas antiguos que no soportan Ed25519, usar RSA de 4096 bits
$ ssh-keygen -t rsa -b 4096 -C "tu@email.com"
```

El asistente interactivo solicita:

```
Generating public/private ed25519 key pair.
Enter file in which to save the key (/home/usuario/.ssh/id_ed25519): [Enter para default]
Enter passphrase (empty for no passphrase): [contraseña opcional pero recomendada]
Enter same passphrase again: [repetir]
```

**Parámetros explicados:**

| Flag | Propósito | Recomendación |
|------|-----------|---------------|
| `-t ed25519` | Tipo de algoritmo (Ed25519 es moderno y seguro) | Usar siempre que el sistema lo soporte |
| `-t rsa -b 4096` | RSA de 4096 bits para compatibilidad legacy | Solo si Ed25519 no está disponible |
| `-C "email"` | Comentario para identificar la clave | Incluir email asociado a tu cuenta |
| `-f ruta` | Guardar en archivo personalizado | Útil para múltiples claves por servicio |

Tras generar, verifica los archivos creados:

```bash
$ ls -l ~/.ssh/id_ed25519*
-rw------- 1 usuario usuario 411 Jan 15 10:00 /home/usuario/.ssh/id_ed25519      # Privada
-rw-r--r-- 1 usuario usuario  98 Jan 15 10:00 /home/usuario/.ssh/id_ed25519.pub  # Pública
```

> La clave privada debe tener permisos `600` (solo lectura/escritura para el propietario). Si los permisos son más abiertos, SSH rechazará usarla por seguridad: `chmod 600 ~/.ssh/id_ed25519`.

## Iniciar el agente SSH y cargar la clave

El agente SSH (`ssh-agent`) es un proceso en segundo plano que gestiona claves desencriptadas en memoria, evitando solicitar la passphrase en cada operación.

### Configurar agente persistente

```bash
# Verificar si el agente está corriendo
$ eval "$(ssh-agent -s)"
Agent pid 12345

# Añadir clave al agente
$ ssh-add ~/.ssh/id_ed25519
Enter passphrase for /home/usuario/.ssh/id_ed25519: [tu passphrase]

# Ver claves cargadas
$ ssh-add -l
256 SHA256:abc123... tu@email.com (ED25519)
```

### Configurar carga automática al iniciar sesión

**Linux/macOS con systemd o launchd:**

```bash
# Crear o editar ~/.ssh/config
Host *
  AddKeysToAgent yes
  UseKeychain yes  # macOS: integrar con keychain
  IdentityFile ~/.ssh/id_ed25519
```

**Windows con OpenSSH:**

```powershell
# Iniciar servicio ssh-agent (una vez)
Start-Service ssh-agent
Set-Service -Name ssh-agent -StartupType Automatic

# Añadir clave
ssh-add ~/.ssh/id_ed25519
```

> Sin agente, deberás ingresar la passphrase cada vez que uses Git con SSH. Con agente, la clave se mantiene en memoria durante la sesión, equilibrando seguridad y comodidad.

## Agregar la clave pública a GitHub (u otro servicio)

Una vez generada la clave, debes registrar la versión pública en cada plataforma donde quieras autenticarte.

### Copiar la clave pública

```bash
# macOS
$ pbcopy < ~/.ssh/id_ed25519.pub

# Linux (con xclip)
$ xclip -sel clip < ~/.ssh/id_ed25519.pub

# Windows (PowerShell)
$ Get-Content ~/.ssh/id_ed25519.pub | Set-Clipboard

# Universal: imprimir y copiar manualmente
$ cat ~/.ssh/id_ed25519.pub
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAI... tu@email.com
```

### Registrar en GitHub

1.  Navega a **Settings → SSH and GPG keys**
2.  Click en **New SSH key**
3.  Título descriptivo: "Laptop Trabajo - Ed25519"
4.  Pegar contenido de la clave pública
5.  Click en **Add SSH key**

```
Formato esperado de clave pública:
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAI... tu@email.com
# o para RSA:
ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAACAQ... tu@email.com
```

> Usa títulos descriptivos para cada clave: te permitirá identificar y revocar dispositivos específicos si se pierden o comprometen, sin afectar otros equipos.

## Clonar o configurar repositorios con SSH

Una vez configurada la clave, usa URLs SSH en lugar de HTTPS para operaciones Git.

### Diferencia entre URLs

```bash
# HTTPS (requiere credenciales/token)
https://github.com/usuario/repositorio.git

# SSH (autenticación automática con clave)
git@github.com:usuario/repositorio.git
```

### Convertir repositorio existente de HTTPS a SSH

```bash
# Ver remote actual
$ git remote -v
origin  https://github.com/usuario/repo.git (fetch)
origin  https://github.com/usuario/repo.git (push)

# Cambiar URL a SSH
$ git remote set-url origin git@github.com:usuario/repo.git

# Verificar cambio
$ git remote -v
origin  git@github.com:usuario/repo.git (fetch)
origin  git@github.com:usuario/repo.git (push)
```

### Clonar nuevo repositorio con SSH

```bash
# Usar URL SSH desde el inicio
$ git clone git@github.com:usuario/nuevo-proyecto.git
```

> Si la clave está cargada en el agente y registrada en el servicio, operaciones como `git push` o `git pull` se ejecutarán sin prompts de autenticación.

## Verificar la conexión

Antes de trabajar, confirma que SSH autentica correctamente con el servicio remoto.

```bash
# Verificar conexión con GitHub
$ ssh -T git@github.com
Hi usuario! You've successfully authenticated, but GitHub does not provide shell access.

# Verificar con GitLab
$ ssh -T git@gitlab.com
Welcome to GitLab, @usuario!

# Verbose para diagnóstico de errores
$ ssh -vT git@github.com
```

La salida exitosa confirma que:
*   La clave pública está registrada en el servicio
*   La clave privada está accesible y cargada en el agente
*   La conexión SSH se establece correctamente

> El mensaje "does not provide shell access" es normal: GitHub/GitLab permiten Git sobre SSH pero no acceso a terminal remota. La autenticación exitosa es lo importante.

## Errores comunes y solución

### Permisos incorrectos en ~/.ssh

SSH es estricto con permisos: si son demasiado abiertos, rechaza las claves por seguridad.

```bash
# Permisos correctos
$ chmod 700 ~/.ssh           # Carpeta: solo propietario
$ chmod 600 ~/.ssh/id_*      # Claves privadas: solo lectura/escritura propietario
$ chmod 644 ~/.ssh/*.pub     # Claves públicas: lectura para todos (necesario)

# Verificar
$ ls -la ~/.ssh/
drwx------  2 usuario usuario 4096 Jan 15 10:00 .
-rw-------  1 usuario usuario  411 Jan 15 10:00 id_ed25519
-rw-r--r--  1 usuario usuario   98 Jan 15 10:00 id_ed25519.pub
```

### Clave no cargada en el agente

```bash
# Síntoma: pide passphrase repetidamente o falla autenticación
$ ssh-add -l
The agent has no identities.

# Solución: cargar clave
$ ssh-add ~/.ssh/id_ed25519
```

### Usar HTTPS por error en lugar de SSH

```bash
# Síntoma: prompt de credenciales a pesar de tener SSH configurado
$ git remote -v
origin  https://github.com/usuario/repo.git  # ← HTTPS, no usará SSH

# Solución: cambiar a SSH
$ git remote set-url origin git@github.com:usuario/repo.git
```

### Clave no reconocida por el servidor

```bash
# Síntoma: Permission denied (publickey)
$ ssh -T git@github.com
git@github.com: Permission denied (publickey).

# Diagnóstico:
# 1. Verificar que la clave pública está registrada en GitHub
# 2. Verificar que la clave privada está cargada: ssh-add -l
# 3. Verificar permisos: ls -l ~/.ssh/
# 4. Probar con verbose: ssh -vT git@github.com
```

> Usa `ssh -v` (verbose) para diagnóstico detallado: muestra cada paso de la negociación SSH, revelando dónde falla la autenticación.

## SSH vs. Tokens de Acceso Personal (PAT)

GitHub eliminó la autenticación por contraseña para operaciones Git en 2021. Las alternativas son SSH o PAT con HTTPS.

| Característica | SSH | PAT con HTTPS |
|---------------|-----|---------------|
| **Configuración inicial** | Una vez por dispositivo | Una vez por token/servicio |
| **Autenticación en uso** | Automática (con agente) | Token almacenado en credential manager |
| **Seguridad** | Clave privada nunca se transmite | Token se envía en cada request (HTTPS cifrado) |
| **Revocación** | Individual por clave | Individual por token |
| **Múltiples cuentas** | Configurar Hosts en ~/.ssh/config | Requiere credential helper avanzado |
| **Entornos CI/CD** | Clave desplegada como secreto | Token como variable de entorno |
| **Portabilidad** | Clave debe copiarse entre máquinas | Token puede generarse en cualquier lugar |

### Cuándo elegir cada uno

```
Usar SSH cuando:
• Trabajas desde máquinas personales o de desarrollo
• Quieres autenticación automática sin prompts
• Gestionas múltiples repositorios y servicios
• Prefieres no gestionar expiración de tokens

Usar PAT con HTTPS cuando:
• Trabajas en entornos corporativos con proxy que bloquea SSH
• Usas herramientas que no soportan SSH nativamente
• Necesitas scopes granulares de permisos por token
• Prefieres rotación periódica de credenciales
```

### Configurar múltiples cuentas con SSH

Si usas GitHub personal y laboral, configura aliases en `~/.ssh/config`:

```
# ~/.ssh/config

# Cuenta personal
Host github-personal
  HostName github.com
  User git
  IdentityFile ~/.ssh/id_ed25519_personal

# Cuenta laboral
Host github-laboral
  HostName github.com
  User git
  IdentityFile ~/.ssh/id_ed25519_work
```

Luego usa el alias en la URL del remote:

```bash
# Para repositorio personal
$ git remote set-url origin git@github-personal:usuario-personal/repo.git

# Para repositorio laboral
$ git remote set-url origin git@github-laboral:empresa-org/repo.git
```

> Esta configuración permite que Git use la clave correcta según el alias del host, sin ambigüedad ni prompts.

## Quédate con...

*   SSH elimina la necesidad de credenciales repetidas y ofrece autenticación criptográfica más segura que contraseñas o tokens transmitidos.
*   Un par de claves SSH consta de privada (nunca compartir) y pública (registrar en servicios); la privada firma desafíos que el servidor verifica con la pública.
*   Genera claves con `ssh-keygen -t ed25519 -C "email"` y protege la privada con passphrase y permisos `600`.
*   El agente SSH (`ssh-agent`) gestiona claves en memoria para autenticación automática; configúralo para carga persistente al iniciar sesión.
*   Registra la clave pública en GitHub/GitLab y usa URLs SSH (`git@host:usuario/repo.git`) para operaciones Git sin prompts.
*   Verifica conexión con `ssh -T git@github.com`; usa `-v` para diagnóstico detallado de errores de autenticación.
*   Permisos incorrectos en `~/.ssh` son causa común de fallos: carpeta `700`, claves privadas `600`, públicas `644`.
*   SSH y PAT son alternativas válidas post-eliminación de contraseñas; elige según tu flujo: SSH para desarrollo local, PAT para CI/CD o entornos con restricciones de red.
*   Para múltiples cuentas, usa aliases en `~/.ssh/config` que mapeen hosts a claves específicas, permitiendo gestión limpia de identidades separadas.

<div class="pagination">
  <a href="/markdown/sistemas/git/herramientas/auditoria" class="prev">Anterior</a>
  <a href="/sistemas" class="next">Siguiente</a>
</div>
