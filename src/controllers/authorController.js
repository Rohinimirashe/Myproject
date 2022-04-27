const Author = require('../model/authorModel');
const validateEmail = require('email-validator');

const addAuthor = async (req, res) => {
  try {
    let {...data} = req.body;
    if (Object.keys(data).length == 0) return res.status(400).send({ status: false, msg: "Data is required to add a Author" });

    if(!data.firstName) return res.status(400).send({ status: false, msg: "First is required" });
    if(!data.lastName) return res.status(400).send({ status: false, msg: "Last is required" });
    if(!data.title) return res.status(400).send({ status: false, msg: "Title is required" });
    if(!data.email) return res.status(400).send({ status: false, msg: "Email is required" });
    if(!data.password) return res.status(400).send({ status: false, msg: "Password is required" });
    
    let validString = /\d/;

    if(validString.test(data.firstName)) return res.status(400).send({ status: false, msg: "Enter a valid First Name" });
    if(validString.test(data.lastName)) return res.status(400).send({ status: false, msg: "Enter a valid Last Name" });

    let validTitle = ['Mr', 'Mrs', 'Miss'];
    if(!validTitle.includes(data.title)) return res.status(400).send({ status: false, msg: "Title should be one of Mr, Mrs, Miss" });

    if(!validateEmail.validate(req.body.email)) return res.status(400).send({ status: false, msg: "Enter a valid email" })

    let uniqueEmail = await Author.findOne({ email: data.email });
    if(uniqueEmail) return res.status(400).send({ status: false, msg: "Email already exist" })

    let showAuthorData = await Author.create(data);
    res.status(201).send({ status: true, data: showAuthorData });
  } catch(err) {
    res.status(500).send({ status: false, msg: err.message });
  }
}

module.exports.addAuthor = addAuthor;