import Koa from "koa";
import WebSocket from "ws";
import http from "http";
import Router from "koa-router";
import bodyParser from "koa-bodyparser";
import {
  timeLogger,
  exceptionHandler,
  jwtConfig,
  initWss,
  verifyClient,
} from "./utils";
import { router as authRouter } from "./auth";
import { router as classesRouter } from './main/classes'
import { router as quizRouter } from './main/quiz';
import { router as attemptRouter } from './main/attempt';
import jwt from "koa-jwt";
import cors from "@koa/cors";
import { time } from "console";
import { run_all} from './test/run_tests';

run_all();

const app = new Koa();
const server = http.createServer(app.callback())
const wss = new WebSocket.Server({server});

app.use(cors());
app.use(timeLogger);
app.use(exceptionHandler);
app.use(bodyParser());

const prefix = ''
const publicApiRouter = new Router({prefix});
const protectedApiRouter = new Router({prefix});



publicApiRouter.use('/auth', authRouter.routes());
app.use(publicApiRouter.routes())
   .use(publicApiRouter.allowedMethods());
app.use(jwt(jwtConfig));

protectedApiRouter.use('/main', quizRouter.routes());
protectedApiRouter.use('/main', classesRouter.routes());
protectedApiRouter.use('/main', attemptRouter.routes());
app.use(protectedApiRouter.routes())
   .use(protectedApiRouter.allowedMethods());

server.listen(3000);
console.log("Server Listening on port 3000");