import dotenv from "dotenv"
import connectDB from "./db/index.js"

//configuring the dotenv variable 
dotenv.config({
    path: './.env'
})

//connecting the database by calling the method from db folder
connectDB()






//this is the first approach of connecting the database with the project.
// import express from 'express'
// const app = express()

// //the whole thing is inside of effy.
// ( async () => {
//     try{
//         await mongoose.connect(`${process_params.env.MONGODB_URI}/${DB_NAME}`)
//         app.on("error", (error) => {
//             console.log("ERROR!!", error)
//             throw error})
        
//             app.listen(process.env.PORT, () => {
//                 console.log("listening on port " + process.env.PORT)
//             })
//     }catch(error){
//         console.log("ERROR!!" , error)
//         throw err
//     }
// })

