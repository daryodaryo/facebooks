const bcrypt = require("bcryptjs");
const pool = require("../config/db");

const register = async (req, res) => {
    try {
        const { email, password } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        await pool.query(
            "INSERT INTO users(email, password) VALUES($1, $2)",
            [email, hashedPassword]
        );

        res.json({
            success: true,
            message: "User registered successfully"
        });

    } catch (err) {
        console.error(err);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const result = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );

        if (result.rows.length === 0) {
            return res.status(401).send("Invalid email or password");
        }

        const user = result.rows[0];

        const validPassword = await bcrypt.compare(
            password,
            user.password
        );

        if (!validPassword) {
            return res.status(401).send("Invalid email or password");
        }

        res.redirect("/afterlog.html");

    } catch (err) {
        console.error(err);

        res.status(500).send("Server error");
    }
};

module.exports = {
    register,
    login
};