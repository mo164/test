//const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('./../validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const userSchema = new mongoose.Schema({
 photo:{
  type:String,
  required: [true, 'Please enter a photo'],
  default:'https://res.cloudinary.com/dg0ic00jx/image/upload/v1715625754/Default_pfp_1_xq2u6v.jpg'
},
  firstName: {
    type: String,
    required: [true, 'Please tell us your name!']
  },
  lastName: {
    type: String,
    required: [true, 'Please tell us your name!']
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
     unique: true,
     lowercase: true,
    validateor: [validator.isEmail, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
    select: false
  },
  phoneNumber:{
    type: String,
  },
  role:{
    type: String,
    enum: ['admin','user'],
    default: 'user'            
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      // This only works on CREATE and SAVE!!!
      validator: function(el) {
        return el === this.password;
      },
      message: 'Passwords are not the same!'
    }
  },
  
  passwordChangedAt: Date,
  passwordResetToken:String,
  passwordResetExpires: Date
});

userSchema.pre('save', async function(next) {
  // Only run this function if password was actually modified
  if (!this.isModified('password')) return next();

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  // Delete passwordConfirm field
  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.correctPassword = async function(candidatePassword,userPassword) 
  {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return JWTTimestamp < changedTimestamp;
  }

  // False means NOT changed
  return false;
};

userSchema.methods.createPasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  console.log({ resetToken }, this.passwordResetToken);

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000 ;

  return resetToken;
};

const User = mongoose.model('User', userSchema);
module.exports = User;
