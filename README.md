# API Ripley
Microservicio que retorna el tiempo en diferentes ciudades , se conecta con la API de Darksky y almacena los resultados cacheados

# Autor
Fabián Andrés Ramírez Sepúlveda

# Servicios requeridos
- Redis

## Instalación
npm install

## ¿Como correr el servicio en producción?
- npm install -g pm2
- ENVIRONMENT=production PORT_API=3030 pm2 start app.js --name ripley-api

# Variables de entorno
- DARKSKY_API_KEY={Api Key entregado por Darksky}
- PORT_API={Puerto en el que correrá la API}
- ENVIRONMENT={Ambiente donde correrá el servicio}

## ¿Como detener el servicio en producción?
pm2 stop ripley-api

## ¿Como correr los tests?
npm test

## Benchmark del servicio
```
Requests per second:    2155.31 [#/sec]
Time per request:       46.397 [ms]
Time per request:       0.464 [ms]
```