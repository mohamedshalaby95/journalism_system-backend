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
      "role",
    ])
  );
  admin = await admin.save();

  const token = admin.generatetoken();
  admin = _.pick(admin, ["firstName", "lastName", "image", "role"]);

  res.status(201).send({ ...admin, token });
}

async function updateAdmin(req, res) {
  const { error } = adminValidation(req.body);

  if (error) {
    res.status(400);
    throw new Error(`${error.details[0].message}`);
  }

  let admin = await adminModel.findOne({ email: req.body.email });

  if (admin && admin._id != req.params.id) {
    res.status(409);
    throw new Error(`This Email is Registed`);
  }

  if(req.body.password){
    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, salt);
  }

 admin = await adminModel.findByIdAndUpdate(req.params.id, {
    $set: {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: req.body.password,
      role: req.body.role,
      image: req.body.image,
    },
  }, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
 admin = await admin.save();
  const token =admin.generatetoken();
 admin = _.pick(admin, ["firstName", "lastName", "image", "role"]);

  res.status(200).send({ ...admin, token });
}
module.exports = { addAdmin,updateAdmin };
