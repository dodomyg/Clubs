const jwt =require('jsonwebtoken')

const verifyToken=(req,resp,next)=>{
   const token = req.cookies
   if(!token){
    return resp.status(404).json({message:"Un-authorized"})
   }
   const userId = Object.keys(token)
   if (userId.length > 0) {
    const firstUserId = userId[0];
    const jwtToken = token[firstUserId];
    // console.log(jwtToken);

jwt.verify(jwtToken,"dodomyg",(err,decoded)=>{
    if(err){
    return resp.status(404).json({message:"JWT Cannot be verified"})
    
    }
    // console.log(decoded.id);
    req.userId = decoded.id
})
next()
}

}

module.exports=verifyToken