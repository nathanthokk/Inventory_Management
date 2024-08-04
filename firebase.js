// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBTlE2tjC3uV2wS3Xkn7iI4lsBNIjWgmc4",
  authDomain: "inventory-management-eb825.firebaseapp.com",
  projectId: "inventory-management-eb825",
  storageBucket: "inventory-management-eb825.appspot.com",
  messagingSenderId: "18899814644",
  appId: "1:18899814644:web:481c67404eee21705e36a1",
  measurementId: "G-9N642KPSP6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const firestore = getFirestore(app);

export {firestore};