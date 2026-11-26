const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

const BASE_URL = "http://localhost:5001";

public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) {
      users.push({"username": username, "password": password});
      return res.status(200).json({message: "Customer successfully registered. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});
    }
  }
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  res.send(books[isbn]);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  let filtered_books = [];
  for (let key in books) {
    if (books[key].author === author) {
      filtered_books.push(books[key]);
    }
  }
  res.send(filtered_books);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  let filtered_books = [];
  for (let key in books) {
    if (books[key].title === title) {
      filtered_books.push(books[key]);
    }
  }
  res.send(filtered_books);
});

// Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  res.send(books[isbn].reviews);
});

// Task 10: Get all books using async/await with Axios
async function getAllBooks() {
  try {
    const response = await axios.get(`${BASE_URL}/`);
    console.log("All books retrieved using async/await:");
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error retrieving books:", error.message);
  }
}

// Task 11: Get book by ISBN using Promises with Axios
function getBookByISBN(isbn) {
  axios.get(`${BASE_URL}/isbn/${isbn}`)
    .then(response => {
      console.log(`Book with ISBN ${isbn} retrieved using Promise:`);
      console.log(response.data);
    })
    .catch(error => {
      console.error("Error retrieving book by ISBN:", error.message);
    });
}

// Task 12: Get books by author using async/await with Axios
async function getBooksByAuthor(author) {
  try {
    const response = await axios.get(`${BASE_URL}/author/${encodeURIComponent(author)}`);
    console.log(`Books by author "${author}" retrieved using async/await:`);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error retrieving books by author:", error.message);
  }
}

// Task 13: Get books by title using Promises with Axios
function getBooksByTitle(title) {
  axios.get(`${BASE_URL}/title/${encodeURIComponent(title)}`)
    .then(response => {
      console.log(`Books with title "${title}" retrieved using Promise:`);
      console.log(response.data);
    })
    .catch(error => {
      console.error("Error retrieving books by title:", error.message);
    });
}

module.exports.general = public_users;
module.exports.getAllBooks = getAllBooks;
module.exports.getBookByISBN = getBookByISBN;
module.exports.getBooksByAuthor = getBooksByAuthor;
module.exports.getBooksByTitle = getBooksByTitle;
