import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import {ApiResponse} from "../utils/ApiResponse.js"

const generateAccessAndRefreshTokens = async (userId) => {
  try{
   const user = await User.findById(userId)
   const accessToken = user.generateAccessToken();
   const refreshToken = user.generateRefreshToken();

   //uploading the refresh token to the database
   user.refreshTOken = refreshToken;
   await user.save({validateBeforeSave: false});
   //all these things are related to mongoose and mongodb, cause all this are coming from there.

   return {accessToken, refreshToken};



  }catch(error){
    throw new ApiError(500, "Error in generating tokens")
  }
}

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
  //also need to check that "why this 'body' is written"
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
   const avatarLocalPath = req.files?.avatar[0]?.path //why do we need to find the local path for images.
   const imageLocalPath = req.files?.coverImage[0]?.path
   //need to check this req.files? by printing it in the console, simply do console.log for it

   //simplified code of the previous code snippets:

  //  let coverImageLocalPath;
  //  if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0){
  //     coverImageLocalPath = req.files.coverImage[0].path
  //   }
  //we can either write this code or the previous code, both means the same, but previous is advanced one.


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

const loginUser = asyncHandler(async (req, res) => {

  //todo: to login the user
  //1. bring data from the request body.
  //2. username or email
  //3. find the user
  //4. password check - now if password checked
  //5. generate access and refresh tokens and send to the user.
  //6. send cookies and send a success response.

  const {email, username, password} = req.body
  console.log(email)
  console.log(username)

  if(!username || !email){
    throw new ApiError(400, "username or email is required")
  }
 //
 const user = await User.findOne({
    $or: [{username}, {email}] //this 'or' operator is coming from mongodb server
    //for this case "user" is in capital letters, as this are the object of mongoose or mongodb,
    //other 'user' which is in small letters, they are the normal object which we have created and working with.
    //also the instance of the mongodb object.
  })

  if(!user){
    throw new ApiError(404, "user not found");
  }
 //from the comment down // these two code is for finding the user and and giving a message if user is not found.


 //password check
 const isPasswordValid = await user.isPasswordCorrect(password)

 if(!isPasswordValid){
  throw new ApiError(401, "password is incorrect")
 }

  //generate tokens cause the user password is correct
  const {accessToken, refreshTOken} = await generateAccessAndRefreshTokens(user._id) //why the id is written in this is not cleared

  //to restrict the tokens and passwords from returing to the user.
  const loggedInUser = await User.findById(user._id).
  select("-password -refreshToken")


  //sending the cookies and success response
  const options ={
    httpOnly: true,
    secure: true
    //cookies can be edited by default in frontend, so we have to make it secure, 
    //that is why we have to keep this setting as 'true'.
    //now this will only be modified from the server side.
  }

  return res
  .status(200)
  .cookie("accessToken", accessToken, options)
  .cookie("refreshToken", refreshToken, options)
  .json(
    new ApiResponse(200, 
      {
        user: loggedInUser, accessToken, refreshToken
      },
      "successfully logged in"
    )
    //in this case, "loggedInUser" is the user object which we have selected,
    //to exclude the password and refreshToken from the response.
 
  )

  




})


//logout user
const logoutUser = asyncHandler(async(req, re) => {

  //this is to logout user
  //1. remove cookies from the user's browser
  //2. update the user's refresh token to null in the database
  //3. send a success response

  await User.findByIdAndUpdate(req.user._id, {
    $set:{
      refreshToken: undefined
    }
  },
  {
    new: true
  }

  const options ={
    httpOnly: true,
    secure: true
  }

  return res
  .status(200)
  .clearCookie("accessToken", options)
  .clearCookie("refreshToken", options)
  .json(new ApiResponse(200, {}, "user logged out"))

)




  
})






export { registerUser, loginUser, logoutUser } 