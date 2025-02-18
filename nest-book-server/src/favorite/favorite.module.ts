import { Module } from '@nestjs/common';
import { FavoriteService } from './favorite.service';
import { FavoriteController } from './favorite.controller';
import { PrismaService } from 'src/prisma.service';


@Module({
  controllers: [FavoriteController],
  providers: [FavoriteService,PrismaService],
})
export class FavoriteModule {}
