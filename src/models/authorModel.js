const mongoose = require('mongoose');

const authorSchema = new mongoose.Schema({
    fname : {
        type:String,
        required:'first name is required',
        trim: true
    },
    lname : {
        type:String,
        required:'first name is required',
        trim: true,
    },
    title : {
        type:String,
        required:'Title is required',
        enum:["Mr","Mrs","Miss", "Mast"]
    },

    email : {
        type:String,
        trim: true,
        lowercase: true,
        required:'Email address is required',
        required:true,
        unique:true ,   
     },
    password : {
        type:String,
        trim: true,
        required:'Password is required',
    },
},{timestamps:true})

module.exports = mongoose.model("Author", authorSchema)