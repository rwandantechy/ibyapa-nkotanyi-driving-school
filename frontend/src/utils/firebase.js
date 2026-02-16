import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCSCp2RDAhEOeUB8YjIcHuGbqrQhLu0zRs",
  authDomain: "new-ibyapa-photos.firebaseapp.com",
  databaseURL: "https://new-ibyapa-photos-default-rtdb.firebaseio.com",
  projectId: "new-ibyapa-photos",
  storageBucket: "new-ibyapa-photos.appspot.com",
  messagingSenderId: "96806905864",
  appId: "1:96806905864:web:8e87cbf4e41ae56770c9bd",
  measurementId: "G-4X3LRE84ZK"
};

export const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const storage = getStorage();
