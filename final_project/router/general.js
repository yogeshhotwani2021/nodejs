const express = require('express');
let books = require("./booksdb.js");
let {isValid , authenticatedUser} = require("./auth_users.js");
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  
    const { username, password } = req.body;

    // Check if username and password are provided
    if (!isValid(username,password))
    {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    // Check if the username already exists
    const userExists = authenticatedUser(username);
    if (userExists)
    {
        return res.status(400).json({ error: 'Username already exists' });
    }

    // Register the new user
    users.push({ username, password });
    res.status(201).json({ message: 'User registered successfully' });

})

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.status(300).send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const booksArray = Object.values(books);
  return res.status(300).json({books:booksArray.filter((book)=>{ if(isbn==book.isbn) return book })});
 })
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  const booksArray = Object.values(books);
  return res.status(300).json({books:booksArray.filter((book)=>{ if(author==book.author) return book })});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  const booksArray = Object.values(books);
  return res.status(300).json({books:booksArray.filter((book)=>{ if(title==book.title) return book })});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const booksArray = Object.values(books);
  return res.status(300).json({reviews:booksArray.filter((book)=>{ if(isbn==book.isbn) return book })[0].reviews});
});

module.exports.general = public_users;
