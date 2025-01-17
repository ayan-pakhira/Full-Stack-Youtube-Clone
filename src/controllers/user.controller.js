import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import {ApiResponse} from "../utils/ApiResponse.js"

const registerUser = asyncHandler(async (req, res) => {
    //****"following are the steps to follow to create register controller"**

  //1. get the user details from frontend
  //2. validation, like if user is given any empty fields
  //3. check if user already exists: through username and email
  //4. check for images, check for avatar
  //5. upload them to cloudinary, avatar
  //6. create user object, "as we are using mongodb here, which is a nosql database, that
  // is why we need object, as the data get stored there in this form." - create 
  // entry in db
  //7. remove password and refresh token fields from response
  //8. check for user creation, is there any null response or not
  //9. return response

  //1. --get the user details
  const { email, username, fullname, password } =req.body //need to check this by printing it in console, to check that how object actually comes.
  console.log("email: " + email);
  console.log("username: " + username)
  console.log("fullname: " + fullname)

    //2.- checking validation for any empty fields -- this is beginner friendly
    //   if(fullname == ""){
    //     throw new ApiError(400, "full name is required")
    //   }
    // -- but for the above method we had to check each and every field one at a 
    //time

   //-- optimized and advanced way
   if(
    [fullname, email, username, password].some((field) => field?.trim() === "")
   ){
        throw new ApiError(400, "all fields are required")
   }

   //also we can apply validation to check that email has any "@" sign or not
   // we can add multiple validation like that to check each and every field
   //in there way

   //3. --checking if the user is already exists thorugh the username, email
   //fullname
  const existedUser = await User.findOne({
    $or: [{ username }, { email }, { fullname }]
   })

   if(existedUser){
    throw new ApiError(409, "user already exists")
   }

   //4.--uploading files such as avatar and cover image
   // --points to focus on that, req.body can be used in case of accepting data
   // from such as, username or email, but for images we have to use files, as they
   //will be uploaded as file
   const avatarLocalPath = req.files?.avatar[0]?.path
   const imageLocalPath = req.files?.coverImage[0]?.path
   //need to check this req.files? by printing it in the console, simply do console.log for it

 //checking validation for avatar
   if(!avatarLocalPath){
    throw new ApiError(400, "avatar file is required")
   }

  //  //5. --upload them to cloudinary
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(imageLocalPath)

  //  //checking validation for cover image and avatar file
    if(!coverImage){
     throw new ApiError(400, "cover image field is required")
    }

   //6. create object and entry to db.
   const user = await User.create({
    fullname,
    avatar: avatar.url,
    coverImage: coverImage?.url || " ",
    email,
    password,
    username: username.toLowerCase()
   })

   //by finding one user from the db we can check that 
   //any field is empty or not
   //"_id" this will be created by mongodb itself
   //this is basically validation field of 6th step
   //also here we will implement the 7th step, which is removing password or 
   //any security related fields
   const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
   )

   //8. --checking user validation for user creation
   if(!createdUser){
    throw new ApiError(500, "something went wrong")
   }

   //9. -- returning the response
   return res.status(201).json(
    new ApiResponse(200, createdUser, "successfully created user")
   )


})


export { registerUser } 