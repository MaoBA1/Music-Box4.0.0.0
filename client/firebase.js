import  { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
import { getFirestore } from "firebase/firestore";




const firebaseConfig = {
  apiKey: "AIzaSyCuHUhB84qcXK2i59tEXlXsmShnNO2iu-4",
  authDomain: "musicboxapp-aad61.firebaseapp.com",
  projectId: "musicboxapp-aad61",
  storageBucket: "musicboxapp-aad61.appspot.com",
  messagingSenderId: "474894645241",
  appId: "1:474894645241:web:596e942795aabc0d27af28"
};


const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export const db = getFirestore(app);