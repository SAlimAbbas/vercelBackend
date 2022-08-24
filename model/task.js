const mongoose=require("mongoose")

const Todoschema=new mongoose.Schema({
    taskname:String,
    status:String,
    tag:String,
    userid:String
})

module.exports=mongoose.model("todo",Todoschema)