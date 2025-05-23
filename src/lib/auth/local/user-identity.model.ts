import { Schema, model } from 'mongoose';
import { UserIdentity } from './user-identity.entity';

const userIdentitySchema = new Schema<UserIdentity>({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    provider: { type: String, default: 'local'}, // Indica il metodo di autenticazione
    credentials: {
        type: {
            username: String,
            hashedPassword: String,
        },
        _id: false
    }
    ,token: String 
});

userIdentitySchema.set('toJSON', {
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

userIdentitySchema.pre('findOne', function(next) { //Trigger: Prima di ogni operazione findOne()
    this.populate('user');
    next();
})

export const UserIdentityModel = model<UserIdentity>('UserIdentity', userIdentitySchema);