import Router from "koa-router";
import { authMiddleware, authorizeRole } from "../middlewares/authMiddleware";
import { User } from "../entities/User";
import { AppDataSource } from "../config/dataSource";

const router = new Router();

interface AuthRequestBody {
    email: string;
    name: string;
    role: string;
  }

interface EditRequestBody{
    name: string;
    role: string
}

router.post('/auth', async (ctx) => {
  const { email, name, role } = ctx.request.body as AuthRequestBody;
  const userRepository = AppDataSource.getRepository(User);

  let user = await userRepository.findOne({ where: { email } });

  if (!user) {
    user = userRepository.create({ email, name, role, isOnboarded: false });
    await userRepository.save(user);
  }

  ctx.body = { message: "User registered/authenticated", user };
});

router.get('/me', authMiddleware, async (ctx) => {
  ctx.body = { message: "User's info:", user: ctx.state.user };
});

router.put('/edit-account', authMiddleware, async (ctx) => {
  const { name, role } = ctx.request.body as EditRequestBody;
  const userRepository = AppDataSource.getRepository(User);
  const user = await userRepository.findOne({ where: { email: ctx.state.user.email } });

  if (!user) {
    ctx.status = 404;
    ctx.body = { message: "No user found" };
    return;
  }

  if (ctx.state.user["cognito:groups"].includes("admin")) {
    user.name = name;
    user.role = role;
  } else {
    user.name = name;
  }

  user.isOnboarded = true;
  await userRepository.save(user);

  ctx.body = { message: "Account updated", user };
});

router.get('/users', authMiddleware, authorizeRole("admin"), async (ctx) => {
  const userRepository = AppDataSource.getRepository(User);
  const users = await userRepository.find();
  ctx.body = users;
});

export default router;
