export class AppError extends Error {
    statusCode;
    constructor(msg, statusCode = 500) {
        super(msg);
        this.statusCode = statusCode;
    }
}
export class notFoundException extends AppError {
    constructor(msg = "not found") {
        super(msg, 404);
    }
}
export class badRequestException extends AppError {
    constructor(msg = "bad request") {
        super(msg, 400);
    }
}
