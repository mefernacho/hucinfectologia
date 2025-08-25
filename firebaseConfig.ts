// ====================================================================================
// PASO DE CONFIGURACIÓN URGENTE Y OBLIGATORIO
// ====================================================================================
// El error de inicio de sesión actual indica que la API de Autenticación de Firebase
// ("Identity Toolkit API") está deshabilitada en tu proyecto de Google Cloud.
//
// ---> SOLUCIÓN: Habilita la API haciendo clic en el siguiente enlace y luego en "HABILITAR".
//
// 1. Haz clic aquí: https://console.cloud.google.com/apis/library/identitytoolkit.googleapis.com?project=hucinfectologia-28217582
// 2. Espera a que cargue la página y presiona el botón azul que dice "HABILITAR".
// 3. Después de habilitarla, espera unos 30 segundos y recarga la aplicación.
//
// El inicio de sesión funcionará después de completar este paso.
// ====================================================================================

export const firebaseConfig = {
  apiKey: "AIzaSyC7bLJ4PNEEmMx7GA-DptVxIkiKUMhnIJE",
  authDomain: "hucinfectologia-28217582.firebaseapp.com", // CORREGIDO para coincidir con el projectId
  projectId: "hucinfectologia-28217582",
  databaseURL: "https://hucsibases.firebaseio.com",
};