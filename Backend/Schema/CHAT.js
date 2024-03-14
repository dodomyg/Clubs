const mongoose=require('mongoose')

const ChatSchema = new mongoose.Schema({
    chatName:{type:String,required:true},
    grpChat:{type:Boolean,default:false},
    users:[{type:mongoose.Schema.Types.ObjectId,ref:"USER"}],
    latestMessage:[{type:mongoose.Schema.Types.ObjectId,ref:"MESSAGE"}],
    admin:{type:mongoose.Schema.Types.ObjectId,ref:"USER"}
},{timestamps:true})


module.exports=mongoose.model("CHAT",ChatSchema)