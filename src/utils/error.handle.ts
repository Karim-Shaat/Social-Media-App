

export interface IError extends Error{
    statusCode:number
}

export class AppError extends Error{
    constructor(msg:string, private statusCode:number=500){
        super(msg)
    }
}


export class notFoundException extends AppError {
    constructor(msg:string = "not found"){
        super(msg, 404)
    }
}

export class badRequestException extends AppError {
    constructor(msg:string = "bad request"){
        super(msg, 400)
    }
}