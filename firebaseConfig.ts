// *** ¡ACCIÓN URGENTE REQUERIDA! GUÍA DE CONFIGURACIÓN DE FIREBASE ***
//
// La aplicación no funcionará correctamente hasta que completes los siguientes 3 pasos
// en la consola de tu proyecto de Firebase: https://console.firebase.google.com/
//
// ------------------------------------------------------------------------------------
// PASO 1: CREAR LA BASE DE DATOS (SOLUCIÓN AL ERROR DE CONEXIÓN O "code=unavailable")
// ------------------------------------------------------------------------------------
// 1. En el menú de la izquierda, ve a "Build" (Construir) > "Firestore Database".
// 2. Haz clic en el botón "Create database" (Crear base de datos).
// 3. Selecciona "Start in test mode" (Comenzar en modo de prueba). ¡Esto es crucial!
//    - ADVERTENCIA: Para producción, deberás configurar reglas de seguridad más estrictas.
// 4. Elige una ubicación para tu base de datos y haz clic en "Enable" (Habilitar).
//
// ------------------------------------------------------------------------------------
// PASO 2: HABILITAR EL INICIO DE SESIÓN (SOLUCIÓN AL ERROR 'auth/configuration-not-found')
// ------------------------------------------------------------------------------------
// 1. En el menú de la izquierda, ve a "Build" (Construir) > "Authentication".
// 2. Haz clic en la pestaña "Sign-in method" (Método de inicio de sesión).
// 3. Habilita el proveedor "Correo electrónico/Contraseña" y guarda.
//
// ------------------------------------------------------------------------------------
// PASO 3: CREAR EL USUARIO AUTORIZADO (SOLUCIÓN AL ERROR 'auth/invalid-credential')
// ------------------------------------------------------------------------------------
// 1. En la sección "Authentication", ve a la pestaña "Users".
// 2. Haz clic en "Add user" (Añadir usuario).
// 3. Email: hucsi@hucsi.com
// 4. Password: HUCinfectologia2025
// 5. Haz clic en "Add user".
//
// Una vez completados estos pasos, recarga la aplicación.
//
// ADVERTENCIA: No subas este archivo con credenciales reales a un repositorio público.
// En un entorno de producción, utiliza variables de entorno.

export const firebaseConfig = {
  apiKey: "AIzaSyDxgCNAEtmJaYDTYYK5s_l2vkSH1kqltYU",
  authDomain: "gen-lang-client-0017427264.firebaseapp.com",
  projectId: "gen-lang-client-0017427264",
  storageBucket: "gen-lang-client-0017427264.appspot.com",
  messagingSenderId: "511318369202",
  appId: "1:511318369202:web:0215998e0385dcdb093aab"
};

/*
  Instrucciones Adicionales:
  1. Ve a la consola de tu proyecto de Firebase: https://console.firebase.google.com/
  2. En "Configuración del proyecto" (el ícono del engranaje) > "General", busca la configuración de tu aplicación web.
  3. Copia los valores del objeto de configuración de Firebase y pégalos aquí si son diferentes.
*/
