// src/controllers/user.ts
import { Context } from 'koa';
import { getManager } from 'typeorm';
import jwt from 'jsonwebtoken';

import { User } from '../entity/user';
import { JWT_SECRET } from '../utils/constants';
import { NotFoundException, ForbiddenException } from '../utils/exceptions';

export default class UserController {
  public static async listUsers(ctx: Context) {
    console.log('/user.ts [26]--1',ctx,ctx.params,ctx.state);
    const userId = +ctx.params.id;

    const userRepository = getManager().getRepository(User);
    const users = await userRepository.find();

    ctx.status = 200;
    ctx.body = users;
  }

  public static async showUserDetail(ctx: Context) {
    const userId = +ctx.params.id;
    console.log('/user.ts [23]--1',ctx.params);
    // let token = ctx.header.authorization
    // let payload = jwt.verify(token.split(' ')[1], JWT_SECRET);
    if (userId !== +ctx.state.user.id) {
      ctx.status = 403;
      throw new ForbiddenException();
    }

    const userRepository = getManager().getRepository(User);
    const user = await userRepository.findOne(+ctx.params.id);

    if (user) {
      ctx.status = 200;
      ctx.body = user;
    } else {
      throw new NotFoundException();
    }
  }

  public static async updateUser(ctx: Context) {
    const userId = +ctx.params.id;

    if (userId !== +ctx.state.user.id) {
      ctx.status = 403;
      throw new ForbiddenException();
    }

    const userRepository = getManager().getRepository(User);
    await userRepository.update(+ctx.params.id, ctx.request.body);
    const updatedUser = await userRepository.findOne(+ctx.params.id);

    if (updatedUser) {
      ctx.status = 200;
      ctx.body = updatedUser;
    } else {
      throw new NotFoundException();
    }
  }

  public static async deleteUser(ctx: Context) {
    const userId = +ctx.params.id;

    if (userId !== +ctx.state.user.id) {
      ctx.status = 403;
      throw new ForbiddenException();
    }

    const userRepository = getManager().getRepository(User);
    await userRepository.delete(+ctx.params.id);

    ctx.status = 204;
  }
}
