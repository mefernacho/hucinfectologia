import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { firebaseConfig } from "./firebaseConfig";

// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

// Get instances of the services
const app = firebase.app();
const auth = firebase.auth();
const db = firebase.firestore();

export { app, auth, db };
