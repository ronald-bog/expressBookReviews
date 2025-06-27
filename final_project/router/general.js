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

// Get all books - Tarea 1
public_users.get('/', function (req, res) {
    return res.status(200).json(books);
});

// Get book by ISBN - Tarea 2
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];
    
    if (!book) {
        return res.status(404).json({ message: "Book not found" });
    }
    
    return res.status(200).json(book);
});

// Get books by author - Tarea 3
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

// Get books by title - Tarea 4
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

// Get book reviews - Tarea 5
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];
    
    if (!book) {
        return res.status(404).json({ message: "Book not found" });
    }
    
    return res.status(200).json(book.reviews);
});

// Implementación con Promesas/Axios - Tareas 10-13
public_users.get('/promise/books', function (req, res) {
    new Promise((resolve) => {
        resolve(books);
    })
    .then((books) => res.status(200).json(books))
    .catch(() => res.status(500).json({ message: "Error fetching books" }));
});

public_users.get('/promise/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    
    new Promise((resolve, reject) => {
        const book = books[isbn];
        book ? resolve(book) : reject("Book not found");
    })
    .then((book) => res.status(200).json(book))
    .catch(() => res.status(404).json({ message: "Book not found" }));
});

public_users.get('/promise/author/:author', function (req, res) {
    const author = req.params.author;
    
    new Promise((resolve) => {
        const matchingBooks = Object.values(books).filter(
            book => book.author.toLowerCase() === author.toLowerCase()
        );
        resolve(matchingBooks);
    })
    .then((books) => {
        if (books.length === 0) {
            return res.status(404).json({ message: "No books found" });
        }
        res.status(200).json(books);
    })
    .catch(() => res.status(500).json({ message: "Error fetching books" }));
});

public_users.get('/promise/title/:title', function (req, res) {
    const title = req.params.title;
    
    new Promise((resolve) => {
        const matchingBooks = Object.values(books).filter(
            book => book.title.toLowerCase().includes(title.toLowerCase())
        );
        resolve(matchingBooks);
    })
    .then((books) => {
        if (books.length === 0) {
            return res.status(404).json({ message: "No books found" });
        }
        res.status(200).json(books);
    })
    .catch(() => res.status(500).json({ message: "Error fetching books" }));
});

module.exports.general = public_users;