const { Router } = require("express");
const User = require("../models/user");
const { validateToken } = require("../services/authentication"); // Import validateToken properly
const router = Router();

router.get("/signin", (req, res) => {
    return res.render("signin");
});

router.get("/signup", (req, res) => {
    return res.render("signup");
});

router.post("/signin", async (req, res) => {
    const { email, password } = req.body;
    try {
        const token = await User.matchPasswordAndGenerateToken(email, password);
        return res.cookie('token', token).redirect("/");
    } catch (error) {
        return res.render('signin', {
            error: "Incorrect email or password",
        });
    }
});

router.get('/logout', (req, res) => {
    res.clearCookie('token').redirect('/');
});

router.post("/signup", async (req, res) => {
    const { fullName, email, password } = req.body;
    await User.create({
        fullName, email, password,
    });
    return res.redirect("signin");
});

router.get('/contactadmin', async (req, res) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.redirect('/user/signin',{
                error:"Non authorized user"
            }); // Redirect to login if no token found
        }
        const payload = validateToken(token);
        if (payload) {
            // User is authorized, render the admin contact page
            return res.render("admincontact", {
                user: req.user,
            });
        } else {
            // Token is invalid, redirect to login
            return res.redirect('/user/signin');
        }
    } catch (error) {
        console.error('Error in contactadmin route:', error);
        res.status(500).send('Internal server error');
    }
});

module.exports = router;
