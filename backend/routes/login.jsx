import express from "express";
import bodyParser from "body-parser";
import pg, {Pool} from "pg";
import db from "../config";

const PORT = 3000;
const app = express();
app.use(bodyParser.json());


app.post('/', async (req, res) => {
    const { username, password } = req.body;

    try {
        const result = await db.query('SELECT * FROM Users WHERE username = $1', [username]);
        if (result.rows.length > 0) {
            const user = result.rows[0];
            const isMatch = await bcrypt.compare(password, user.password);
            if (isMatch) {
                res.json({ success: true });
            } else {
                res.json({ success: false });
            }
        } else {
            res.json({ success: false });
        }
    } catch (error) {
        console.error('Error during authentication', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});

app.get("/home", (req, res) => {
    res.render("HOME");
});

app.listen(PORT, () => {
    console.log(`Server has started on port ${PORT}`);
});