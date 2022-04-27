const express = require('express');
const Author = require('../controllers/authorController');
const Blog = require('../controllers/blogController');

const router = express.Router();

router.post('/authors', Author.addAuthor);
router.post('/blog', Blog.createBlog);
router.get('/blogs', Blog.getBlogs);
router.put('/blog/:blogId', Blog.updateBlog);
router.delete('/blog/:blogId', Blog.deleteBlogById);
router.delete('/blogs', Blog.deleteBlogs);

module.exports = router;