import { Request, Response, NextFunction } from "express";

export class TokenNotFoundError extends Error {
    constructor() {
        super('Entity Not Found');
    }
}

export const tokenNotFoundHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof TokenNotFoundError) {
        res.status(401).json({
            error: 'TokenNotFoundError',
            message: 'Access token is missing or invalid'
        });
    } else {
        next(err);
    }
};