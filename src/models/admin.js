const { model, Schema } = require("mongoose");
const jwt = require("jsonwebtoken");

const bcrypt = require("bcrypt");

const adminSchema = new Schema({
  firstName: {
       type: String,
        required: true,
         minlength: 3 
        },
  lastName: {
       type: String, 
       required: true,
        minlength: 3 
    },
  email: {
       type: String, 
       required: true,
        unique: true 
    },
  password: { 
      type: String,
       required: true
     },
  image:{
      type:String,
      default:""
    },
  role:{
    type: String,
    enum: ["administrator", "editor", "reviewer"],
    required:true
    
    },

   })


adminSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    var user = this;

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    next();
  }
});
process.env.SECERT_TOKEN;

adminSchema.methods.generatetoken = function () {
  const token = jwt.sign({ _id: this._id,role:this.role}, `${process.env.SECERT_TOKEN}`);
  return token;
};
const adminModel = model("admin", adminSchema);

module.exports = adminModel;
