import Router from "koa-router";
import { authMiddleware, authorizeRole } from "../middlewares/authMiddleware";
import { User } from "../entities/User";
import { AppDataSource } from "../config/dataSource";
import * as dotenv from 'dotenv';
import { authenticateUser, checkUserExistsInCognito, createUserInCognito, findOrCreateUser } from "../services/authService";
import updateUser from "../services/userService";

dotenv.config();

const router = new Router();
interface AuthRequestBody {
  email: string;
  name?: string;
  password: string
}

interface EditRequestBody {
  name: string;
  role?: string
}

router.get('/', async (ctx) => {
  ctx.body = { message: "Hello, World!" };
});

router.post("/auth", async (ctx) => {
  const { name, email, password } = ctx.request.body as AuthRequestBody;

  try {
    const user = await findOrCreateUser(email, name);
    const role = user.role;

    const existsInCognito = await checkUserExistsInCognito(email);

    if (!existsInCognito) {
      console.log("User not found in Cognito, creating...");
      if (!name) {
        throw new Error("Please inform a name when registering!")
      }
      await createUserInCognito(email, name, password, role);
    }

    const idToken = await authenticateUser(email, password);

    ctx.body = {
      message: "User authenticated",
      token: idToken,
      user,
    };
  } catch (error: any) {
    console.error("Error authenticating:", error);
    ctx.status = 401;
    ctx.body = { message: "Fail to authenticate: ", error: error.message };
  }
});


router.get('/me', authMiddleware, async (ctx) => {
  ctx.body = { message: "User's info:", user: ctx.state.user };
});

router.put('/edit-account', authMiddleware, async (ctx) => {
  const { name, role } = ctx.request.body as EditRequestBody;
  const isAdmin = ctx.state.user["cognito:groups"].includes("admin");

  try {
    const user = await updateUser(ctx.state.user.email, name, isAdmin, role);
    ctx.body = { message: "Account updated", user };
  } catch (error: any) {
    ctx.status = 404;
    ctx.body = { message: error.message };
  }
});

router.get('/users', authMiddleware, authorizeRole("admin"), async (ctx) => {
  const userRepository = AppDataSource.getRepository(User);
  const users = await userRepository.find();
  ctx.body = users;
});

export default router;
