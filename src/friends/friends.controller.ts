import { Controller, Get, Param, Post } from '@nestjs/common';
import { FriendsService } from './friends.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Friends')
@Controller('friends')
export class FriendsController {
  constructor(private readonly friendsService: FriendsService) {}

  @Post('add-friend/:userId/:friendId')
  addFriend(
    @Param('userId') userId: number,
    @Param('friendId') friendId: number,
  ) {
    return this.friendsService.addFriend(userId, friendId);
  }

  @Get('get-friends-by-userId/:user_id')
  getFriendsByUserId(@Param('user_id') user_id: number) {
    return this.friendsService.getFriendsByUserId(user_id);
  }
}
