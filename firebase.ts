import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { firebaseConfig } from "./firebaseConfig";

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Obtener instancias de los servicios de Firebase
const auth = getAuth(app);
const firestore = getFirestore(app);

export { app, auth, firestore };
