import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDdr0egWOxhDiQC4Qj1bTsKFNuKE1NEcgA",
  authDomain: "frauddit.firebaseapp.com",
  projectId: "frauddit",
  storageBucket: "frauddit.firebasestorage.app",
  messagingSenderId: "776502277779",
  appId: "1:776502277779:web:e805d637d2d3addaa9bf66",
  measurementId: "G-477KLBQZ76"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);  // Initialize Firebase Authentication
const analytics = getAnalytics(app);

export { auth };  // Export auth for use in other parts of your app