const express = require('express');
const bcrypt = require('bcryptjs');
const path = require('path');  // Add this line to import the 'path' module
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors()); // Enable CORS for frontend communication
app.use(express.json());

// MongoDB setup - replace with your actual database URI
mongoose.connect('mongodb+srv://haldennafis:Arman@email-to-smsdb.ccr9k86.mongodb.net/', { useNewUrlParser: true, useUnifiedTopology: true });

// User model
const User = mongoose.model('User', new mongoose.Schema({ username: String, password: String }));

//TO THE HTML INDEX.HTML
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Register route
app.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, password: hashedPassword });
        await user.save();
        res.status(201).send("User created successfully");
    } catch (error) {
        res.status(500).send("Error creating user");
    }
});

// Login route
app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (user && await bcrypt.compare(password, user.password)) {
            const token = jwt.sign({ userId: user._id }, 'YOUR_SECRET_KEY', { expiresIn: '1h' }); // Replace 'YOUR_SECRET_KEY' with your secret key
            res.status(200).json({ token });
        } else {
            res.status(400).send("Invalid credentials");
        }
    } catch (error) {
        res.status(500).send("Error logging in");
    }
});



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
