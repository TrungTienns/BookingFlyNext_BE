import {
  Body,
  Controller,
  Headers,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { ApiExcludeEndpoint, ApiTags } from '@nestjs/swagger';
import { LoginUserDto } from './auth-dto/login-user.dto';
import { SingUpUserDto } from './auth-dto/signup-user-dto';
import { AuthService } from './auth.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  signUp(@Body() SingUpUserDto: SingUpUserDto) {
    return this.authService.signUp(SingUpUserDto);
  }

  @Post('login')
  login(@Body() LoginUserDto: LoginUserDto) {
    return this.authService.login(LoginUserDto);
  }

  @ApiExcludeEndpoint()
  @Post('reset-token')
  async resetToken(@Headers() headers) {
    const token = headers.authorization?.split(' ')[1];
    if (!token) {
      throw new HttpException('Token not provided', HttpStatus.BAD_REQUEST);
    }

    try {
      return await this.authService.resetToken(token);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        error.message || 'An error occurred while refreshing token',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
