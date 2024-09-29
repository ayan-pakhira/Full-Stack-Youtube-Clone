import express from 'express'
import cors  from 'cors'
import cookieParser from 'cookie-parser'

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

//below has the configuration of express to handle the request of data of
//different types and also, some other use cases related to url and server
//response

//and this is for accepting data in forms of json
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
app.use(express.cookieParser())

export { app } 