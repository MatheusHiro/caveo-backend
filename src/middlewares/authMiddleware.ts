import jwt from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';
import { Context, Next } from 'koa';

const COGNITO_REGION = 'sa-east-1'; 
const USER_POOL_ID = 'sa-east-1_AQPGUSyrG';
const JWKS_URI = `https://cognito-idp.${COGNITO_REGION}.amazonaws.com/${USER_POOL_ID}/.well-known/jwks.json`;

const client = jwksClient({ jwksUri: JWKS_URI });

function getKey(header: any, callback: any) {
    client.getSigningKey(header.kid, (err, key) => {
      if (err || !key) {
        return callback(new Error("Error retrieving cognito key"));
      }
      callback(null, key.getPublicKey());
    });
  }
  

export async function authMiddleware(ctx: Context, next: Next) {
  try {
    const token = ctx.headers.authorization?.replace("Bearer ", "");
    if (!token) throw new Error("No token retrieved");

    const decoded: any = await new Promise((resolve, reject) => {
      jwt.verify(token, getKey, { algorithms: ['RS256'] }, (err, decoded) => {
        if (err) reject(err);
        else resolve(decoded);
      });
    });

    ctx.state.user = decoded;
    await next();
  } catch (error) {
    ctx.status = 401;
    ctx.body = { message: "Invalid token or unauthorized" };
  }
}

export function authorizeRole(requiredRole: string) {
  return async (ctx: Context, next: Next) => {
    const user = ctx.state.user;
    if (!user || !user["cognito:groups"] || !user["cognito:groups"].includes(requiredRole)) {
      ctx.status = 403;
      ctx.body = { message: "Access denied" };
      return;
    }
    await next();
  };
}
