import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, addDoc } from "firebase/firestore";
import firebaseConfig from "./config.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function getBooks() {
  const querySnapshot = await getDocs(collection(db, "books"));
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

addBook(
  "The Hobbit",
  "J.R.R. Tolkien",
  "A hobbit goes on an adventure.",
  "https://images-na.ssl-images-amazon.com/images/I/51g0ZJFZ6SL._SX331_BO1,204,203,200_.jpg",
  310
);
