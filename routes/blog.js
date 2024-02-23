const { Router } = require("express");
const multer = require('multer');
const  Blog=require("../models/blog");
const router = Router();
const path = require('path');

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, path.resolve(`./public/uploads`))
//     },
//     filename: function (req, file, cb) {
//         const filename = `${Date.now()}-${file.originalname}`;
//         cb(null, filename);
//     },
// });
const upload = multer({ dest: path.resolve(`./public/uploads`) })

// const upload = multer({ storage: storage });

router.get("/add-new", (req, res) => {
    res.render('addblog', {
        user: req.user,
    });
});

router.get("/:id",async(req,res)=>{
    const blog=await Blog.findById(req.params.id).populate("createdBy");
    return res.render("blog",{
        user:req.user,
        blog:blog,
    })
})
router.post("/", upload.single("coverImage"), async (req, res) => {
    try {
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

        console.log('Blog post created:', blog);
        return res.redirect(`/blog/${blog._id}`);
    } catch (error) {
        console.error('Error creating blog post:', error);
        return res.status(500).send('Internal server error');
    }
    
});

module.exports = router;
