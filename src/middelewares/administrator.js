module.exports=( req,res,next)=>{

    if(req.admin&&req.admin.role==="administrator"){
        next()
    }
    else{
        res.status('401')
        throw new Error('not authurization to acces')  
    }
    
 
}