const asyncHandler = (requestHandler) => {
    (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err))
    }
}
//in the above code we are doing this with the promise. 
 

export {asyncHandler}

//*****important notes to remember */
// const asyncHandler = () => {}
// const asyncHandler = (func) => {() => {}}
// //it's simplified version is in the line no 10.
// const asyncHandler = (func) => async () => {}


//**********this is with the "try catch" where we are trying to catch the error
//along with the middleware**************** */
// const asyncHandler = (fn) => async (req, res, next) => {
//     try{
//         await fn(req, res, next)

//     }catch(err){
//         res.status(err.code || 500).json({
//             success: false,
//             message: err.message
//         })
//     }
// }
//this is going to be higher order function, this is a function which accepts 
//other functions as arguments and can return them also.