
const express = require('express');
const MESSAGE = require('../Schema/MESSAGE');
const verifyToken = require('../Middleware/authToken');
const USER = require('../Schema/USER');
const CHAT = require('../Schema/CHAT');
const router = express.Router();


//send message
router.post('/sendMessage',verifyToken,async(req,resp)=>{
  const {chatId,content}=req.body
  try {
    const userId =req.userId
    if(!content || !chatId){
      return resp.status(404).json({message:" credentials are empty"})
    }
    var newMsg = {
      sender: userId,
      content: content,
      chat: chatId
    };
    
    let sendFullMsg = await MESSAGE.create(newMsg);
    
    sendFullMsg = await MESSAGE.populate(sendFullMsg, { path: "sender", select: "fullName image email" });
    sendFullMsg = await MESSAGE.populate(sendFullMsg, { path:"chat" });
    sendFullMsg = await USER.populate(sendFullMsg, {
      path: "CHAT.users",
      select: "fullName image email"
    });
    
    await CHAT.findByIdAndUpdate(chatId, {
      latestMessage: sendFullMsg
    });
    
    resp.status(200).json(sendFullMsg);
  } catch (error) {
    resp.status(404).json({message:error.message})
  }
})


//fetch all messages of 1 chat
router.get('/:chatId',verifyToken,async(req,resp)=>{
  const chatId = req.params.chatId
  try {
    const messages = await MESSAGE.find({chat:chatId}).populate("sender","fullName image email").populate("chat")
    resp.status(200).json(messages)
  } catch (error) {
    resp.status(404).json({message:error.message})
  }
})








module.exports = router;
