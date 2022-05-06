const mongoose = require("mongoose");
const {schema} = require('./secure/postValidation')

const Blogschema = new mongoose.Schema({
    title:{
        type:String,
        trim:true,
        required:true,
    },
    body:{
        type:String,
        required:true
    },
    status:{
        type:String,
        default:"public",
        enum:["public" , "private"]
    },
    thumbnail : {
        type : String ,
        required : true
    },
    user:{
      type: mongoose.Schema.Types.ObjectId,
      ref:"User" 
    },

    createdAt:{
        type: Date,
        default: Date.now
    }

})

Blogschema.index({
    title : "text"
})

Blogschema.statics.postValidation = function(body){
    return schema.validate(body,{abortEarly:false})
}

module.exports = mongoose.model("Blog",Blogschema)
