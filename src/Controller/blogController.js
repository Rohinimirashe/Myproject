const authorModel = require("../models/authorModel");
const blogModel = require("../models/blogModel");


// const createBlog= async function(req,res){
//     let author = req.body
//     let authorCreated = await blogModel.create(author)
//     res.send({data: authorCreated})
// }

const createBlog = async function (req, res) {

  try {
    let data = req.body
    if (Object.keys(data).length != 0) {

      let authorId = req.body.authorId;
      if (!authorId) return res.send({ msg: "authorId is required" })
      let validationAuthorId = await authorModel.findById(authorId);
      if (!validationAuthorId) return res.send({ msg: "enter valid authorId" });

      let blog = req.body;
      let blogCreated = await blogModel.create(blog);
      // console.log(blogCreated);
      res.status(201).send({ data: blogCreated });
    } else {
      return res.status(400).send({ msg: "Bad request" });
    }
  } catch (err) {
    res.status(500).send({ msg: "server error", error: err.message });
  }
};


const GetFilteredBlog = async function (req, res) {
  let data = await blogModel.find({ $and: [{ isDeleted: false }, { isPublished: true }] })
  try {
    if (!data) {
      let authId = req.query.authorId
      let cat = req.query.category
      let subcat = req.query.subcategory
      let tag = req.query.tags
      let allData = await blogModel.find({ $or: [{ authorId: authId }, { category: cat }, { subcategory: subcat }, { tags: tag }] })
      if (allData.length!=0) return res.status(400).send({msg:"enter valid queries"})
      // console.log(allData);

      res.send({ status: true, msg: allData })
    } else {
      return res.status(404).send({ msg: "Not Found" });
    }
  } catch (err) {
    res.status(500).send({ status: false, msg: "Error", err: err.message })
  }
}



// $and
// $in
// $or
// $gte
// $gt



// const createBlog1 = async function (req, res) {
//   let authorId = req.body.authorId;
//   let validationAuthorId = await authorModel.findById(authorId);

//   if (!validationAuthorId) return res.send({ msg: "enter valid authorId" });
//   try {
//     if (req.body) {
//       let blog = req.body;
//       let blogCreated = await blogModel.create(blog);
//       console.log(blogCreated);
//       res.status(201).send({ data: blogCreated });
//     } else {
//       return res.status(400).send({ msg: "invalid request" });
//     }
//   } catch (err) {
//     res.status(500).send({ msg: "server error", error: err.message });
//   }
// };

module.exports.createBlog = createBlog;
module.exports.GetFilteredBlog = GetFilteredBlog;
// module.exports.createBlog1 = createBlog1;