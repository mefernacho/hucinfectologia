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
  Instrucciones:
  1. Ve a la consola de tu proyecto de Firebase: https://console.firebase.google.com/
  2. En "Configuración del proyecto" (el ícono del engranaje) > "General", busca la configuración de tu aplicación web.
  3. Copia los valores del objeto de configuración de Firebase y pégalos aquí.
  4. IMPORTANTE: Configura las Reglas de Seguridad de Firestore para proteger tus datos.
     Ve a Firestore Database > Rules y usa reglas como las siguientes para empezar:
     
     rules_version = '2';
     service cloud.firestore {
       match /databases/{database}/documents {
         // Permite leer y escribir solo a usuarios autenticados.
         match /{document=**} {
           allow read, write: if request.auth != null;
         }
       }
     }
*/