const mongoose = require("mongoose");
const validator = require("validator");
const bcryptjs = require("bcryptjs");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    lowercase: true,

    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Email is not an valid one!!!");
      }
    },
  },
  password: {
    type: String,
    minlength: 6,
    trim: true,
    required: true,
  },
  
  walletFile: {
    filename: String,
    url: String,
  },
  isBackedup:{
    type:Boolean,
    default:false
  }

});

/////// Instance Methods ////////

userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject(); // converting mongoose document to plain js object
  delete userObject.password;
  return userObject;
};







/// Instance Methods //////

userSchema.methods.toJSON = function () {
  let user = this
  user = user.toObject()

  delete user.password;
  delete user._id
  delete user.__v
  console.log(user)
  return user
}


/////// Static Methods ////////

userSchema.statics.verifyCredentials = async function (email, password) {
  const user = await User.findOne({ email });
  if (!user) throw new Error("Invalid credentials");
  const isMatch = await bcryptjs.compare(password, user.password);
  if (!isMatch) throw new Error("Invalid credentials");
  return user;
};



/////// Middleware ///////

userSchema.pre("save", async function () {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcryptjs.hash(user.password, 8);
  }
});




const User = mongoose.model("User", userSchema);

module.exports = User;
