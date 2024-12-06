import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true, //to make any field searchable we need to keep the index as
      // true, so that we can find that in database by searching through.
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    fullname: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    // avatar: {
    //   type: String, //we will use the url of cloudnary, where the images of
    //   //avatar will be stored.
    //   required: true,
    // },
    coverImage: {
       type: String, //cloudnary url
       default: " ",
     },
    watchHistory: [
      {
        type: Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
    password: {
      type: String,
      required: [true, "password is required"],
    },
    refreshToken: {
      type: String,
    },
  },
  { timeStamps: true }
);

//here we are going to use a hook to give some security to any valuable information
//such as password and refresh token, that is why we will use 'pre' hook in middleware
//which will actually secure the password and refresh token just before the loading.
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
});

//why we have used the above code - reason is mentioned below.
//the above code is mainly for middleware, like in case of saving the password before
//loading we want to save it, that is why after doing that task it will pass the methods
//as we have used "next()" which mainly describe that the middleware has done its thing
//now it is time to pass the methods

//*****applying logic to modify the access to hooks and their reason */
//***but here we have got a problem, that is during applying the hook, we have given the
//access of whole userSchema object, but we want to apply it only for password that too
//when any modification occurred in it... so for that we need some changes to make by
//applying some business logic, which is applied in the line no 69.

//******creating custom methods for password checking************ */
//#### now here what we are going to do is, the password has saved in form of encrypted
//to check the password we also can define some custom methods by applying some business
//logic to it.
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
  //here 1st password parameter denoting the password which given by the user
  //and the second parameter is for the encrypted password which is stored in the
  //database.
};

//defining methods for generating access and refresh tokens
userSchema.methods.generateAccessToken = function () {
  //this "sign" method is for generating access tokens with jwt.
  return jwt.sign(
    {
      //here the left side is coming from database and the right side is from
      //my code
      _id: this._id,
      email: this.email,
      username: this.username,
      fullname: this.fullname,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_SECRET_EXPIRY,
    }
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      //here the left side is coming from database and the right side is from
      //my code
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_SECRET_EXPIRY,
    }
  );
};

export const User = mongoose.model("User", userSchema);
