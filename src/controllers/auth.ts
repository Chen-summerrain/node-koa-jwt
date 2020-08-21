// src/controllers/auth.ts
import { Context } from 'koa';
import * as argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import { getManager } from 'typeorm';

import { User } from '../entity/user';
import { JWT_SECRET } from '../utils/constants';
import { UnauthorizedException } from '../utils/exceptions';

export default class AuthController {
  public static async login(ctx: Context) {
    const userRepository = getManager().getRepository(User);
    const { name, password } = ctx.request.body

    const user = await userRepository
      .createQueryBuilder()
      .where({ name })
      .addSelect('User.password')
      .getOne();

    if (!user) {
      ctx.status = 401;
      ctx.response.body = {
        code: 30001,
        msg: `user ${name} is not exit!`,
        success: false
      }
      // throw new UnauthorizedException('用户名不存在');
    } else if (await argon2.verify(user.password, password)) {
      ctx.status = 200;
      ctx.response.body = {
        code: '0000',
        token: jwt.sign({ id: user.id }, JWT_SECRET),
        success: true,
        msg: 'Login is Success!'
      };
    } else {
      ctx.status = 401;
      ctx.response.body = {
        code: 30001,
        msg: `password is wrong!`,
        success: false
      }
      // throw new UnauthorizedException('密码错误');
    }
  }

  public static async register(ctx: Context) {
    const newUser = new User();
    const userRepository = getManager().getRepository(User);
    console.log('/auth.ts [13]--1', newUser, ctx);

    const { name, password, email } = ctx.request.body
    const user = await userRepository
      .createQueryBuilder()
      .where({ name })
      .getOne();

    if (user) {
      ctx.response.body = {
        code: 30001,
        msg: `user ${name} is already exit!`,
        success: false
      }
    } else {
      newUser.name = name;
      newUser.email = email;
      newUser.password = await argon2.hash(password);

      // 保存到数据库
      const _user = await userRepository.save(newUser);

      if (_user) {
        ctx.status = 200;
        ctx.response.body = {
          code: '0000',
          msg: `user ${name} register is success!`,
          success: true
        };
      }
    }



  }

  public static async checkLogin(ctx: Context) {
    const userRepository = getManager().getRepository(User);
    const { id }:{id:any} = ctx.state.user||{}
    if(!id) {
      ctx.response.body = {
        code: 30001,
        msg: `Login Loss!`,
        success: false
      }
      return;
    }
    const user = await userRepository
      .createQueryBuilder()
      .where({ id })
      .getOne();

    if (!user) {
      ctx.status = 401;
      ctx.response.body = {
        code: 30001,
        msg: `Login Loss!`,
        success: false
      }
      // throw new UnauthorizedException('用户名不存在');
    } else {
      ctx.status = 200;
      ctx.response.body = {
        code: '0000',
        data: {
          name: user.name,
          isAdmin: user.id === 1,
          id:user.id
        },
        msg: 'Login is Success!'
      };
    }
    // throw new UnauthorizedException('密码错误');
  }
}
