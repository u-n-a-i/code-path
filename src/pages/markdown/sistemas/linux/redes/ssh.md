---
title: "Conexión remota: uso de SSH"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [Conexión remota: uso de SSH](#conexión-remota-uso-de-ssh)
  - [Sintaxis básica de conexión](#sintaxis-básica-de-conexión)
  - [Autenticación con claves SSH](#autenticación-con-claves-ssh)
  - [Generación de claves](#generación-de-claves)
  - [Copia de la clave pública al servidor](#copia-de-la-clave-pública-al-servidor)
  - [Conexión sin contraseña](#conexión-sin-contraseña)
  - [Mejoras y buenas prácticas](#mejoras-y-buenas-prácticas)
  - [Quédate con...](#quédate-con)

</div>

# Conexión remota: uso de SSH

La Shell Segura (Secure Shell, o SSH) es el estándar de facto para acceder de forma remota a sistemas Linux. A diferencia de protocolos antiguos como Telnet, SSH cifra toda la comunicación —incluyendo contraseñas—, lo que lo hace seguro frente a escuchas en la red. Permite ejecutar comandos, transferir archivos y tunelizar conexiones, todo desde una terminal. Aunque la autenticación por contraseña es posible, la práctica recomendada es usar claves SSH, que ofrecen mayor seguridad, comodidad (sin escribir contraseñas) y compatibilidad con automatización. Dominar SSH es esencial para administrar servidores, desplegar aplicaciones o trabajar en entornos distribuidos.

## Sintaxis básica de conexión

La forma más simple de conectarse a un servidor remoto es:

```bash
ssh usuario@dirección

# Ejemplos:
ssh ana@192.168.1.50
ssh ubuntu@mi-servidor.cloud

# Por defecto, SSH usa el puerto 22. Para otro puerto:
ssh -p 2222 usuario@host
```

> La primera vez que te conectas a un host, SSH muestra la huella de su clave pública y pregunta si confías en ella. Esto previene ataques de intermediario (man-in-the-middle). Verifica esta huella si es posible (por ejemplo, comparando con la salida de ssh-keygen -l -f /etc/ssh/ssh_host_ecdsa_key.pub en el servidor).

## Autenticación con claves SSH

Las claves SSH usan criptografía asimétrica: una clave privada (que guardas en secreto) y una clave pública (que compartes con los servidores). Al conectarte, el servidor verifica que posees la clave privada correspondiente a la pública que registraste.

## Generación de claves

Usa ssh-keygen para crear un par de claves:

```bash
ssh-keygen -t ed25519 -C "tu@email.com"
```

- -t ed25519: algoritmo moderno, seguro y eficiente (recomendado).
- Si tu sistema no lo soporta, usa -t rsa -b 4096.

El comando genera dos archivos en ~/.ssh/:

- id_ed25519 → clave privada (nunca la compartas).
- id_ed25519.pub → clave pública (la que copiarás al servidor).

> Protege tu clave privada con una frase de paso (passphrase). Aunque añade un paso, evita que un atacante use tu clave si roba el archivo.

## Copia de la clave pública al servidor

La forma más fácil es con ssh-copy-id:

```bash
# La forma más fácil es con ssh-copy-id:
ssh-copy-id usuario@servidor # Esto añade tu clave pública a ~/.ssh/authorized_keys en el servidor.

# Alternativamente, copia manualmente:
cat ~/.ssh/id_ed25519.pub | ssh usuario@servidor "mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys"
```

## Conexión sin contraseña

Una vez configurado, puedes conectarte sin ingresar contraseña:

```bash
ssh usuario@servidor
```

Si usaste una passphrase, el sistema te la pedirá solo la primera vez por sesión (gracias al agente SSH, ssh-agent).

> En servidores, asegúrate de que el archivo ~/.ssh/authorized_keys tenga permisos correctos. De lo contrario, SSH rechazará la autenticación por seguridad.

## Mejoras y buenas prácticas

Desactiva el login por contraseña en servidores públicos (en /etc/ssh/sshd_config):

```
PasswordAuthentication no

Reinicia el servicio tras el cambio: sudo systemctl restart sshd.

Usa alias SSH para conexiones frecuentes. Edita ~/.ssh/config:
Host mi-servidor
    HostName 192.168.1.50
    User ana
    Port 2222
    IdentityFile ~/.ssh/id_ed25519

Luego: ssh mi-servidor.
```

Agentes SSH (ssh-agent) almacenan claves desbloqueadas temporalmente, evitando escribir la passphrase repetidamente.

## Quédate con...

- La sintaxis básica es ssh usuario@host; usa -p para puertos no estándar.
- Las claves SSH son más seguras y convenientes que las contraseñas.
- Genera claves con ssh-keygen -t ed25519.
- Copia la clave pública con ssh-copy-id o manualmente a ~/.ssh/authorized_keys.
- Asegura los permisos de ~/.ssh (700) y authorized_keys (600).
- Desactiva PasswordAuthentication en servidores públicos para mayor seguridad.
- El archivo ~/.ssh/config permite definir alias y opciones por host, simplificando conexiones complejas.
- SSH no es solo para acceso remoto: es la base de scp, rsync, túneles y Git remoto. Dominarlo es fundamental para cualquier desarrollador o administrador.

<div class="pagination">
  <a href="/markdown/sistemas/linux/redes/monitoreo" class="prev">Anterior</a>
  <a href="/markdown/sistemas/linux/redes/firewall" class="next">Siguiente</a>
</div>
