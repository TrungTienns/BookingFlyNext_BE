import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { PrismaClient } from '@prisma/client';

@WebSocketGateway(8081, {
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;
  private prisma: PrismaClient = new PrismaClient();

  handleConnection(socket: Socket) {
    // console.log(`Client connected: ${socket.id}`);
  }

  handleDisconnect(socket: Socket) {
    // console.log(`Client disconnected: ${socket.id}`);
  }

  @SubscribeMessage('join-room')
  async handleJoinRoom(socket: Socket, roomId: string) {
    socket.rooms.forEach((room) => {
      if (room !== socket.id) {
        socket.leave(room);
      }
    });

    await socket.join(roomId);

    const chatHistory = await this.prisma.chat.findMany({
      where: {
        room_id: roomId,
      },
      include: {
        users: true,
      },
    });

    this.server.to(roomId).emit('load-chat', chatHistory);
  }

  @SubscribeMessage('send-mess')
  async handleMessage(socket: Socket, data: any) {
    const newChat = {
      user_id: data.user_id,
      content: data.txtChat,
      room_id: data.roomId,
      date: new Date(),
    };
    await this.prisma.chat.create({ data: newChat });
    this.server.to(data.roomId).emit('mess-server', newChat);
  }
}
