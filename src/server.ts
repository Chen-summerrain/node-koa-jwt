import koa from 'koa';
import cors from '@koa/cors';
import bodyParser from 'koa-bodyparser';
import {createConnection} from 'typeorm';
import jwt from 'koa-jwt';
import 'reflect-metadata';

import { protectedRouter, unprotectedRouter } from './routes';
import { logger } from './logger';
import { JWT_SECRET } from './utils/constants';

// const {createConnection} = pkg;
createConnection()
  .then(() => {
    //init koa;
    const app = new koa();

    //register middleware
    app.use(cors());
    app.use(bodyParser());
    app.use(logger())

    // 无需 JWT Token 即可访问
    app.use(unprotectedRouter.routes()).use(unprotectedRouter.allowedMethods());

    // 注册 JWT 中间件
    app.use(jwt({ secret: JWT_SECRET, passthrough: true }));

    // 需要 JWT Token 才可访问
    app.use(protectedRouter.routes()).use(protectedRouter.allowedMethods());

    // run server
    app.listen(3000,()=>{
      console.log('/server.js [27]--1','server is run 3000');
    })
  })
  .catch((err:string) => console.log('TypeORM connection error:', err));

