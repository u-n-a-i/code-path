---
title: "Privacidad y licencias"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [Privacidad y licencias](#privacidad-y-licencias)
  - [Repositorios públicos vs. privados](#repositorios-públicos-vs-privados)
    - [Repositorios públicos](#repositorios-públicos)
    - [Repositorios privados](#repositorios-privados)
    - [Cambiar visibilidad](#cambiar-visibilidad)
  - [Importancia de incluir una licencia](#importancia-de-incluir-una-licencia)
    - [¿Por qué importa la licencia?](#por-qué-importa-la-licencia)
    - [Licencias comunes y sus características](#licencias-comunes-y-sus-características)
      - [Licencias permisivas](#licencias-permisivas)
      - [Licencias copyleft (recíprocas)](#licencias-copyleft-recíprocas)
    - [Cómo elegir una licencia](#cómo-elegir-una-licencia)
    - [Añadir una licencia a tu repositorio](#añadir-una-licencia-a-tu-repositorio)
    - [Licencias para no-código](#licencias-para-no-código)
    - [Compatibilidad de licencias](#compatibilidad-de-licencias)
  - [Quédate con...](#quédate-con)

</div>

# Privacidad y licencias

El código que escribes está protegido por derechos de autor desde el momento de su creación, pero sin una licencia explícita, nadie —incluidos colaboradores potenciales— tiene permiso legal para usarlo, modificarlo o distribuirlo. En plataformas como GitHub, la elección entre repositorio público o privado determina quién puede *ver* tu código; la licencia determina quién puede *hacer* algo con él. Comprender esta distinción es esencial para proteger tu trabajo, colaborar responsablemente y evitar riesgos legales al usar código de terceros.

## Repositorios públicos vs. privados

La visibilidad de un repositorio es la primera capa de control sobre tu código. GitHub ofrece dos modos fundamentales, cada uno con implicaciones de privacidad, colaboración y costo.

### Repositorios públicos

Un repositorio público es visible para cualquier persona en internet, con o sin cuenta de GitHub. Cualquiera puede:

*   **Clonar** el repositorio a su máquina local
*   **Ver** el historial completo de commits, issues y pull requests
*   **Hacer fork** para crear su propia copia y proponer cambios
*   **Descargar** el código como archivo ZIP

**Casos de uso típicos:**
*   Proyectos open source que buscan contribuciones de la comunidad
*   Portafolios personales para demostrar habilidades a empleadores
*   Librerías y herramientas que quieres que otros usen
*   Documentación pública de APIs o estándares

**Consideraciones de seguridad:**
```bash
# ❌ Nunca commits en público:
.env              # Variables de entorno con secretos
config/prod.json  # Credenciales de producción
id_rsa            # Claves SSH privadas
*.pem             # Certificados privados

# ✅ Usa .gitignore para excluirlos:
$ echo ".env" >> .gitignore
$ echo "*.pem" >> .gitignore
```

> Hacer público un repositorio que contenía secretos previamente **no elimina el historial**. Las credenciales commitadas siguen accesibles en commits antiguos. Si expones secretos, rotalos inmediatamente y considera herramientas como `git filter-branch` o BFG Repo-Cleaner para eliminarlos del historial (aunque GitHub recomienda rotar antes que limpiar).

### Repositorios privados

Un repositorio privado solo es visible para ti y para colaboradores explícitamente invitados. El acceso requiere autenticación y permisos específicos (read, write, admin).

**Casos de uso típicos:**
*   Código propietario de empresas o productos comerciales
*   Proyectos en desarrollo temprano antes del lanzamiento público
*   Código con datos sensibles, secretos o información regulada
*   Trabajo académico o personal que no deseas compartir

**Gestión de colaboradores:**
```
Configuración → Manage access → Invite a collaborator

Permisos disponibles:
• Read: Solo ver y clonar
• Write: Push, crear ramas, gestionar issues
• Admin: Gestionar configuración, colaboradores, eliminar repo
```

**Costos y límites:**
| Plan | Repos privados | Colaboradores | Features |
|------|---------------|---------------|----------|
| GitHub Free | Ilimitados | Ilimitados | CI/CD básico, 500 MB Actions/mes |
| GitHub Pro | Ilimitados | Ilimitados | Code owners, protección avanzada de ramas |
| GitHub Team | Ilimitados | Ilimitados | Gestión de equipos, SAML SSO |
| GitHub Enterprise | Personalizable | Personalizable | Compliance, audit logs, soporte 24/7 |

> Los repositorios privados en cuentas gratuitas tienen acceso completo a todas las features de Git y GitHub Actions (con límites de minutos). La principal limitación es la visibilidad, no la funcionalidad.

### Cambiar visibilidad

Puedes convertir un repositorio de público a privado (y viceversa) en cualquier momento desde **Settings → Danger Zone → Change visibility**.

**Consecuencias de hacer privado un repo público:**
*   Los forks públicos existentes permanecen públicos pero se "desconectan" del original
*   Los issues y PRs públicos siguen visibles en los forks
*   Las estrellas y watchers se mantienen pero el repo deja de aparecer en búsquedas públicas

**Consecuencias de hacer público un repo privado:**
*   Todo el historial, incluyendo commits antiguos con posibles secretos, se vuelve visible
*   Los colaboradores pierden acceso si no tienen permisos explícitos en el nuevo estado público

> Antes de hacer público un repositorio, ejecuta una auditoría de secretos: `git log -p | grep -i "password\|api_key\|secret"` o usa herramientas como `truffleHog` o `git-secrets` para escanear el historial completo.

## Importancia de incluir una licencia

Por defecto, el código sin licencia está protegido por copyright tradicional: **todos los derechos reservados**. Esto significa que nadie puede legalmente copiar, modificar, distribuir o usar tu código, ni siquiera para fines educativos, sin tu permiso explícito. Incluir una licencia es el acto legal que otorga permisos específicos a otros.

### ¿Por qué importa la licencia?

| Sin licencia | Con licencia clara |
|-------------|-------------------|
| ❌ Nadie puede usar tu código legalmente | ✅ Otros saben qué pueden hacer con él |
| ❌ Empresas no pueden adoptarlo por riesgo legal | ✅ Organizaciones evalúan y usan con confianza |
| ❌ Colaboradores no pueden contribuir con claridad de derechos | ✅ Contribuciones tienen términos definidos |
| ❌ No puedes demandar por uso no autorizado (ambigüedad) | ✅ Los términos son ejecutables legalmente |

### Licencias comunes y sus características

Las licencias de software open source se agrupan en dos familias principales: permisivas y copyleft.

#### Licencias permisivas

Otorgan amplia libertad de uso con mínimas restricciones. Ideales para maximizar adopción.

| Licencia | Permite uso comercial | Requiere atribución | Requiere publicar cambios | Compatibilidad |
|----------|---------------------|-------------------|--------------------------|----------------|
| **MIT** | ✅ Sí | ✅ Sí (aviso de copyright) | ❌ No | Alta |
| **BSD 2/3-Clause** | ✅ Sí | ✅ Sí | ❌ No | Alta |
| **Apache 2.0** | ✅ Sí | ✅ Sí + cambios documentados | ❌ No | Alta + patentes |

**MIT License (la más popular):**
```
Características:
• Extremadamente simple (~200 palabras)
• Permite: usar, copiar, modificar, fusionar, publicar, distribuir, sublicenciar, vender
• Requiere: incluir aviso de copyright y licencia original en copias
• No requiere: publicar cambios, compartir mejoras, mantener open source

Ideal para: librerías que quieres que cualquiera use, incluso en software propietario
```

**Apache 2.0:**
```
Características:
• Similar a MIT pero con cláusulas explícitas de patentes
• Otorga licencia de patentes de contribuyentes a usuarios
• Requiere: documentar cambios significativos en archivos modificados
• Incluye: protección contra litigios de patentes

Ideal para: proyectos corporativos o con riesgo de disputas de propiedad intelectual
```

#### Licencias copyleft (recíprocas)

Requieren que el software derivado se distribuya bajo la misma licencia. Diseñadas para preservar la libertad del código.

| Licencia | Ámbito de reciprocidad | Uso en software propietario | Compatibilidad |
|----------|----------------------|---------------------------|----------------|
| **GPL v3** | Todo el programa derivado | ❌ No (debe ser GPL) | Limitada |
| **LGPL v3** | Solo la librería enlazada | ✅ Sí (si se enlaza dinámicamente) | Media |
| **AGPL v3** | Incluye uso por red/SaaS | ❌ No (incluso para servicios web) | Limitada |

**GPL v3 (GNU General Public License):**
```
Características:
• Permite: usar, modificar, distribuir el código
• Requiere: cualquier software que lo incluya debe ser GPL también
• Requiere: proporcionar código fuente a usuarios del software distribuido
• No aplica: si solo usas el software internamente sin distribuirlo

Ideal para: proyectos que quieren garantizar que las mejoras permanezcan open source
```

**AGPL v3 (Affero GPL):**
```
Características:
• Extiende GPL para cubrir software ejecutado como servicio (SaaS)
• Si usuarios interactúan con el software por red, deben poder obtener el código
• Cierra el "loophole" de SaaS que evitaba la reciprocidad de GPL tradicional

Ideal para: aplicaciones web donde quieres que las mejoras del servidor también se compartan
```

### Cómo elegir una licencia

No existe una licencia "mejor" universalmente. La elección depende de tus objetivos:

```
¿Quieres maximizar adopción y permitir uso comercial?
→ MIT o Apache 2.0

¿Quieres garantizar que las mejoras permanezcan open source?
→ GPL v3

¿Tu proyecto es una librería que podría usarse en software propietario?
→ MIT, BSD, o LGPL (si quieres reciprocidad solo para la librería)

¿Te preocupan las patentes o trabajas en entorno corporativo?
→ Apache 2.0 (cláusulas explícitas de patentes)

¿Tu proyecto es una aplicación web y quieres reciprocidad incluso para SaaS?
→ AGPL v3
```

Herramientas para decidir:
*   [choosealicense.com](https://choosealicense.com) — Guía interactiva de GitHub
*   [tl;drLegal](https://tldrlegal.com) — Explicaciones simples de licencias
*   [OSS Watch](https://oss-watch.ac.uk) — Comparativas técnicas detalladas

### Añadir una licencia a tu repositorio

GitHub facilita la inclusión de licencias mediante interfaz y CLI.

**Método 1: Interfaz web de GitHub**
1.  En tu repositorio, click en "Add file" → "Create new file"
2.  Nombre: `LICENSE` o `LICENSE.md` (en mayúsculas para detección automática)
3.  Click en "Choose a license template"
4.  Selecciona la licencia deseada de la lista
5.  GitHub pre-llena el texto con tu nombre y año
6.  Commit el archivo

**Método 2: GitHub CLI**
```bash
# Añadir licencia MIT desde terminal
$ gh repo license add mit

# Listar licencias disponibles
$ gh repo license list
```

**Método 3: Manualmente**
```bash
# Descargar plantilla de choosealicense.com
$ curl -O https://raw.githubusercontent.com/github/choosealicense.com/gh-pages/_licenses/mit-0.txt
$ mv mit-0.txt LICENSE

# Editar para añadir tu nombre y año
$ sed -i "s/\[year\]/$(date +%Y)/g; s/\[fullname\]/Tu Nombre/g" LICENSE

# Commit
$ git add LICENSE
$ git commit -m "Add MIT license"
$ git push
```

> El archivo debe llamarse `LICENSE`, `LICENSE.txt`, `LICENSE.md` o similar (en mayúsculas) para que GitHub lo detecte automáticamente y muestre el badge de licencia en la página principal del repositorio.

### Licencias para no-código

No todo en un repositorio es código. Otros activos pueden requerir licencias distintas:

| Tipo de contenido | Licencia recomendada | Razón |
|------------------|---------------------|-------|
| **Documentación** | CC BY 4.0 o CC BY-SA 4.0 | Permite reuso con atribución, compatible con documentación técnica |
| **Datos/datasets** | CC0 (dedicación al dominio público) o ODbL | Facilita reuso de datos sin restricciones legales |
| **Diseños/arte** | CC BY-NC-ND (si quieres restringir uso comercial/modificación) | Protege obras creativas mientras permite compartir |
| **Configuraciones/ejemplos** | Misma licencia que el código principal | Mantiene consistencia legal en el proyecto |

```
Ejemplo de LICENSES/ directory para proyectos complejos:

LICENSE           # Licencia principal para código (MIT)
LICENSE-docs      # Licencia para documentación (CC BY 4.0)
LICENSE-data      # Licencia para datasets (CC0)
```

### Compatibilidad de licencias

Combinar código con licencias distintas puede crear conflictos legales. Reglas básicas:

```
✅ Compatible:
• MIT + Apache 2.0 → Puedes mezclar y distribuir bajo Apache 2.0
• GPL v2 + GPL v2 → Obviamente compatible
• LGPL librería + software propietario (enlazado dinámicamente)

❌ Incompatible:
• GPL v3 + código bajo licencia propietaria → No puedes distribuir el conjunto
• GPL v2-only + GPL v3 code → Conflictos de versión (a menos que sea "v2 or later")
• AGPL + software SaaS propietario → Requiere publicar código del servicio

⚠️ Verificar siempre:
• Usa herramientas como FOSSA, Black Duck, o scancode-toolkit para escanear dependencias
• Revisa licencias de paquetes npm/pip/cargo antes de añadirlos como dependencias
```

> Las licencias son vinculantes legalmente. Si no estás seguro sobre compatibilidad o implicaciones comerciales, consulta con un abogado especializado en propiedad intelectual de software.

## Quédate con...

*   Los repositorios públicos son visibles para cualquiera; los privados requieren invitación explícita. Elegir visibilidad depende de si buscas colaboración abierta o protección de propiedad.
*   El código sin licencia tiene "todos los derechos reservados" por defecto: nadie puede usarlo legalmente sin permiso explícito.
*   Las licencias permisivas (MIT, Apache) maximizan adopción permitiendo uso comercial y modificación sin reciprocidad.
*   Las licencias copyleft (GPL, AGPL) preservan la libertad del código requiriendo que derivados mantengan la misma licencia.
*   Añadir un archivo `LICENSE` en mayúsculas permite que GitHub lo detecte automáticamente y muestre el badge correspondiente.
*   La compatibilidad de licencias es crítica al combinar código de múltiples fuentes: verifica antes de mezclar proyectos con licencias distintas.
*   No-código (documentación, datos, arte) puede requerir licencias distintas (Creative Commons) para reflejar adecuadamente los permisos deseados.
*   Antes de hacer público un repositorio, audita el historial en busca de secretos commitados accidentalmente; rotar credenciales es más efectivo que intentar limpiar el historial.

<div class="pagination">
  <a href="/markdown/sistemas/git/github/cli" class="prev">Anterior</a>
  <a href="/sistemas/" class="next">Siguiente</a>
</div>
