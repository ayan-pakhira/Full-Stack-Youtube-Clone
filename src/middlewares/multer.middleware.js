import multer from "multer"

const storage = multer.diskStorage({
    destination: function (req, file, cb){
        cb(null, "public/temp/")
    },
    filename: function(req, file, cb) {
       cb(null, file.originalname)
    }
})

export const upload = multer({storage})

//basically the purpose of this is, before uploading the files on cloud we will pass them
//through middleware which here is multer, then after uploading got completed we will
//delete them from the middleware, to save them in the middleware we have used here
//diskStorage for storage.