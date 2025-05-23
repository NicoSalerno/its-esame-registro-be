import { User } from "./user.entity";
import { UserModel } from "./user.model";

export async function list(role?: 'student' | 'teacher'): Promise<User[]> {
    const query = role ? { role } : {};
    return await UserModel.find(query);
}

