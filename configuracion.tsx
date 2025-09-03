/*
  Este archivo no es utilizado por la aplicación.
  La configuración de variables de entorno para el servidor (como las credenciales de la base de datos)
  debe colocarse en un archivo llamado '.env' en la raíz del proyecto.
  
  El servidor (`server.js`) está configurado para leer este archivo '.env' automáticamente.

  EJEMPLO DE CONTENIDO PARA EL ARCHIVO .env:
  -----------------------------------------
  
  # Conexión directa vía IP pública
  DB_HOST=23.251.146.243
  DB_PORT=5432

  # Credenciales de la base de datos
  DB_USER=postgres
  DB_PASSWORD=HUCinfectologia2025.
  DB_NAME=hucsi

  # (Opcional) Para Cloud SQL Proxy / Cloud Run
  INSTANCE_CONNECTION_NAME=gen-lang-client-0017427264:us-central1:hucsi

*/

// Este export vacío es para que el archivo sea un módulo válido de TypeScript.
export {};
