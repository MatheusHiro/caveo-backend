import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import Router from 'koa-router';
import "reflect-metadata"
import cors from "@koa/cors"
import connectToDatabase from '../config/dataSource';
import userRoutes from '../routes/userRoutes';

const app: Koa = new Koa();

app.use(bodyParser());

const router = new Router();

connectToDatabase()

app.use(cors());
app.use(bodyParser());

router.use(userRoutes.routes());

app.use(router.routes()).use(router.allowedMethods());

export default app;
