const express = require("express");
const router = express.Router();
const User = require("../models/user.js")//grabbing User model
const bcrypt = require("bcrypt");//installed bcrypt

//ALL requests coming to this file start with '/auth'

//GET '/auth/sign-up' adding to the ROUTER object
router.get('/sign-up', (req, res) => {
    res.render("auth/sign-up.ejs");
})

//POST '/auth/sign-up' stores username and password
router.post('/sign-up', async (req, res) => {
    const userInDatabase = await User.findOne({ username: req.body.username });
    if (userInDatabase) {//making sure usernames are unique!
    res.send('Username is already taken.');
    }

    if (req.body.password !== req.body.confirmPassword){
        return res.send ('Password and Confirm Password must match!')
    }//making sure passwords match!

    const hashedPassword = bcrypt.hashSync(req.body.password, 10)
    req.body.password = hashedPassword;//10 = amount of salting

    const user = await User.create(req.body)
    res.send (`Thanks for signing up ${user.username}!`);
})

//Get 'auth/sign-in' - redirect to sign in page
router.get('/sign-in', (req, res) => {
    res.render('auth/sign-in.ejs')
})

//POST 'auth/sign-in'
router.post('/sign-in', async (req, res) => {
    const userInDatabase = await User.findOne({ username: req.body.username });
    if (!userInDatabase) {//making sure usernames are unique!
    res.send('Login failed. Please try again.');
    }
    const validPassword = bcrypt.compareSync(
        req.body.password,
        userInDatabase.password
    );
    if (!validPassword) {
        return res.send('Login failed. Please try again.')
    }

    req.session.user = {
        username: userInDatabase.username,
    };

    res.redirect("/");
})

//GET sign out
router.get("/sign-out", (req, res) => {
    req.session.destroy();
    res.redirect("/");
});


module.exports = router;