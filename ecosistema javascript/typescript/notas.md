# TypeScript

## Instalación

> Instalar TypeScript en local y como dependencia de desarrollo es la práctica recomendada

- La opción recomendada por la documentación oficial es instalarlo localmente en cada proyecto. 
- Según la documentación oficial de TypeScript, instalarlo por proyecto garantiza que cada proyecto use su propia versión, evitando incompatibilidades y asegurando builds reproducibles.
- Si trabajas en proyectos con versiones distintas de TypeScript, una instalación global puede causar conflictos. 

Comando:

```bash
npm install --save-dev typescript
```

## Configuración básica

- Hot reload:
    - tsc archivo.ts --watch (o) tsc archivo.ts --watch
    - npx tsc archivo.ts --w
    - También se puede poner el script en el package.json

- Fichero de configuración(tsconfig.json)
    - npx tsc --init
    -Configuraciones básicas:
        - Directorio de entrada: "rootDir": "./src"
        - Directorio de salida: "outDir": "./public",
        - Tener en cuenta varias carpetas => "include": ["src"]
        - "noEmitOnError": true => No genera JS si hay errores

