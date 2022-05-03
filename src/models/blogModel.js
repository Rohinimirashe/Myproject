const mongoose = require('mongoose');
let ObjectId = mongoose.Schema.Types.ObjectId
const blogSchema = new mongoose.Schema({

title: {
    type:String,
    required:'Blog title is required',
    trim: true,
},
 
body: {
     type:String,
     required:'Blog body is required',
     trim: true,
    },

authorid:{
    type: ObjectId,
    required:'Blog Author is required',
    ref:"Author"
},
tags: [{
    type: String,
    trim: true,
}],
category: {
    type: String,
    required:'Blog category is required',
    trim: true,
},
subcategory: [{
    type: String,
    trim: true,
}],
publishedAt:{
    type:Date,
    default: null,
},  
isPublished: {
    type: Boolean,
    default: false
},
deletedAt :{
    type:Date,
    default: null,
},

isDeleted: {
    type:Boolean, 
    default: false
},
},{timestamps:true})
module.exports = mongoose.model("Blog", blogSchema)