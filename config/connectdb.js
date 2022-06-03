const mongoose = require('mongoose');
require('dotenv/config');

module.exports=()=>{
    
   

 if(`${process.env.NODE_ENV}`==='Production'){

    mongoose.connect("mongodb://localhost:27017/Journalism")
        .then(()=>{ console.log('connect mongodb .....')})
        .catch((error)=>{ console.log(`could not connect with mongodb ${error}`)})
 }
 else{
     console.log(process.env.DEV_DB)
    mongoose.connect("mongodb://localhost:27017/Journalism")
        .then(()=>{ console.log(`connect mongodb on ${process.env.DEV_DB}`)})
        .catch((error)=>{
            console.log(`could not connect with mongodb ${error}`)})
            // process.exit(1)
           
 }




}

