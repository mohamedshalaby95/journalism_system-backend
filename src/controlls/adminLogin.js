const authValidation = require("../validations/auth");
const adminModel = require("../models/admin");
const _=require('lodash')

const bycrpt=require('bcrypt')

async function login(req,res){


    const {error}=authValidation(req.body)
    if(error){
        
        res.status(400);
        throw new Error(`${error.details[0].message}`);
    }
    
 let admin=await adminModel.findOne({email:req.body.email})
 if(!admin){
     res.status(403);
     throw new Error(`the email or password not valid `);
    }
  
   
    
    const password= await bycrpt.compare(req.body.password,admin.password)
   
 if(!password){
    res.status(403);
    throw new Error(`the email or password not valid `);  
 }
 const token=admin.generatetoken()
 admin=_.pick(admin,["firstName","lastName","image","role"])

 res.status(200)
.send({...admin,token})


}

module.exports={login}