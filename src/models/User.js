import mongoose from 'mongoose';
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import uniqueValidator from 'mongoose-unique-validator';

const { Schema } = mongoose;

mongoose.set('debug', true);

mongoose.Promise = global.Promise;

// TODO: add uniqueness and email validation to email field
const userSchema = new Schema({
   email: {
       type: String,
       required: true,
       lowercase: true,
       index: true,
       unique: true,
   },
   passwordHash: { type: String, required: true },
   confirmed: {
       type: Boolean,
       default: false,
   }
},
    {
        timestamps: true,
    }
);


userSchema.methods.isValidPassword = function isValidPassword(password) {
    return bcrypt.compareSync(password, this.passwordHash);
};

userSchema.methods.generateJWT = function generateJWT() {
  return jwt.sign({
      email: this.email,
  }, process.env.JWT_SECRET)
};

userSchema.methods.toAuthJSON = function toAuthJSON() {
    return {
        email: this.email,
        confirmed: this.confirmed,
        token: this.generateJWT()
    }
};

userSchema.methods.setPassword = function setPassword(password) {
    this.passwordHash = bcrypt.hashSync(password, 10);
};

userSchema.plugin(uniqueValidator, { message: 'This email is already taken.'});

const User = mongoose.model('User', userSchema, 'users');

export default User;