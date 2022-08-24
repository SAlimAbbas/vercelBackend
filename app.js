require("dotenv").config()
require("./db").connect()
const express=require("express")
const bycrypt=require("bcryptjs")
const User = require("./model/user")
const Task = require("./model/task")
var jwt = require('jsonwebtoken');
const cors=require('cors');
const auth=require("./middleware/auth")
// const cookieParser = require("cookie-parser")

const app=express();
app.use(cors());
app.use(express.json())
// app.use(cookieParser())

app.get("/",(req,res)=>{
    res.end("home route")
})
app.post("/signup",async(req,res)=>{
 try {
    const {name,email,password}=req.body;
    if(!(email && password && name)){
        res.status(400).send("All fields are required")
    }

    const existuser= await User.findOne({email})
    if(existuser){
        return res.status(401).end("User already exist")
    }

    const myencpassword=await bycrypt.hash(password,10)
    
    const user=await User.create({
       name:name,
        email:email.toLowerCase(),
        password:myencpassword
    })

    // user.save()

    var token = jwt.sign({ user_id:user._id },process.env.SECRET,{
        expiresIn:"2h"
    } );

    user.token=token
    // user.password=undefined
    res.status(201).send(user)
    
 } catch (error) {
    console.log(error);
    res.end("Some Error Occured")
 }


})

app.post("/login",async(req,res)=>{
    try {
        const {email,password}=req.body

        if(!(email && password)){
           return  res.status(401).send("please enter valid credetials")
        }

        const user=await User.findOne({email})
        if(!user){
            return res.send("Please Regiser First")
        }
        if(email && (await bycrypt.compare(password,user.password))){
          
            const token=jwt.sign({
                user_id:user._id,
                email
            },process.env.SECRET,{
                expiresIn:'2h'
            })

            user.token=token
            user.password=undefined
            // to access in header from fromnt end
            return res.status(201).send(user)

            
        }
        res.send("Invalid password")
    } catch (error) {
        console.log(error);
    }
})

app.post("/todos/create",auth,async(req,res)=>{
 
    const {taskname,tag,email}=req.body
    // console.log(email)
    const user= await User.findOne({email})
    console.log("user is",user);
    const todo=await Task.create({
        taskname:taskname,
        tag:tag,
        userid:user._id,
        status:false
    })

res.status(201).send(todo)      
})

app.post("/todos",auth,async(req,res)=>{
    const {email}=req.body
    const userdetails=await User.findOne({email})
    // console.log(userid._id);
    const tododata=await Task.find({userid:userdetails._id})

    return res.status(201).end(JSON.stringify(tododata))
})

app.post("/todos/delete/:todoID",async(req,res)=>{
    const {todoID}=req.params

    const todo=await Task.deleteOne({_id:todoID})
    res.end("data delete successfully")

})


module.exports=app