const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  return !!users.find((user) => user.username === username);
};

const authenticatedUser = (username, password) => {
  return !!users.find(
    (user) => user.username === username && user.password === password
  );
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password)
    return res.status(404).json({ message: "Error logging in" });

  if (authenticatedUser(username, password)) {
    const accessToken = jwt.sign(
      {
        data: password,
      },
      "access",
      { expiresIn: 60 * 60 }
    );

    req.session.authorization = {
      accessToken,
      username,
    };
    return res.status(200).send("Customer successfully logged in");
  } else {
    return res
      .status(208)
      .json({ message: "Invalid Login. Check username and password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  if (req.session.authorization) {
    const isbn = req.params.isbn;

    if (books?.[isbn]) {
      const { review } = req.query;
      const reviews = books[isbn].reviews;
      const id = Object.keys(reviews).length + 1;

      books[isbn] = {
        ...books[isbn],
        reviews: {
          ...reviews,
          [`${id}`]: { review, username: req.session.authorization.username },
        },
      };

      return res
        .status(200)
        .send(`Review for the ISBN: ${isbn} has been added/updated `);
    }
    return res.status(404).json({ message: "Not exit a book." });
  }
  return res.status(404).json({ message: "Error logging in" });
});

// delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  if (req.session.authorization) {
    const isbn = req.params.isbn;
    const username = req.session.authorization.username;

    if (books?.[isbn]) {
      const reviews = Object.entries(books[isbn].reviews).reduce(
        (acc, [key, review]) => {
          if (review.username !== username)
            return { ...acc, [`${key}`]: review };

          return acc;
        },
        {}
      );

      books[isbn] = {
        ...books[isbn],
        reviews,
      };

      return res
        .status(200)
        .send(
          `Review for the ISBN: ${isbn} posted by the user ${username} deleted`
        );
    }

    return res.status(404).json({ message: "Not exit a book." });
  }
  return res.status(404).json({ message: "Error logging in" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
