import mongoose, { MongooseError } from 'mongoose'
import {DB_NAME} from "../constants.js"

const connectDB = async () => {
    try{
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`mongodb connected!! DB HOST: ${connectionInstance.connection.host}`)
    }catch(error){
        console.log("MONGODB connection error: ", error)
        process.exit(1)
        //to get out of the whole process we generally use 'throw', which 
        //mainly leads to exit the process, but in node js we can use the
        //above function to get out of the whole process.
        //both the throw and exit functions, which is inside of process,
        // works in same way.
        //and in the parameter, '1' stands for process code, which has some
        //meaning, there are lots of other process code.
        //
        //****assignment
         //run the connectionInstance variable in console.log() to check what it
         //actually print
    }
}

export default connectDB