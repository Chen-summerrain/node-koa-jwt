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
    if(!ctx.state.user) {
      ctx.response.body = {
        code: 30001,
        msg: `user not login`,
        success: false
      }
      return;
    }

    const userRepository = getManager().getRepository(User);
    const users = await userRepository.find();

    ctx.status = 200;
    ctx.response.body = {
      code: '0000',
      msg: `success`,
      success: true,
      data:[...users],
      total:users.length
    }
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
    console.log('/user.ts [57]--1',userId);
    // if (userId !== +ctx.state.user.id) {
    //   ctx.status = 403;
    //   throw new ForbiddenException();
    // }

    const userRepository = getManager().getRepository(User);
    await userRepository.update(+ctx.params.id, ctx.request.body);
    const updatedUser = await userRepository.findOne(+ctx.params.id);

    if (updatedUser) {
      ctx.status = 200;
      ctx.response.body = {
        code: '0000',
        msg: `success`,
        success: true,
      }
    } else {
      ctx.response.body = {
        code: '300001',
        msg: `update is loss!`,
        success:false
      }
    }
  }

  public static async deleteUser(ctx: Context) {
    const userId = +ctx.params.id;

    if (userId !== +ctx.state.user.id) {
      ctx.status = 200;
      ctx.response.body = {
        code: '300001',
        msg: `No Forbidden!`,
        success:false
      }
      return;
      // throw new ForbiddenException();
    }

    const userRepository = getManager().getRepository(User);
    const res = await userRepository.delete(+ctx.params.id);
    console.log('/user.ts [93]--1','del',res);
    console.log('/user.ts [94]--1','user',ctx.state.user.id);
    if (res) {
      ctx.status = 200;
      ctx.response.body = {
        code: '0000',
        msg: `delete is success`,
        success: true,
      }
    } else {
      ctx.status = 200;
      ctx.response.body = {
        code: '300001',
        msg: `delete is loss!`,
        success:false
      }
    }
  }
}
