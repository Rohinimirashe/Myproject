const express = require('express');
const Author = require('../controllers/authorController');
const Blog = require('../controllers/blogController');

const router = express.Router();

router.post('/authors', Author.addAuthor);
router.post('/blog', Blog.createBlog);

module.exports = router;