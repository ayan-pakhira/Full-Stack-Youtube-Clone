class ApiError extends Error{
    constructor(
        statusCode,
        message = "Something went wrong",
        errors = [],
        stack = ""
    ){
        super(message)
        this.statusCode = statusCode
        this.data = null//assignment - why this line is written
        this.message = message
        this.success = false;
        this.errors = errors

        if(stack) {
            this.stack = stack
        }else{
            Error.captureStackTrace(this, this.constructor) //
        }

    }
}

export { ApiError } 

//handling api error with the classes to cover every possible error which can occur
//during the development.