---
title: "Compresión y cifrado"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [Compresión y cifrado](#compresión-y-cifrado)
  - [Compresión](#compresión)
    - [Compresión con pérdida](#compresión-con-pérdida)
    - [Compresión sin pérdida](#compresión-sin-pérdida)
  - [Cifrado](#cifrado)
    - [Cifrado simétrico (AES)](#cifrado-simétrico-aes)
    - [Cifrado asimétrico (RSA)](#cifrado-asimétrico-rsa)
    - [Hashing (SHA)](#hashing-sha)
  - [Quédate con...](#quédate-con)

</div>

# Compresión y cifrado

La información digital rara vez viaja o se almacena en su forma original: los datos se transforman para ocupar menos espacio, protegerse de accesos no autorizados o garantizar su integridad frente a modificaciones accidentales o malintencionadas. Estas transformaciones —compresión, cifrado y hashing— operan sobre la representación de los datos sin alterar su significado semántico, permitiendo que aplicaciones heterogéneas intercambien contenido de forma eficiente, segura y verificable. Comprender estos mecanismos es esencial para diseñar sistemas que equilibren rendimiento, privacidad y confiabilidad.

## Compresión

La compresión reduce el volumen de datos eliminando redundancia estadística o información perceptualmente menos relevante. El objetivo no es simplemente ahorrar almacenamiento o ancho de banda, sino habilitar escenarios que serían inviables con datos crudos: transmisión de video en tiempo real sobre conexiones limitadas, respaldo incremental de grandes volúmenes, o distribución masiva de software.

### Compresión con pérdida

La compresión con pérdida descarta selectivamente información que el receptor probablemente no perciba, logrando reducciones drásticas de tamaño a costa de una degradación controlada de la fidelidad original. Esta aproximación se fundamenta en modelos psicoacústicos (para audio) o psicovisuales (para imagen y video) que identifican componentes prescindibles.

JPEG aplica una transformada discreta del coseno para convertir bloques de imagen del dominio espacial al frecuencial, luego cuantiza agresivamente las componentes de alta frecuencia —menos perceptibles para el ojo humano— antes de codificar el resultado. El nivel de compresión es configurable: mayor compresión reduce más el tamaño pero introduce artefactos visibles como bloques o borrosidad en bordes.

MP3 emplea un modelo similar para audio: analiza el espectro de frecuencias, elimina componentes enmascaradas por sonidos más prominentes (enmascaramiento frecuencial y temporal), y codifica el residuo con técnicas de codificación entrópica. El resultado es un archivo de audio que suena prácticamente idéntico al original para la mayoría de oyentes, pero ocupa una fracción del espacio.

Estos formatos son irreversibles: una vez comprimidos, los datos descartados no pueden recuperarse. Por esta razón, la compresión con pérdida se reserva para distribución final, nunca para edición intermedia o archivado de masters.

### Compresión sin pérdida

La compresión sin pérdida preserva íntegramente la información original: al descomprimir, se reconstruye exactamente el mismo flujo de bits de entrada. Esta garantía es indispensable para código ejecutable, documentos de texto, bases de datos o cualquier dato donde un bit alterado cambie el significado.

Los algoritmos sin pérdida explotan redundancias estadísticas: secuencias repetidas, patrones predecibles o distribuciones no uniformes de símbolos. ZIP combina el algoritmo DEFLATE (una cascada de LZ77 para eliminar repeticiones y codificación Huffman para asignar códigos cortos a símbolos frecuentes) con un contenedor que permite agrupar múltiples archivos y metadatos. PNG aplica filtros de predicción por línea antes de comprimir con DEFLATE, optimizando la compresión para imágenes con áreas de color uniforme o bordes nítidos.

La relación de compresión sin pérdida es inherentemente menor que con pérdida: típicamente 2:1 a 10:1 según la naturaleza de los datos, frente a 10:1 o más en JPEG/MP3. Sin embargo, la garantía de reconstrucción exacta justifica este costo en contextos donde la integridad es prioritaria.

> Algunos formatos ofrecen modos híbridos: WebP y AVIF permiten compresión con o sin pérdida según configuración; FLAC comprime audio sin pérdida pero con ratios cercanos a MP3 en material con poca dinámica. La elección depende del caso de uso, no de una jerarquía absoluta entre técnicas.

## Cifrado

El cifrado transforma datos legibles (texto plano) en una representación ininteligible (texto cifrado) mediante un algoritmo y una clave, permitiendo que solo quienes posean la clave adecuada puedan recuperar la información original. Esta operación protege la confidencialidad de los datos en tránsito o en reposo, mitigando riesgos de interceptación, acceso no autorizado o filtración.

### Cifrado simétrico (AES)

El cifrado simétrico emplea la misma clave para cifrar y descifrar. AES (*Advanced Encryption Standard*), adoptado como estándar por el NIST en 2001, es el algoritmo simétrico más extendido: opera sobre bloques de 128 bits con claves de 128, 192 o 256 bits, aplicando múltiples rondas de sustituciones, permutaciones y mezclas lineales que difunden y confunden la relación entre texto plano y cifrado.

Su eficiencia computacional lo hace adecuado para cifrar grandes volúmenes de datos: discos completos (LUKS, BitLocker), conexiones TLS, archivos comprimidos cifrados. La debilidad inherente es la gestión de claves: emisor y receptor deben compartir la clave secreta por un canal seguro antes de comunicarse, un desafío en entornos distribuidos sin contacto previo.

### Cifrado asimétrico (RSA)

El cifrado asimétrico resuelve el problema de distribución de claves mediante pares de claves matemáticamente vinculadas: una pública (compartible abiertamente) y una privada (mantenida en secreto). RSA, basado en la dificultad de factorizar números enteros grandes, permite que cualquiera cifre un mensaje con la clave pública del destinatario, pero solo quien posea la clave privada correspondiente pueda descifrarlo.

Esta propiedad habilita escenarios imposibles con criptografía simétrica: firma digital (cifrar un hash con la clave privada para probar autoría), intercambio seguro de claves simétricas (como en TLS), o autenticación sin compartir secretos. Sin embargo, RSA es órdenes de magnitud más lento que AES y limita el tamaño del mensaje cifrable, por lo que en la práctica se usa híbrido: RSA intercambia una clave de sesión AES, que luego cifra el flujo de datos.

### Hashing (SHA)

El hashing no es cifrado: transforma datos de longitud arbitraria en un resumen de tamaño fijo (digest) mediante una función unidireccional irreversible. SHA-256, parte de la familia SHA-2, produce un digest de 256 bits donde cualquier modificación mínima en la entrada altera completamente la salida (efecto avalancha).

Los hashes verifican integridad: al descargar un archivo, comparar su hash calculado con el publicado por la fuente detecta corrupción o manipulación. También son fundamentales en firma digital (se firma el hash, no el documento completo), derivación de claves (PBKDF2, bcrypt) y estructuras de datos como Merkle trees en blockchains.

> Los hashes criptográficos no deben confundirse con checksums simples (CRC, MD5 para integridad no segura): MD5 y SHA-1 están rotos para seguridad, aunque siguen siendo útiles para detección accidental de errores. Para aplicaciones críticas, usar SHA-256 o superior.

## Quédate con...

*   La compresión reduce volumen de datos: con pérdida (JPEG, MP3) sacrifica fidelidad por eficiencia; sin pérdida (ZIP, PNG) garantiza reconstrucción exacta con ratios menores.
*   El cifrado protege confidencialidad: simétrico (AES) es rápido pero requiere compartir clave secreta; asimétrico (RSA) resuelve distribución de claves pero es más lento, usándose típicamente en esquemas híbridos.
*   El hashing (SHA) verifica integridad mediante funciones unidireccionales irreversibles: cualquier cambio en la entrada altera completamente el digest, permitiendo detección de manipulación.
*   La elección de técnica depende del objetivo: compresión para eficiencia de almacenamiento/transmisión, cifrado para privacidad, hashing para integridad y autenticación.
*   Ninguna técnica es universalmente superior: sistemas robustos combinan compresión sin pérdida + cifrado simétrico + hashing + intercambio asimétrico de claves según el contexto de uso.



<div class="pagination">
  <a href="/markdown/sistemas/redes/presentacion/formatos" class="prev">Anterior</a>
  <a href="/markdown/sistemas/redes/presentacion/codificaciones" class="next">Siguiente</a>
</div>
