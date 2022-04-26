const mongoose=require('mongoose')
require('mongoose-type-email')
const validEmail=mongoose.SchemaTypes.Email;
const authorSchema =new mongoose.Schema({
    fName:{
        type:String,
        required:true
    },
    lName:{
        type:String,
        required:true  
    },
    title: {
        type: String,
        required: true,
        enum: ['Mr', 'Mrs', 'Miss']
    },
  email:{
      type:validEmail,
      required:true,
      unique:true
  },
  password: {
    type: String,
    required: true
}
},{timestamps:true})

module.exports=mongoose.model('Author',authorSchema)