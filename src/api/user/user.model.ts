import { model, Schema } from "mongoose";
import { User } from "./user.entity";

const userSchema = new Schema<User>({
    name: String,
    surname: String,
    role: String,
    picture: String
});

userSchema.set('toObject', {
    virtuals: true,
    transform: (_, ret) => {
        delete ret._id;
        delete ret.__v;
        return ret;
    }
});

userSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (_, ret) => {
    ret.id = ret._id;
    ret.firstName = ret.name;
    ret.lastName = ret.surname;
    ret.fullName = `${ret.name} ${ret.surname}`;

    delete ret._id;
    delete ret.name;
    delete ret.surname;

    return ret;
  }
});

userSchema.virtual('fullName').get(function(){
    return `${this.name} ${this.surname}`;
});

export const UserModel = model<User>('User',userSchema);