const express = require('express')
const jwt = require('jsonwebtoken')
const router = express.Router()
const bcrypt =require('bcrypt')
const cookieParser = require('cookie-parser')
const USER = require('../Schema/USER')
const verifyToken = require('../Middleware/authToken')

router.use(cookieParser())

router.post('/register',async(req,resp)=>{
    const {fullName,password,email}=req.body
    try {
        if(!fullName || !password || !email){
            return resp.status(422).json({error:"Enter all credentials"})
        }
        const alreadyUser = await USER.findOne({email})
        if(alreadyUser){
            return resp.status(400).json({error:"User already exists with same email"})
        }
        const hashedPw = await bcrypt.hash(password,12)
        const newUser = await USER.create({fullName,email,password:hashedPw})
        resp.status(201).json({message:"User Created",newUser})
    } catch (error) {
        resp.status(404).json({error:error.message})
    }
})


router.post('/login',async(req,resp)=>{
    const {password,email}=req.body
    try {
        if(!password || !email){
            return resp.status(422).json({error:"Enter all credentials"})
        }
        var AlreadyUser = await USER.findOne({email})
        if(!AlreadyUser){
            return resp.status(400).json({error:"User not present register first"})
        }
        var enteredPw = await bcrypt.compare(password,AlreadyUser.password)
        if(!enteredPw){
            return resp.status(400).json({error : "Incorrect Password"})
        }
        const jwtToken = await jwt.sign({id:AlreadyUser._id},"dodomyg",{expiresIn:'5h'})
        resp.cookie(String(AlreadyUser._id),jwtToken,{path:'/',httpOnly:true,sameSite:'lax',expires:new Date(Date.now()+1000*2160000)})
       resp.status(201).json({message:"User Logged In",AlreadyUser,jwtToken:jwtToken})
    } catch (error) {
        resp.status(404).json({error:error.message})
    }
})


router.post('/logout',verifyToken,async(req,resp)=>{
    try {
        const userId = req.userId
        if(!userId){
        return resp.status(400).json({ error: 'User ID not found in cookies' });
        }
    resp.clearCookie(String(userId))
    resp.status(200).json({ message: 'Logout successful' });
    } catch (error) {
        resp.status(404).json({message:error.message})
    }
})



module.exports=router