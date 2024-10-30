import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaClient) {}

  async getAllUsers() {
    const users = await this.prisma.users.findMany();
    if (users) {
      return {
        data: users,
        message: 'Get all users successfully',
        status: 200,
        date: new Date(),
      };
    } else {
      throw new HttpException('No users found', HttpStatus.NOT_FOUND);
    }
  }

  async getUserById(id: number) {
    const user_id = parseInt(id.toString());
    try {
      const user = await this.prisma.users.findFirst({
        where: {
          user_id,
        },
      });
      if (user) {
        return {
          data: user,
          message: 'Get user by id successfully',
          status: 200,
          date: new Date(),
        };
      } else {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
    } catch (error) {
      console.log(error);
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        error.message || 'An error occurred while processing your request',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
