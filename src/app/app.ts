import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import Router from 'koa-router';
import "reflect-metadata"




const app: Koa = new Koa();

app.use(bodyParser());

const router = new Router();

router.post("signInOrRegister", "/auth", ctx => {
    const credentials = ctx.request.body

})

app.use(ctx => {
    ctx.body = 'Hello World';
});

export default app;
