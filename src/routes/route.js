const express = require('express');
const {addAuthor} = require('../controllers/authorController');
const {createBlog, getBlogs, updateBlog, deleteBlogById, deleteBlogs} = require('../controllers/blogController');

const router = express.Router();

router.post('/authors', addAuthor);
router.post('/blog', createBlog);
router.get('/blogs', getBlogs);
router.put('/blog/:blogId', updateBlog);
router.delete('/blog/:blogId', deleteBlogById);
router.delete('/blogs', deleteBlogs);

module.exports = router;