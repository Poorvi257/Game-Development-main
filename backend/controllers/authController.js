const pool = require('../config/database'); // Assuming db.js is in the root folder
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const authController = {
    async register(req, res) {
        try {
            const { username, password } = req.body;
            if (!username || !password) {
                return res.status(400).send({ message: "username and password are required" });
            }

            if (password.length < 8) {
                return res.status(400).send({ message: "Password is too short" });
            }

            const [existingUsers] = await pool.query('SELECT id FROM users WHERE username = ?', [username]);
            if (existingUsers.length > 0) {
                return res.status(400).send({ message: "User already exists" });
            }
            
            const hashedPassword = await bcrypt.hash(password, 10);
            let games_played = 0;
            await pool.query('INSERT INTO users (username, password, games_played) VALUES (?, ?, ?)', [username, hashedPassword, games_played]);

            const [newUser] = await pool.query('SELECT id, username FROM users WHERE username = ?', [username]);
            const token = jwt.sign({ id: newUser[0].id }, process.env.JWT_SECRET, { expiresIn: "1h" });

            res.status(201).send({ user: newUser[0], token });
        } catch (error) {
            console.error("Registration Error:", error);
            res.status(500).send({ message: "Internal Server Error" });
        }
    },

    async login(req, res) {
        try {
            console.log(req.body);
            const { username, password } = req.body;
            const [users] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
            if (users.length === 0) {
                return res.status(401).send({ message: "Authentication failed" });
            }

            const user = users[0];
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(401).send({ message: "Authentication failed" });
            }

            const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
            res.status(200).send({ user, token });
        } catch (error) {
            console.error("Login Error:", error);
            res.status(500).send({ message: "Internal Server Error" });
        }
    },
};

module.exports = authController;
