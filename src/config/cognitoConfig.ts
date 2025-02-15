import AWS from "aws-sdk";

const CLIENT_ID = process.env.COGNITO_CLIENT_ID as string;
const USER_POOL_ID = process.env.USER_POOL_ID as string;
const CLIENT_SECRET = process.env.COGNITO_CLIENT_SECRET as string;
const COGNITO_REGION = "sa-east-1";
const ADMIN_ACCESS_KEY_ID = process.env.COGNITO_ADMIN_ACCESS_KEY
const ADMIN_ACCESS_SECRET_KEY = process.env.COGNITO_ADMIN_SECRET_ACCESS_KEY

const cognito = new AWS.CognitoIdentityServiceProvider({
    region: COGNITO_REGION,
    credentials: new AWS.Credentials(
        ADMIN_ACCESS_KEY_ID!,
        ADMIN_ACCESS_SECRET_KEY!
    ),
});

export {
    cognito,
    USER_POOL_ID,
    CLIENT_ID,
    CLIENT_SECRET
}