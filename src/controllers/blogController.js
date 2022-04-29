const authorModel = require('../models/authorModel')
const blogModel = require('../models/blogModel')

//========================CREATE BLOGS===================================

const createBlog = async (req, res) => {
  try {
    let getData = req.body;
    if (Object.keys(getData).length == 0) return res.status(400).send({ status: false, msg: "Data is required to create a Blog" });

    let getAuthorData = await authorModel.findById(getData.authorid);
    console.log(getAuthorData)
    if (!getAuthorData) return res.status(404).send({ status: false, msg: "No such author exist" });

    let showBlogData = await blogModel.create(getData);
    res.status(201).send({ status: true, data: showBlogData });
  } catch (err) {
    res.status(500).send({ status: false, error: err.message });
  }
}
//===================================GET DETAILS===================================
const getBlogs = async (req, res) => {
  try {
    let data = req.query

    if (Object.keys(data).length == 0) {
      let getAllBlogs = await blogModel.find({ isDeleted: false, isPublished: true });
      if (!getAllBlogs) return res.status(400).send({ status: false, msg: "No such blog exist" });
      // if (getAllBlogs.length == 0) return res.status(400).send({ status: false, msg: "No such blog exist" });
      return res.status(200).send({ status: true, data: getAllBlogs })
    }

    let getBlogs = await blogModel.find({ $and: [{ $and: [{ isDeleted: false }, { isPublished: true }] }, { $or: [{ authorid: data.authorid }, { category: { $in: [data.category] } }, { tags: { $in: [data.tags] } }, { subcategory: { $in: [data.subcategory] } }] }] });

    if (getBlogs.length == 0) return res.status(200).send({ status: true, msg: "No such blog exist" });
    res.status(200).send({ status: true, data: getBlogs })
  } catch (err) {
    res.status(500).send({ status: false, error: err.message });
  }
}

//===================================UPDATE======================================

const putPublished = async function (req, res) {
  try {
    let blogid = req.params.blogId;
    let body = req.body
    if (!blogid) {
      return res.status(400).send({ status: "false", data: "blogid not present" })
    }
    let person = await blogModel.findById(blogid);
    console.log(person)
    if (!person) {
      return res.status(404).send({ status: "false", data: "the blogid is not valid" })

    }
    let isDelet = person.isDeleted;
    if (isDelet == true) {
        return res.status(400).send({ msg: false, data: "blog document is already deleted" })
    }
    let published = person.isPublished
    if (published == true && Object.keys(body) != 0) {

      let result = await blogModel.findOneAndUpdate({ _id: person._id }, body, { new: true })
      res.status(200).send({ data: result })
    }
    else if (published == true && Object.keys(body) == 0) {
      res.status(400).send({ msg: "already published" })
    } else if (published == false && Object.keys(body) == 0) {
      let result = await blogModel.findOneAndUpdate({ _id: person._id }, { isPublished: true, publishedAt: Date.now() }, { new: true })
      res.send({ data: result })
    } else {
      let result = await blogModel.findOneAndUpdate({ _id: person._id }, body, { new: true })
      res.status(200).send({ data: result })

    }

  }
  catch (err) {
    console.log(err.message)
    res.status(500).send({ msg: "error", error: err.message })
  }
}


//====================================DELETE BY ID==============================

const deleteBlogById = async (req, res) => {
  try {
    let blogId = req.params.blogId;
    if (!blogId) return res.status(400).send({ status: false, msg: "BlogId is required" })

    let data = await blogModel.findById(blogId);
    if (!data) return res.status(404).send({ status: false, msg: "No such blog found" });

    if (data.isDeleted) return res.status(404).send({ status: false, msg: " Already deleted blog Or Blog not exists" });

    let timeStamps = new Date();
    await blogModel.findOneAndUpdate({ _id: blogId }, { $set: { isDeleted: true, deletedAt: timeStamps } }, { new: true })
    res.status(200).send({ status: true, msg: "Blog is deleted successfully" })
  } catch (err) {
    res.status(500).send({ status: false, error: err.message });
  }
};

//=====================================DELETE BY QUERY PARAM=========================
const deleteBlogsByQuery = async (req, res) => {
  try {
    let data = req.query;
    if (Object.keys(data).length == 0) return res.status(400).send({ status: false, msg: "Error!, Details are needed to delete a blog" });

    let timeStamps = new Date();

    let deletedBlog = await blogModel.updateMany(
      { $and: [{ $and: [{ isDeleted: false }, { isPublished: true }] }, { $or: [{ authorid: data.authorid }, { category: { $in: [data.category] } }, { tags: { $in: [data.tags] } }, { subcategory: { $in: [data.subcategory] } }] }] },
      { $set: { isDeleted: true, deletedAt: timeStamps } },
      { new: true },
    )

    if (deletedBlog.modifiedCount == 0) return res.status(404).send({ status: false, msg: "No such blog exist or might have already been deleted" })

    res.status(200).send({ status: true, msg: "The blog has been deleted successfully" });
  } catch (err) {
    res.status(500).send({ status: false, error: err.message });
  }
}
module.exports.getBlogs = getBlogs
module.exports.deleteBlogsByQuery = deleteBlogsByQuery
module.exports.deleteBlogById = deleteBlogById
module.exports.putPublished = putPublished
module.exports.createBlog = createBlog