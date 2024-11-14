import { initializeApp } from "firebase/app";
import { getFirestore, getDocs, collection, addDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCLm4itgfS0SxA-BKoZer2Vd_B40XhlJ1Y",
  authDomain: "my-tbr-339c7.firebaseapp.com",
  projectId: "my-tbr-339c7",
  storageBucket: "my-tbr-339c7.firebasestorage.app",
  messagingSenderId: "486477094343",
  appId: "1:486477094343:web:450dc9abba256f79470de2",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const querySnapshot = await getDocs(collection(db, "books"));

function getBooks() {
  querySnapshot.forEach((doc) => {
    console.log(`${doc.id} => ${doc.data()}`);
  });
}

async function addBook(title, author, description, image, pages) {
  try {
    const docRef = await addDoc(collection(db, "books"), {
      title: title,
      author: author,
      description: description,
      image: image,
      pages: pages,
    });
    console.log("Document written with ID: ", docRef.id);
  } catch (error) {
    console.error("Error adding document: ", error);
  }
}
