import { AppDataSource } from "../config/dataSource";
import { User } from "../entities/User";
import { addUserToGroup } from "../services/authService"
import { cognito, USER_POOL_ID } from "../config/cognitoConfig";

async function removeUserFromGroup(email: string, group: string) {
    try {
        await cognito
            .adminRemoveUserFromGroup({
                UserPoolId: USER_POOL_ID,
                Username: email,
                GroupName: group,
            })
            .promise();
        console.log(`User ${email} removed from group ${group}`);
    } catch (error) {
        console.error("Error removing user from group:", error);
        throw error;
    }
}

const userRepository = AppDataSource.getRepository(User);
export default async function updateUser(email: string, name: string, isAdmin: boolean, role?: string) {
    const user = await userRepository.findOne({ where: { email } });
    if (!user) {
        throw new Error("No user found");
    }

    user.name = name;
    if (isAdmin && role) {
        await removeUserFromGroup(email, user.role)
        user.role = role;
        await addUserToGroup(email, role)
    }
    user.isOnboarded = true;

    await userRepository.save(user);
    return user;
}

