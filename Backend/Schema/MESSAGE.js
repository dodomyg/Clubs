const mongoose=require('mongoose')

const MessageSchema = new mongoose.Schema({
    sender:{type:mongoose.Schema.Types.ObjectId,ref:"USER"},
    content:{type:String},
    chat:{type:mongoose.Schema.Types.ObjectId,ref:"CHAT"}
},{timestamps:true})


const MESSAGE=mongoose.model("MESSAGE",MessageSchema)
module.exports=MESSAGE