const mongoose=require("mongoose")

const UserSchema=new mongoose.Schema({
    name:{
        type:String,
        default:null
    },
    email:{
        type:String,
        default:null
    },
    password:{
        type:String
       
    },
    token:{
        type:String
    }
})

module.exports=mongoose.model("user",UserSchema)