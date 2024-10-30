import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class FriendsService {
  constructor(private prisma: PrismaClient) {}

  async addFriend(userId, friendId) {
    const friend_id = parseInt(friendId);
    try {
      const data = await this.prisma.user_friends.create({
        data: {
          user_id: 1,
          friend_id: friend_id,
        },
      });
      return {
        message: 'Add friend successfully',
        status: 200,
        date: new Date(),
      };
    } catch (error) {
      console.log(error);
      throw new Error('An error occurred while processing your request');
    }
  }

  async getFriendsByUserId(user_id) {
    try {
      const data = await this.prisma.user_friends.findMany({
        where: {
          user_id: parseInt(user_id),
        },
        include: {
          users_user_friends_friend_idTousers: true,
        },
      });
      return {
        data,
        message: 'Get friends by userId successfully',
        status: 200,
        date: new Date(),
      };
    } catch (error) {
      console.log(error);
      throw new Error('An error occurred while processing your request');
    }
  }
}
