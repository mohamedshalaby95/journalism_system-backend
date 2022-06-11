const userValidation = require("../validations/user");
const userModel = require("../models/user");
const _ = require("lodash");
const bcrypt = require("bcrypt");

async function addUser(req, res, next) {
 
  
  const { error } = userValidation(req.body);

  if (error) {
 
    res.status(400);
    throw new Error(`${error.details[0].message}`);
    
  }

  let user = await userModel.findOne({ email: req.body.email });
  if (user) {
   
    res.status(409)
    throw new Error(`This Email is Registed`);
    
  }

  user = new userModel(
    _.pick(req.body, ["firstName", "lastName", "email", "password","image","intersted"])
  );
  user = await user.save();
  

  const token=user.generatetoken()
  user=_.pick(user,["firstName","lastName","image","intersted"])
 
  res.status(201).send({...user,token})


}

async function updateUser(req, res) {
 

  const { error } = userValidation(req.body);

  if (error) {
    
    res.status(400)
    throw new Error(`${error.details[0].message}`);
    
  }

  let user = await userModel.findOne({ email: req.body.email });

  if (user && user._id != req.params.id) {
    res.status(409);
    throw new Error(`This Email is Registed`);
  
  }
  if(req.body.password){
    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, salt);
  }

  user = await userModel.findByIdAndUpdate(req.params.id, {
    $set: {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: req.body.password,
      intersted:req.body.intersted,
      image:req.body.image
    },
  }, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  user = await user.save();
  const token=user.generatetoken()
  user=_.pick(user,["firstName","lastName","image","intersted"])
 
  res.status(200).send({...user,token})
}
async function getUser(req,res){
  let users = await userModel.find({})
  
  // users=_.pick(users,["firstName","lastName","email"])


    res.status(200).send(users)
}
module.exports = { addUser, updateUser, getUser };
