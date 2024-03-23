require("dotenv").config();
const express=require("express");
const path=require("path");
const  cookieParser=require('cookie-parser');
const mongoose=require("mongoose");
const userRoute=require('./routes/user');
const blogRoute=require('./routes/blog');
const resourceRoute=require('./routes/resources');

const { checkForAuthenticationCookie } = require("./middleware/authentication");
const app=express();
const PORT=process.env.PORT || 3000;
app.set("view engine","ejs");
app.set("views",path.resolve("./views"));

app.use(express.urlencoded({extended:false}));
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));
app.use(express.static(path.resolve('./public')));
const Blog=require("./models/blog");
mongoose.connect(process.env.MONGO_URL).then((e)=>console.log("Mongodb connected"));

app.get('/', async (req, res) => {
    try {
        const allBlogs = await Blog.find({});
        // console.log(req.user);
        res.render("home", {
            user: req.user,
            blogs: allBlogs
        });
    } catch (error) {
        // console.error("Error:", error);
        res.status(500).send("Internal Server Error");
    }
});
app.get('/blog', async (req, res) => {
    try {
        const allBlogs = await Blog.find({});
        // console.log(req.user);
        res.status(200).send("added blog");
    } catch (error) {
        // console.error("Error:", error);
        res.status(500).send("Internal Server Error from /blog");
    }
});
app.use('/user',userRoute);
app.use('/blog',blogRoute);
app.use('/resource',resourceRoute);

app.listen(PORT,()=>console.log('server started at port 3000'));

module.exports = app;