import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBONkiXTTwK1y5J43S6I6XAdAEymDcq9aQ",
  authDomain: "hotel-booking-app-735bc.firebaseapp.com",
  projectId: "hotel-booking-app-735bc",
  storageBucket: "hotel-booking-app-735bc.firebasestorage.app",
  messagingSenderId: "667347656539",
  appId: "1:667347656539:web:cc4762b2495c79f256047e",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);