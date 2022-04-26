const Blog = require('../model/blogModel');

const createBlog = async (req, res) => {
  try {
    let getData = req.body;
    if (Object.keys(getData).length == 0) return res.status(400).send({ status: false, msg: "Data is required to create a Blog" });

    let showBlogData = await Blog.create(getData);
    res.status(201).send({ status: true, data: showBlogData });
  } catch (err) {
    res.status(500).send({ status: false, msg: err.message });
  }
}

module.exports.createBlog = createBlog;