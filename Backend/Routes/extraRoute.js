const express = require('express')
const jwt = require('jsonwebtoken')
const router = express.Router()
const cookieParser = require('cookie-parser')
const verifyToken = require('../Middleware/authToken')
const USER = require('../Schema/USER')


router.get('/jwt',verifyToken,async(req,resp)=>{
    const userId = req.userId
    if(!userId){
       return resp.status(404).json({message:"No token , login first"})
    }
        try {
            const getUser =await USER.findById({_id:userId})
        resp.status(200).json({message:"Got logged in user",getUser})
        } catch (error) {
        resp.status(404).json({message:error.message})
        }
})


router.get('/searchUser',verifyToken,async(req,resp)=>{
    const userId = req.userId
    const searchQuery = req.query.search ? {
        $and: [
            {
                $or: [
                    { fullName: { $regex: req.query.search, $options: 'i' } },
                    { email: { $regex: req.query.search, $options: 'i' } },
                ],
            },
            { _id: { $ne: userId } },
        ],
    }
  : { _id: { $ne: userId } }; 
    try {
            const findUser = await USER.find(searchQuery)
            resp.status(200).json({ findUser });
    } catch (error) {
        resp.status(404).json({message:error.message})
        
    }
})


module.exports=router