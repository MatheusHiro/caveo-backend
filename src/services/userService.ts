import { AppDataSource } from "../config/dataSource";
import { User } from "../entities/User";

const userRepository = AppDataSource.getRepository(User);
export default async function updateUser(email: string, name: string, isAdmin: boolean, role?: string) {
    const user = await userRepository.findOne({ where: { email } });
    if (!user) {
        throw new Error("No user found");
    }

    user.name = name;
    if (isAdmin && role) {
        user.role = role;
    }
    user.isOnboarded = true;

    await userRepository.save(user);
    return user;
}

