const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

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

    let secretKey = "test";
    
    // Generate JWT
    const token = jwt.sign({ username }, secretKey, { expiresIn: '1h' });
    res.status(200).json({ message: 'Login successful', token });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.authenticatedUser = authenticatedUser;
module.exports.users = users;
