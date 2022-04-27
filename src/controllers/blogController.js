const Blog = require('../model/blogModel');
const Author = require('../model/authorModel');

const createBlog = async (req, res) => {
  try {
    let {...data} = req.body;
    if (Object.keys(data).length == 0) return res.status(400).send({ status: false, msg: "Data is required to create a Blog" });

    if(!data.title) return res.status(400).send({ status: false, msg: "Title of book is required" });
    if(!data.body) return res.status(400).send({ status: false, msg: "Description of book is required" });
    if(!data.authorId) return res.status(400).send({ status: false, msg: "Author ID is required" });
    if(!data.category) return res.status(400).send({ status: false, msg: "Category of book is required" });

    let validString = /\d/;
    
    if(validString.test(data.body) || validString.test(data.tags) || validString.test(data.category) || validString.test(data.subcategory)) return res.status(400).send({ status: false, msg: "Data must not contains numbers"});

    let getAuthorData = await Author.findById(data.authorId);
    if(!getAuthorData) return res.status(404).send({ status: false, msg: "No such author exist" });

    let showBlogData = await Blog.create(data);
    res.status(201).send({ status: true, data: showBlogData });
  } catch (err) {
    res.status(500).send({ status: false, error: err.message });
  }
}

const getBlogs = async (req, res) => {
  try {
    let {...data} = req.query

    if(Object.keys(data).length == 0){
      let getAllBlogs = await Blog.find({ isDeleted: false, isPublished: true }).populate('authorId');

      if(getAllBlogs.length == 0) return res.status(200).send({ status: true, msg: "No such blog exist" });
      return res.status(200).send({ status: true, data: getAllBlogs })
    }

    let getBlogs = await Blog.find( {$and: [ {isDeleted: false, isPublished: true}, {$or: [ {authorId: data.authorId}, {category: {$in: [data.category]}}, {tags: {$in: [data.tags]}}, {subcategory: {$in: [data.subcategory]}} ] } ]} ).populate('authorId');

    if(getBlogs.length == 0) return res.status(200).send({ status: true, msg: "No such blog exist" });
    res.status(200).send({ status: true, data: getBlogs })
  } catch (err) {
    res.status(500).send({ status: false, error: err.message });
  }
}

const updateBlog = async (req, res) => {
  try{
    let getBlogId = req.params.blogId;
    if(!getBlogId) return res.status(400).send({ status: false, msg: "Please enter a Blog Id" });

    let findBlogId = await Blog.findById(getBlogId);
    if(!findBlogId) return res.status(404).send({ status: false, msg: "No such blog exist" });

    let {...data} = req.body;
    if(Object.keys(data).length == 0) return res.status(400).send({ status: false, msg: "Data is required to update a Blog" });



    let blogUpdate;
    if(data.hasOwnProperty('isDeleted')) return res.status(403).send({ status: false, msg: "Action is Forbidden" });
    if(data.hasOwnProperty('title')){
      blogUpdate = await Blog.findOneAndUpdate(
        {_id: getBlogId},
        {title: data.title},
        {new: true}
      )
    }
    if(data.hasOwnProperty('body')){
      blogUpdate = await Blog.findOneAndUpdate(
        {_id: getBlogId},
        {body: data.body},
        {new: true}
      )
    }
    if(data.hasOwnProperty('tags')){
      blogUpdate = await Blog.findOneAndUpdate(
        {_id: getBlogId},
        {$push: {tags: {$each: data.tags}}},
        {new: true}
      )
    }
    if(data.hasOwnProperty('category')){
      blogUpdate = await Blog.findOneAndUpdate(
        {_id: getBlogId},
        {$push: {category: {$each: data.category}}},
        {new: true}
      )
    }
    if(data.hasOwnProperty('subcategory')){
      blogUpdate = await Blog.findOneAndUpdate(
        {_id: getBlogId},
        {$push: {subcategory: {$each: data.subcategory}}},
        {new: true}
      )
    }
    if(data.hasOwnProperty('isPublished')){
      blogUpdate = await Blog.findOneAndUpdate(
        {_id: getBlogId},
        {isPublished: data.isPublished},
        {new: true}
      )
    }
    if(blogUpdate.isPublished == true){
      let timeStamps = new Date();
      let updateData = await Blog.findOneAndUpdate(
        {_id: getBlogId},
        {publishedAt: timeStamps},
        {new: true}
      );
      return res.status(200).send({ status: true, data: updateData });
    } 

    res.status(200).send({ status: true, data: blogUpdate });
  } catch (err) {
    res.status(500).send({ status: false, error: err.message });
  }
}

const deleteBlogById = async (req, res)=> {
  try {
   let blogId = req.params.blogId;
    if(!blogId) return res.status(400).send({status:false,msg:"BlogId is required"})
  
    let data = await Blog.findById(blogId);
    if (!data)  return res.status(404).send({ status: false, msg: "No such blog found" });

    if (data.isDeleted)  return res.status(404).send({ status: false, msg: "Blog already deleted" });

    let timeStamps = new Date();
    await Blog.findOneAndUpdate({_id:blogId},{isDeleted:true, isPublished: false, deletedAt: timeStamps},{new:true})
    res.status(200).send({status:true,msg:"Blog is deleted successfully"})
  } catch (err) {
    res.status(500).send({ status: false, error: err.message });
  }
};

const deleteBlogs = async (req, res) =>{
  try{
    let {...data} = req.query;
    if(Object.keys(data).length == 0) return res.send({ status: false, msg: "Error!, Details are needed to delete a blog" });

    let timeStamps = new Date();
    let deletedBlog = await Blog.updateMany( 
      {$and: [ {isDeleted: false, isPublished: true}, {$or: [ {authorId: data.authorId}, {category: {$in: [data.category]}}, {tags: {$in: [data.tags]}}, {subcategory: {$in: [data.subcategory]}} ] } ]},
      {isDeleted: true, isPublished: false, deletedAt: timeStamps},
      {new: true}, 
    )
    if(deletedBlog.modifiedCount == 0) return res.status(400).send({ status: false, msg: "No such blog exist or might have already been deleted" })

    res.status(200).send({ status: true, msg: "The blog has been deleted successfully" });
  } catch (err) {
    res.status(500).send({ status: false, error: err.message });
  }
}

module.exports.createBlog = createBlog;
module.exports.getBlogs = getBlogs;
module.exports.updateBlog = updateBlog;
module.exports.deleteBlogById = deleteBlogById;
module.exports.deleteBlogs = deleteBlogs;