const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const axios = require("axios");
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (username && password) {
    if (!isValid(username)) {
      users.push({ username: username, password: password });

      return res
        .status(200)
        .json({ message: "User successfully registred. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }

  return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  return res.status(200).json({ books });
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  const isbn = req.params.isbn;

  if (books?.[isbn]) return res.status(200).json(books[isbn]);

  return res.status(404).json({ message: "Not exit a book." });
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  const author = req.params.author;

  const booksByAuthor = Object.entries(books).reduce((acc, [isbn, element]) => {
    if (element.author === author)
      return [...acc, { isbn, title: element.title, reviews: element.reviews }];

    return acc;
  }, []);

  return res.status(200).json({ booksbyauthor: booksByAuthor });
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  const title = req.params.title;

  const booksByTitle = Object.entries(books).reduce((acc, [isbn, element]) => {
    if (element.title === title)
      return [
        ...acc,
        { isbn, author: element.author, reviews: element.reviews },
      ];

    return acc;
  }, []);

  return res.status(200).json({ booksbytitle: booksByTitle });
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const isbn = req.params.isbn;

  if (books?.[isbn]) return res.status(200).json(books[isbn].reviews);

  return res.status(404).json({ message: "Not exit a book." });
});

async function getAllBooks() {
  try {
    const books = await axios({
      url: "http://localhost:5000",
    });

    return books;
  } catch (error) {
    console.error(error);
  }
}

async function getBooksByISBN(isbn) {
  try {
    const book = await axios({
      url: `http://localhost:5000/isbn/${isbn}`,
    });

    return book;
  } catch (error) {
    console.error(error);
  }
}

async function getBooksByAuthor(author) {
  try {
    const books = await axios({
      url: `http://localhost:5000/author/${author}`,
    });

    return books;
  } catch (error) {
    console.error(error);
  }
}

async function getBooksByTitle(title) {
  try {
    const items = await axios({
      url: `http://localhost:5000/title/${title}`,
    });

    return items;
  } catch (error) {
    console.error(error);
  }
}

module.exports.general = public_users;
module.exports.getAllBooks = getAllBooks;
module.exports.getBooksByISBN = getBooksByISBN;
module.exports.getBooksByAuthor = getBooksByAuthor;
module.exports.getBooksByTitle = getBooksByTitle;
