// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use

const firebaseConfig = {
	apiKey: "AIzaSyCNFL-K_Q9AynedQzkgs94vmqHZq4yA2L0",
	authDomain: "encryptor-734a8.firebaseapp.com",
	projectId: "encryptor-734a8",
	storageBucket: "encryptor-734a8.firebasestorage.app",
	messagingSenderId: "711171224798",
	appId: "1:711171224798:web:a3496547df510878543e4f",
	measurementId: "G-06V6S8ZD08",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
