const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();
let users = [];
let secretKey = "test";
const isValid = (username,password)=>{ //returns boolean
//write code to check is the username is valid
  return !(!username || !password)
}

const authenticatedUser = (username,password)=>{ //returns boolean
  //write code to check if username and password match the one we have in records.
  return users.find(user => user.username === username);
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const { username, password } = req.body;
    // Check if username and password are provided
    if (!isValid(username,password))
    {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    // Check if the username already exists
    const userExists = authenticatedUser(username);
    if (!userExists)
    {
        return res.status(400).json({ error: 'Username not already exists' });
    }

    // Generate JWT
    const token = jwt.sign({ username }, secretKey, { expiresIn: '1h' });
    req.session.token = token;
    res.status(200).json({ message: 'Login successful', token });
});

// Add a book review
regd_users.put("/auth/review/:isbn", async (req, res) => {
  let isbn = req.params.isbn;

  let review = req.query.review;

  let token = req.session.token;

  let username = await jwt.verify(token , secretKey);

  const booksKeys = Object.keys(books);

  booksKeys.forEach((bookKey) => {
    let book = books[bookKey];
    if(isbn==book.isbn)
    {
      book["reviews"][username["username"]] = review;
    }
  })
  return res.status(201).json({books:books});
});

// Add a book review
regd_users.delete("/auth/review/:isbn", async (req, res) => {
  let isbn = req.params.isbn;

  let review = req.query.review;

  let token = req.session.token;

  let username = await jwt.verify(token , secretKey);

  const booksKeys = Object.keys(books);

  booksKeys.forEach((bookKey) => {
    let book = books[bookKey];
    if(isbn==book.isbn)
    {
      delete book["reviews"][username["username"]];
    }
  })
  return res.status(200).json({books:books});
});
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.authenticatedUser = authenticatedUser;
module.exports.users = users;
