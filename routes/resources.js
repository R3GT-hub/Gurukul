const express = require('express');
// const path = require('path');
const app = express();

const { Router } = require("express");
const multer = require('multer');
const Resource = require("../models/resources");
const router = Router();
const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));
const resourceupload = multer({ dest: path.resolve('./public/resourcesuploads') });

router.get("/", async(req, res) => {
    try {
        const resources = await Resource.find().populate("createdBy");
        console.log(resources);
        res.render('resources', {
            user: req.user,
            resource: resources,
        });
    } catch (error) {
        console.error('Error fetching resources:', error);
        return res.status(500).send('Error fetching resources: ' + error.message);
    }
});

router.get("/add-new-resource", (req, res) => {
    res.render('addresources', {
        user: req.user,
    });
});

router.get("/:id", async (req, res) => {
    try {
        const resource = await Resource.findById(req.params.id).populate("createdBy");
        if (!resource) {
            return res.status(404).send('Resource not found');
        }
        return res.render("resourceid", {
            user: req.user,
            resource: resource,
        });
    } catch (error) {
        console.error('Error fetching resource:', error);
        res.status(500).send('Internal server error');
    }
});

router.post("/add-new-resource", resourceupload.fields([{ name: 'coverImage', maxCount: 1 }, { name: 'pdf', maxCount: 1 }]), async (req, res) => {
    try {
        const { title,tag, body, resourceLink,sheetlink} = req.body;

        // Check if cover image file was uploaded
        if (!req.files || !req.files['coverImage']) {
            return res.status(400).send('Cover image is required.');
        }

        const coverImageFile = req.files['coverImage'][0];
        let pdfFileUrl = null;

        // Check if PDF file was uploaded
        if (req.files && req.files['pdf']) {
            const pdfFile = req.files['pdf'][0];
            pdfFileUrl = `resourcesuploads/${pdfFile.filename}`;
        }

        const resource = await Resource.create({
            body,
            title,
            tag,
            sheetlink,
            resourceLink,
            createdBy: req.user._id,
            coverImageURL: `resourcesuploads/${coverImageFile.filename}`,
            pdf: pdfFileUrl
        });

        console.log('Resource post created:', resource);
        return res.redirect(`/resource/${resource._id}`);
    } catch (error) {
        console.error('Error creating resource post:', error);
        return res.status(500).send('Error creating resource post: ' + error.message);
    }
});



module.exports = router;
