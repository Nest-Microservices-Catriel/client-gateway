import { Body, Controller, Get, Inject, Post, UseGuards } from '@nestjs/common';

import { NATS_SERVICE } from 'src/config';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { LoginUserDto, RegisterUserDto } from './dto';
import { AuthGuard } from './guards/auth.guard';
import { User } from './decorators/user.decorator';
import { ICurrentUser } from './interfaces/current-user.interface';
import { Token } from './decorators/token.decorator';

@Controller('auth')
export class AuthController {
  constructor(@Inject(NATS_SERVICE) private readonly clientNast: ClientProxy) {}

  @Post('register')
  async register(@Body() registerUserDto: RegisterUserDto) {
    try {
      const response = await firstValueFrom(
        this.clientNast.send('auth.register.user', registerUserDto),
      );
      return response;
    } catch (error) {
      console.log(error);

      throw new RpcException(error);
    }
  }

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto) {
    try {
      const response = await firstValueFrom(
        this.clientNast.send('auth.login.user', loginUserDto),
      );
      return response;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @UseGuards(AuthGuard)
  @Get('verify-token')
  async verifyToekn(@User() user: ICurrentUser, @Token() token: string) {
    return { user, token };
  }
}
