const express=require("express");
const path=require("path");
const  cookieParser=require('cookie-parser');
const mongoose=require("mongoose");
const userRoute=require('./routes/user');
const blogRoute=require('./routes/blog');
const resourceRoute=require('./routes/resources');

const { checkForAuthenticationCookie } = require("./middleware/authentication");
const app=express();
const PORT=8000;
app.set("view engine","ejs");
app.set("views",path.resolve("./views"));

app.use(express.urlencoded({extended:false}));
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));
app.use(express.static(path.resolve('./public')));
const Blog=require("./models/blog");
mongoose.connect('mongodb://localhost:27017/blogger').then((e)=>console.log("Mongodb connected"));

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
app.use('/user',userRoute);
app.use('/blog',blogRoute);
app.use('/resource',resourceRoute);

app.listen(PORT,()=>console.log('server started at port 8000'));