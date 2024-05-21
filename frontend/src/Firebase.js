// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBJgpM1kRiY123NoWmOBPf9Xp4Q9offlPo",
    authDomain: "mern-blog-b531a.firebaseapp.com",
    projectId: "mern-blog-b531a",
    storageBucket: "mern-blog-b531a.appspot.com",
    messagingSenderId: "960419626551",
    appId: "1:960419626551:web:8d4250e33e92bad17289b2"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);