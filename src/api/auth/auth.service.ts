import { UserIdentityModel } from "../../lib/auth/local/user-identity.model";
import { User } from "../user/user.entity";
import { UserModel } from "../user/user.model";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export class UserExistsError extends Error {
    constructor() {
        super();
        this.name = 'UserExists';
        this.message = 'username already in use';
    }
}
export class AuthService {

    async add(user: User, credentials: {username: string, password: string}): Promise<User> {
        const existingIdentity = await UserIdentityModel.findOne({'credentials.username': credentials.username});
        if (existingIdentity) {
            throw new UserExistsError();
        }
        const newUser = await UserModel.create(user);
        
        const hashedPassword = await bcrypt.hash(credentials.password, 10);
    
        await UserIdentityModel.create({
            provider: 'local',
            user: newUser.id,
            credentials: {
                username: credentials.username,
                hashedPassword
            }
        });
    
        return newUser;
    }

    
}

export async function getUserByToken(token: string): Promise<User> {
    try {
        const decoded = jwt.decode(token) as User;
        
        const userIdentity = await UserIdentityModel.findOne({
            user: decoded,
            token: token
        });

        if(!userIdentity){
            throw new Error('token not found');
        }

        return userIdentity.user;
        
    } catch (error) {
        console.error('Token verification failed:', error);
        throw new Error('Invalid or expired token');
    }
}

export async function addToken(userId: string, token: string): Promise<boolean> {
    const result = await UserIdentityModel.updateOne(
        { user: userId }, 
        { $set: { token: token } }
    );
    return result.modifiedCount > 0;
}

export async function verifyToken(userId: string, token: string): Promise<boolean> {
    const userIdentity = await UserIdentityModel.findOne({
        user: userId,
        token: token
    });
    
    return !!userIdentity;
}
export default new AuthService();