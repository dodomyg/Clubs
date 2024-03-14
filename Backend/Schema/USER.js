const mongoose=require('mongoose')

const UserSchema = new mongoose.Schema({
    fullName:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    image:{type:String,default:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHMBY8KV3NAYcO1Qe3IVWkI9grt9QKeZ3vHA&usqp=CAU"}
},{timestamps:true})


module.exports=mongoose.model("USER",UserSchema)