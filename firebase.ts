
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import { firebaseConfig } from "./firebaseConfig";

// Inicializa Firebase con la configuración
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

// Obtiene una referencia al servicio de la base de datos Firestore
export const db = firebase.firestore();

// Obtiene una referencia al servicio de autenticación
export const auth = firebase.auth();
