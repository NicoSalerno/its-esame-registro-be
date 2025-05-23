import passport from "passport";
import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt';
import { UserModel } from "../../../api/user/user.model";
import { User } from "../../../api/user/user.entity";

export const JWT_SECRET = 'my_jwt_secret';

passport.use(
    new JwtStrategy({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: JWT_SECRET
    },
    async (token, done) => {
        try {
            const user = await UserModel.findById<User>(token.id); // Estrae l'ID utente dal token decodificato
            if (user) {
                done(null, user);
            } else {
                done(null, false, { message: 'invalid token'});
            }
        } catch(err) {
            done(err);
        }
    })
);