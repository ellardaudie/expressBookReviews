const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
	if (!req.body.username || !req.body.password) {
		return res.status(401).json({
			message: "Invalid username or password",
		});
	}
	if (isValid(req.body.username)) {
		return res.status(200).json({
			message:
				"User with this username is registered. please choose another username or login.",
		});
	}
	const newUser = {
		username: req.body.username.toLowerCase(),
		password: req.body.password,
	};
	users.push(newUser);
	return res.status(200).json({
		message: "User registration successful.",
	});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  console.log(`There are ${Object.keys(books).length} books`); 
});

// Get book details based on ISBN
const axios = require('axios');

public_users.get('/isbn/:isbn', async function (req, res) {
    const { isbn } = req.params;

    try {
        // Fetch book details from Open Library API
        const response = await axios.get(`https://openlibrary.org/isbn/${isbn}.json`);

        // Send the book details as the response
        res.status(200).json({
            message: 'Book details retrieved successfully.',
            book: response.data,
        });
    } catch (error) {
        // Handle errors (e.g., book not found or API issues)
        if (error.response && error.response.status === 404) {
            return res.status(404).json({ error: 'Book not found for the given ISBN.' });
        }
        return res.status(500).json({ error: 'An error occurred while fetching the book details.' });
    }
});
  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;

    // Filter books by author
    let results = [];

    // Loop through all books to find those that match the given author
    for (let key in books) {
        if (books[key].author.toLowerCase() === author.toLowerCase()) {
            results.push({ id: key, ...books[key] });
        }
    }

    // Check if any books were found
    if (results.length > 0) {
        // If found, send the books as a response
        res.status(200).json({
            message: `Books by ${author} found.`,
            books: results
        });
    } else {
        // If no books were found, send a not found message
        res.status(404).json({
            message: `No books found for author: ${author}.`
        });
    }
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;

    // Filter books by title
    let results = [];

    // Loop through all books to find those that match the given title
    for (let key in books) {
        if (books[key].title.toLowerCase() === title.toLowerCase()) {
            results.push({ id: key, ...books[key] });
        }
    }

    // Check if any books were found
    if (results.length > 0) {
        // If found, send the books as a response
        res.status(200).json({
            message: `Books with title "${title}" found.`,
            books: results
        });
    } else {
        // If no books were found, send a not found message
        res.status(404).json({
            message: `No books found with title: "${title}".`
        });
    }
});

//  Get book review
public_users.get('/reviews/:isbn', async (req, res) => {
    const isbn = req.params.isbn;
    try {
        const response = await axios.get(`https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&format=json&jscmd=data`);
        const bookData = response.data[`ISBN:${isbn}`];

        if (bookData && bookData.average_rating) {
            res.json({ average_rating: bookData.average_rating });
        } else {
            res.status(404).json({ message: 'Rating not available for this book' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error fetching book data', error: error.message });
    }
});

module.exports.general = public_users;
