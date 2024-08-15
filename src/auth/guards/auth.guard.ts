import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';

import { Request } from 'express';
import { firstValueFrom } from 'rxjs';
import { NATS_SERVICE } from 'src/config';
import { ICurrentUser } from '../interfaces/current-user.interface';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(@Inject(NATS_SERVICE) private readonly natsClient: ClientProxy) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException('Token not found');
    }
    console.log(token);

    try {
      const { user, token: newToken } = await firstValueFrom<{
        user: ICurrentUser;
        token: string;
      }>(this.natsClient.send('auth.check.token', token));
      console.log(user);

      request['user'] = user;
      request['token'] = newToken;
      return true;
    } catch (error) {
      console.log(error);

      throw new RpcException(error);
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
