const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Register new user
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password required" });
  }

  if (isValid(username)) {
    return res.status(400).json({ message: "Username already exists" });
  }

  users.push({ username, password });
  return res.status(200).json({ message: "User registered successfully" });
});

// Get all books - Tarea 1 (Original)
public_users.get('/', function (req, res) {
  return res.status(200).json(books);
});

// Get book by ISBN - Tarea 2 (Original)
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  return res.status(200).json(book);
});

// Get books by author - Tarea 3 (Original)
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  const matchingBooks = [];

  for (const [isbn, book] of Object.entries(books)) {
    if (book.author.toLowerCase() === author.toLowerCase()) {
      matchingBooks.push(book);
    }
  }

  if (matchingBooks.length === 0) {
    return res.status(404).json({ message: "No books found by this author" });
  }

  return res.status(200).json(matchingBooks);
});

// Get books by title - Tarea 4 (Original)
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  const matchingBooks = [];

  for (const [isbn, book] of Object.entries(books)) {
    if (book.title.toLowerCase().includes(title.toLowerCase())) {
      matchingBooks.push(book);
    }
  }

  if (matchingBooks.length === 0) {
    return res.status(404).json({ message: "No books found with this title" });
  }

  return res.status(200).json(matchingBooks);
});

// Get book reviews - Tarea 5 (Original)
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  return res.status(200).json(book.reviews);
});

/****************** VERSIONES CON ASYNC/AWAIT Y AXIOS ******************/

// Tarea 10: Get all books usando Axios (Async/Await)
public_users.get('/axios/books', async (req, res) => {
  try {
    // Simulamos llamada a API externa con Axios
    const response = await axios.get("http://localhost:5000");
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching books from API",
      error: error.message
    });
  }
});

// Tarea 11: Get book by ISBN usando Axios (Promesas)
public_users.get('/axios/isbn/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  axios.get(`http://localhost:5000/isbn/${isbn}`)
    .then(response => {
      res.status(200).json(response.data);
    })
    .catch(error => {
      res.status(404).json({
        message: "Book not found in API",
        error: error.message
      });
    });
});

// Tarea 12: Get books by author usando Axios (Async/Await)
public_users.get('/axios/author/:author', async (req, res) => {
  try {
    const author = req.params.author;
    // Primero obtenemos todos los libros
    const allBooks = await axios.get(`http://localhost:5000/`);
    // Filtramos localmente (simulando procesamiento del lado del cliente)
    const filteredBooks = Object.values(allBooks.data).filter(
      book => book.author.toLowerCase() === author.toLowerCase()
    );

    if (filteredBooks.length === 0) {
      return res.status(404).json({ message: "No books found by this author" });
    }
    res.status(200).json(filteredBooks);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching books from API",
      error: error.message
    });
  }
});

// Tarea 13: Get books by title usando Axios (Promesas + Async/Await)
public_users.get('/axios/title/:title', async (req, res) => {
  try {
    const title = req.params.title;
    // Obtenemos todos los libros usando Axios
    const response = await axios.get(`http://localhost:5000/`);
    // Filtramos por título
    const filteredBooks = Object.values(response.data).filter(
      book => book.title.toLowerCase().includes(title.toLowerCase())
    );

    if (filteredBooks.length === 0) {
      return res.status(404).json({ message: "No books found with this title" });
    }
    res.status(200).json(filteredBooks);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching books from API",
      error: error.message
    });
  }
});

module.exports.general = public_users;