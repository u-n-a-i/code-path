---
title: "Administración de contraseñas"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [Administración de contraseñas](#administración-de-contraseñas)
  - [El comando passwd](#el-comando-passwd)
  - [El archivo /etc/shadow: corazón de la seguridad de contraseñas](#el-archivo-etcshadow-corazón-de-la-seguridad-de-contraseñas)
  - [Políticas de vencimiento y gestión avanzada](#políticas-de-vencimiento-y-gestión-avanzada)
  - [Qué queda con...](#qué-queda-con)

</div>

# Administración de contraseñas

La gestión de contraseñas en Linux está diseñada para equilibrar usabilidad, seguridad y control administrativo. A diferencia de los primeros sistemas Unix, donde las contraseñas cifradas se almacenaban en un archivo legible por todos (/etc/passwd), los sistemas modernos utilizan un mecanismo más seguro: el archivo /etc/shadow, accesible únicamente por el superusuario. Este cambio fue crucial para prevenir ataques de fuerza bruta locales. El comando principal para interactuar con este sistema es passwd, que permite a los usuarios cambiar su propia contraseña y a los administradores gestionar las de otros, siempre respetando políticas de complejidad y vencimiento.

## El comando passwd

El comando passwd es la interfaz estándar para modificar contraseñas:

- Como usuario normal: `passwd`
- Como administrador (root): `sudo passwd ana`

Puedes cambiar la contraseña de cualquier usuario sin conocer la anterior. Esto es útil al crear cuentas o restablecer accesos.

> Si un usuario no tiene contraseña (o está bloqueada), no podrá iniciar sesión mediante contraseña. Sin embargo, puede acceder mediante otros métodos, como claves SSH.

## El archivo /etc/shadow: corazón de la seguridad de contraseñas

El archivo /etc/shadow almacena información crítica sobre las contraseñas de los usuarios, incluyendo:

- El hash cifrado de la contraseña (nunca la contraseña en texto plano).
- La fecha del último cambio.
- Políticas de vencimiento y advertencia.
- Si la cuenta está bloqueada (indicado por un ! o \* al inicio del hash).

Ejemplo de una línea en /etc/shadow:

`ana:$6$abc123$XyZ...:19700:0:99999:7:::`

Desglose de campos (separados por :):

1. Nombre de usuario.
2. Hash de la contraseña:
   - Comienza con $id$salt$hash.
   - $6$ indica el algoritmo SHA-512 (otros comunes: $1$ = MD5, $5$ = SHA-256).
   - Si empieza con ! o \*, la cuenta está bloqueada.
3. Días desde el 1/1/1970 hasta el último cambio de contraseña.
4. Días mínimos entre cambios (0 = sin restricción).
5. Días máximos antes de vencimiento (99999 ≈ nunca).
6. Días de advertencia antes del vencimiento.
7. Días de gracia tras vencimiento (antes de desactivar la cuenta).
8. Fecha de expiración de la cuenta (en días desde 1970).

Solo root puede leer o modificar este archivo, lo que impide que usuarios normales intenten descifrar hashes mediante ataques locales.

> Nunca edites /etc/shadow directamente. Usa herramientas como passwd, chage o usermod para modificar sus contenidos de forma segura.

## Políticas de vencimiento y gestión avanzada

El comando chage (change age) permite configurar políticas de vencimiento sin cambiar la contraseña:

```bash
sudo chage -l ana          # muestra la política actual
sudo chage -M 90 ana       # contraseña vence cada 90 días
sudo chage -E 2026-12-31 ana  # cuenta expira el 31/12/2026
```

Estas políticas son esenciales en entornos corporativos o regulados, donde se exige rotación periódica de credenciales.

## Qué queda con...

- El comando passwd permite a los usuarios cambiar su contraseña; los administradores pueden cambiar la de cualquier usuario.
- Las contraseñas no se almacenan en texto plano, sino como hashes cifrados en /etc/shadow.
- Solo root puede leer /etc/shadow, lo que protege contra ataques locales.
- Un hash que comienza con ! o \* indica que la cuenta está bloqueada.
- Usa chage para gestionar políticas de vencimiento sin alterar la contraseña.
- Este sistema garantiza que, incluso si un atacante obtiene acceso limitado al sistema, no pueda extraer fácilmente las contraseñas de otros usuarios.

<div class="pagination">
  <a href="/markdown/sistemas/linux/usuarios/usuarios" class="prev">Anterior</a>
  <a href="/markdown/sistemas/linux/usuarios/grupos" class="next">Siguiente</a>
</div>
