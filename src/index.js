import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, addDoc } from "firebase/firestore";
import firebaseConfig from "./config.js";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const colRef = collection(db, "books");
let books = [];

// Function to get books from Firestore
async function getBooks() {
  try {
    const querySnapshot = await getDocs(colRef);
    books = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    console.log(books);
  } catch (error) {
    console.error("Error getting data: ", error);
  }
}

// Function to add a book to Firestore
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

function initializeForm() {
  document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("addingBooksForm");
    if (form) {
      console.log("Form found!");
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        console.log("Form submitted");

        const title = document.getElementById("title").value;
        const author = document.getElementById("author").value;
        const description = document.getElementById("description").value;
        const image = document.getElementById("image").value;
        const pages = document.getElementById("pages").value;

        console.log("Form values:", {
          title,
          author,
          description,
          image,
          pages,
        });

        addBook(title, author, description, image, pages);
        console.log("Book added!");
      });
    } else {
      console.log("Form not found!");
    }
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  if (window.location.pathname === "/dist/") {
    const currentlyReadingSection = document.getElementById("currentlyReading");

    // Function to update the "Currently Reading" section
    function updateCurrentlyReading(book) {
      const detailsSection = document.getElementById("detailsSection");
      const bookDescription = document.getElementById("bookDescription");
      const bookCoverImage = document.getElementById("bookCoverImage");

      if (detailsSection && bookDescription && bookCoverImage) {
        detailsSection.innerHTML = `
          <h2>Currently Reading</h2>
          <h4>${book.title}</h4>
          <h4>${book.author}</h4>
          <h4>Page ${book.currentPage} out of ${book.pages}</h4>
          <a href="../pages/edit-book.html">
            <button>Edit Book</button>
          </a>
        `;

        bookDescription.innerHTML = `<p>${book.description}</p>`;
        bookCoverImage.innerHTML = `<img src="${book.image}" alt="${book.title} cover" />`;
      } else {
        console.error(
          "One or more elements for 'Currently Reading' section not found"
        );
      }
    }

    // Retrieve books from Firestore and update the "Currently Reading" section
    try {
      await getBooks(); // Ensure getBooks is defined and retrieves the books
      if (books.length > 0) {
        updateCurrentlyReading(books[books.length - 1]);
      } else {
        console.error("No books found");
      }
    } catch (error) {
      console.error("Error retrieving books: ", error);
    }
  }

  if (window.location.pathname.includes("my-library.html")) {
    const bookCardsSection = document.getElementById("bookCards");

    // Function to create a book card
    function createBookCard(book) {
      const card = document.createElement("div");
      card.className = "book-card";
      card.innerHTML = `
        <h3>${book.title}</h3>
        <p><strong>Author:</strong> ${book.author}</p>
        <p><strong>Description:</strong> ${book.description}</p>
        <p><strong>Pages:</strong> ${book.pages}</p>
        <img src="${book.image}" alt="${book.title} cover" />
      `;
      return card;
    }

    // Retrieve books from Firestore and display them
    try {
      await getBooks(); // Ensure getBooks is defined and retrieves the books
      if (bookCardsSection) {
        books.forEach((book) => {
          const bookCard = createBookCard(book);
          bookCardsSection.appendChild(bookCard);
        });
      } else {
        console.error("bookCardsSection element not found");
      }
    } catch (error) {
      console.error("Error retrieving books: ", error);
    }
  }
});

initializeForm();
