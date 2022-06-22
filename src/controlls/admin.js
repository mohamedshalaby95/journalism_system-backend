const adminValidation = require("../validations/admin");
const adminModel = require("../models/admin");
const bcrypt = require("bcrypt");
const _ = require("lodash");

async function addAdmin(req, res) {

  const { error } = adminValidation(req.body);

  if (error) {
    res.status(400);
    throw new Error(`${error.details[0].message}`);
  }

  let admin = await adminModel.findOne({ email: req.body.email });
  if (admin) {
    res.status(409);
    throw new Error(`This Email is Registed`);
  }

  admin = new adminModel(
    _.pick(req.body, [
      "firstName",
      "lastName",
      "email",
      "password",
      "image",
      "brief",
      "role",
    ])
  );
  admin = await admin.save();

  const token = admin.generatetoken();
  admin = _.pick(admin, ["_id","firstName", "lastName", "image", "role","brief"]);

  res.status(201).send({ ...admin, token });
}

async function updateAdmin(req, res) {


  let admin = await adminModel.findOne({ email: req.body.email });

  if (admin && admin._id != req.admin._id) {
    res.status(409);
    throw new Error(`This Email is Registed`);
  }

  if(req.body.password){
    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, salt);
  }

 admin = await adminModel.findByIdAndUpdate(req.admin._id, {
    $set: {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: req.body.password,
      role: req.body.role,
      image: req.body.image,
      brief:req.body.brief
    },
  }, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
 admin = await admin.save();
  const token =admin.generatetoken();
 admin = _.pick(admin, ["firstName", "lastName", "image", "role","brief"]);

  res.status(200).send({ ...admin, token });
 
}

async function getAdmins(req, res) {

  // console.log("here",admins)
 let admins = await adminModel.find({})

 admins = admins.map(admin=> _.pick(admin, ["_id","firstName", "lastName", "email", "role","brief"]))
 res.status(200).send(admins );
}


async function deleteAdmin(req, res) {

  // console.log("here",admins)
 let admin= await adminModel.findByIdAndDelete(req.params.id)


 res.status(200).send(admin._id );
}
module.exports = { addAdmin,updateAdmin ,getAdmins,deleteAdmin};
