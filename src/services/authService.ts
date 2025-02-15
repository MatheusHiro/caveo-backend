import crypto from "crypto";
import { AppDataSource } from "../config/dataSource";
import { User } from "../entities/User";
import { cognito, USER_POOL_ID, CLIENT_ID, CLIENT_SECRET } from "../config/cognitoConfig";


async function addUserToGroup(email: string, group: string) {
    try {
        await cognito
            .adminAddUserToGroup({
                UserPoolId: USER_POOL_ID,
                Username: email,
                GroupName: group,
            })
            .promise();
        console.log(`User ${email} added to group ${group}`);
    } catch (error) {
        console.error("Error adding user to group:", error);
        throw error;
    }
}

function computeSecretHash(username: string): string {
    return crypto
        .createHmac("sha256", CLIENT_SECRET)
        .update(username + CLIENT_ID)
        .digest("base64");
}

async function checkUserExistsInCognito(email: string): Promise<boolean> {
    try {
        await cognito
            .adminGetUser({
                UserPoolId: USER_POOL_ID,
                Username: email,
            })
            .promise();
        return true;
    } catch (error: any) {
        if (error.code === "UserNotFoundException") {
            return false;
        }
        console.error("Error checking user in Cognito:", error);
        throw error;
    }
}

async function createUserInCognito(email: string, name: string, password: string, role: string) {
    try {
        await cognito
            .adminCreateUser({
                UserPoolId: USER_POOL_ID,
                Username: email,
                UserAttributes: [
                    { Name: "email", Value: email },
                    { Name: "name", Value: name },
                    { Name: "email_verified", Value: "true" },
                ],
                TemporaryPassword: password,
                MessageAction: "SUPPRESS",
            })
            .promise();

        await cognito
            .adminSetUserPassword({
                UserPoolId: USER_POOL_ID,
                Username: email,
                Password: password,
                Permanent: true,
            })
            .promise();

        console.log(`User ${email} created in Cognito.`);

        await addUserToGroup(email, role);
    } catch (error: any) {
        if (error.code === "UsernameExistsException") {
            console.log(`User ${email} already exists in Cognito.`);
        } else {
            console.error("Error creating user in Cognito:", error);
            throw error;
        }
    }
}

async function authenticateUser(email: string, password: string) {
    try {
        const authResult = await cognito
            .initiateAuth({
                AuthFlow: "USER_PASSWORD_AUTH",
                ClientId: CLIENT_ID,
                AuthParameters: {
                    USERNAME: email,
                    PASSWORD: password,
                    SECRET_HASH: computeSecretHash(email),
                },
            })
            .promise();

        const idToken = authResult.AuthenticationResult?.IdToken;
        if (!idToken) {
            throw new Error("Fail to authenticate user.");
        }

        return idToken;
    } catch (error) {
        console.error("Error authenticating user:", error);
        throw error;
    }
}

async function findOrCreateUser(email: string, name?: string): Promise<User> {
    const userRepository = AppDataSource.getRepository(User);
    let user = await userRepository.findOne({ where: { email } });

    if (!user) {
        if (!name) {
            throw new Error("Please provide a name to register.");
        }

        user = userRepository.create({
            name,
            email,
            role: "user",
            isOnboarded: false,
        });

        await userRepository.save(user);
    }

    return user;
}


export {
    addUserToGroup,
    checkUserExistsInCognito,
    createUserInCognito,
    authenticateUser,
    findOrCreateUser
}

