const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const fs = require('fs');
const bcrypt = require('bcrypt');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());

const SECRET_KEY = 'your_secret_key';

// Sample data for users & user type
const users = [
    { username: 'admin', password: bcrypt.hashSync('admin@123', 10), userType: 'admin' },
    { username: 'regular', password: bcrypt.hashSync('regular@123', 10), userType: 'regular' }
];

const adminBooksData = [
    [
        {
            "Book Name": "The Da Vinci Code",
            "Author": "Dan Brown",
            "Publication Year": 2003
        },
        {
            "Book Name": "Think and Grow Rich",
            "Author": "Napoleon Hill",
            "Publication Year": 1937
        },
        {
            "Book Name": "Harry Potter and the Half-Blood Prince",
            "Author": "J.K. Rowling",
            "Publication Year": 2005
        },
        {
            "Book Name": "The Catcher in the Rye",
            "Author": "J.D. Salinger",
            "Publication Year": 1951
        },
        {
            "Book Name": "The Alchemist",
            "Author": "Paulo Coelho",
            "Publication Year": 1988
        }
    ]
];

const regularBooksData = [
    [
        {
            "Book Name": "Don Quixote",
            "Author": "Miguel de Cervantes",
            "Publication Year": 1605
        },
        {
            "Book Name": "A Tale of Two Cities",
            "Author": "Charles Dickens",
            "Publication Year": 1859
        },
        {
            "Book Name": "The Lord of the Rings",
            "Author": "J.R.R. Tolkien",
            "Publication Year": 1954
        },
        {
            "Book Name": "The Little Prince",
            "Author": "Antoine de Saint-Exupery",
            "Publication Year": 1943
        },
        {
            "Book Name": "Harry Potter and the Sorcerer’s Stone",
            "Author": "J.K. Rowling",
            "Publication Year": 1997
        },
        {
            "Book Name": "And Then There Were None",
            "Author": "Agatha Christie",
            "Publication Year": 1939
        },
        {
            "Book Name": "The Dream of the Red Chamber",
            "Author": "Cao Xueqin",
            "Publication Year": 1791
        },
        {
            "Book Name": "The Hobbit",
            "Author": "J.R.R. Tolkien",
            "Publication Year": 1937
        },
        {
            "Book Name": "She: A History of Adventure",
            "Author": "H. Rider Haggard",
            "Publication Year": 1887
        },
        {
            "Book Name": "The Lion, the Witch and the Wardrobe",
            "Author": "C.S. Lewis",
            "Publication Year": 1950
        }
    ]
];

// LOGIN
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username);

    if (!user || !bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({ message: 'Invalid username or password' });
    }

    const token = jwt.sign({ username, userType: user.userType }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ token });
});

// JWT
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

// HOME
app.get('/home', authenticateToken, (req, res) => {
    const { userType } = req.user;

    let books = [];
    if (userType === 'regular') {
        books = regularBooksData;
    } else if (userType === 'admin') {
        books = regularBooksData.concat(adminBooksData);
    }

    res.json({ books });
});

// MAIN
app.get('/', (req, res) => {
    res.send('Welcome to the Library Management System! 📖');
});

// PORT
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
