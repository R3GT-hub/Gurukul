const { Router } = require("express");
const multer = require('multer');
const Blog = require("../models/blog");
const { checkForAuthenticationCookie } = require('../middleware/authentication');
const router = Router();
const path = require('path');

const upload = multer({ dest: path.resolve(`./public/uploads`) })

router.use(checkForAuthenticationCookie('token'));

router.get("/add-new", (req, res) => {
    // Check if user is authenticated
    if (!req.user) {
        return res.status(401).send('Non authorized user').redirect('/user/signin');
    }
    if(req.user.fullName==="Saransh Sharma"){
    res.render('addblog', {
        user: req.user,
    });
}
else{
    return res.status(401).send('Non authorized user').redirect('/user/signin');

}
});

router.get("/:id", async (req, res) => {
    try {
        // Check if user is authenticated
        if (!req.user) {
            return res.status(401).send('Non authorized user').redirect('/user/signin');

        }

        const blog = await Blog.findById(req.params.id).populate("createdBy");
        return res.render("blog", {
            user: req.user,
            blog: blog,
        });
    } catch (error) {
        // console.error('Error fetching blog:', error);
        res.status(500).send('Internal server error').redirect('user/signin');
    }
});

router.post("/", upload.single("coverImage"), async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).send('Unauthorized'); // Ensure user is authenticated
        }
        if (!req.file) {
            return res.status(400).send('No files were uploaded.');
        }
        
        const { title, body, jobLink} = req.body;
        const blog = await Blog.create({
            body,
            title,
            jobLink,
            
            createdBy: req.user._id,
            coverImageURL: `uploads/${req.file.filename}`
        });

        // console.log('Blog post created:', blog);
        // return res.redirect(`/`);
        return res.status(200);
    } catch (error) {
        // console.error('Error creating blog post:', error);
        return res.status(500).send('Internal server error');
    }
});

module.exports = router;
