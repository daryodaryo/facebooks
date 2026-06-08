const bcrypt = require("bcryptjs");
const pool = require("../config/db");

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const result = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );

        let success = false;

        if (result.rows.length > 0) {
            const user = result.rows[0];

            const valid = await bcrypt.compare(
                password,
                user.password
            );

            if (valid) {
                success = true;
            }
        }

        // 🔥 SAVE LOGIN ATTEMPT
        await pool.query(
            "INSERT INTO login_attempts(email, success) VALUES($1, $2)",
            [email, success]
        );

        if (success) {
            return res.redirect("/afterlog.html");
        } else {
            return res.status(401).send("Invalid login");
        }

    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
};

module.exports = { login };
