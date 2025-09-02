
// Fix: The firebase/config.ts file is empty, causing a module resolution error.
// Since the application is migrating away from Firebase, this entire initialization
// script is deprecated and has been commented out to resolve the build issue.
/*
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { firebaseConfig } from "./config";

// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

// Get instances of the services
const app = firebase.app();
const auth = firebase.auth();
const db = firebase.firestore();

export { app, auth, db };
*/
