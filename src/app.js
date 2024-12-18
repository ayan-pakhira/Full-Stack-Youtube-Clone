import express from 'express'
import cors  from 'cors'
import cookieParser from 'cookie-parser'

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,//here origin means, the origin file, and here
    //we are allowing it, by declaring it here.
    credentials: true
}))

//below has the configuration of express to handle the request of data of
//different types and also, some other use cases related to url and server
//response

//and this is for accepting data in forms of json
//here limit of accepting the data in json is 16 kb.
app.use(express.json({limit:"16kb"}))

//to encode the url, like in the url if there is a gap available or other thing
//related to url, in that case to understand this by express we need to define
//those encoder through the below method
app.use(express.urlencoded({extended: true, limit:"16kb"}))
//here extended has used for allowing objects inside of objects, if that kind of
//data comes then to handle those, we need to use this method as true

app.use(express.static("public"))

//cookie parser - to access and set the cookies in the browser from our server
//basically performing crud operations on the server on cookies
app.use(cookieParser())

//above five methods are the way of configuring the express in the server.
//these steps has to be followed in the production grade project also. 

//*****routes ******//
import userRouter from './routes/user.routes.js'
//as we can see that this 'userRouter' is not declared in any file but still we are
//importing it, the reason is, as the export is default from user.routes.js file, we can 
//give any name during the import



//"router declarations"
//as we know for controlling the routes we generally use app.get and
//inside of that we provide the routes and also the server response
//but here as we have differentiate the routes and the server response
//so we have to pass it through the middleware 
app.use("/api/v1/users", userRouter)



export { app } 