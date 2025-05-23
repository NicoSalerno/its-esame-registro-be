import { NextFunction, Request, Response } from "express";
import { TypedRequest } from "../../lib/typed-request.interface";
import { AddUserDTO } from "./auth.dto";
import { omit, pick } from "lodash";
import authSrv,{ addToken, UserExistsError } from "./auth.service";
import passport from "passport";
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from "../../lib/auth/jwt/jwt-strategy";

export const addUser = async (
    req: TypedRequest<AddUserDTO>,
    res: Response,
    next: NextFunction
) => {
    try {
        const userData = {
            ...omit(req.body, 'username', 'password'),
            name: req.body.firstName,
            surname: req.body.lastName
        };
        const credentialsData = pick(req.body, 'username', 'password');
        const newUser = await authSrv.add(userData, credentialsData);
        res.status(201);
        res.json(newUser);
    } catch(err) {
        if (err instanceof UserExistsError) {
            res.status(400);
            res.json({
                error: err.name,
                message: err.message
            })
        } else {
            next(err);
        }
    }
}

export const login = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {

    passport.authenticate('local', { session: false },
        async (err, user, info) => {

            if(err) {
                next(err);
                return;
            }

            try{
            if (!user) {
                res.status(400);
                res.json({
                    error: 'LoginError',
                    message: info.message
                });
                return;
            }

            const token = jwt.sign(user, JWT_SECRET, { expiresIn: '30 minutes' });

            await addToken(user.id, token);

            res.status(200);
            res.json({
                user,
                token,
            });
        }catch(errLog:any){
            throw new Error(errLog);
        }
        }
        
    )(req, res, next);

}