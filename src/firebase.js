import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAwdfyadvYnJazlNXbfmV7WdHteCqTX25I",
    authDomain: "todo-app-ec31c.firebaseapp.com",
    projectId: "todo-app-ec31c",
    storageBucket: "todo-app-ec31c.appspot.com",
    messagingSenderId: "347268787405",
    appId: "1:347268787405:web:79875ae8399c8d2384cd84",
    measurementId: "G-58KT0MBSER"
};

firebase.initializeApp(firebaseConfig);

export default firebase;