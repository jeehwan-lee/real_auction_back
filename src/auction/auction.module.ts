import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuctionEntity } from './entities/auction.entity';
import { AuctionController } from './auction.controller';
import { AuctionService } from './auction.service';
import { AuthService } from 'src/auth/auth.service';

@Module({
  imports: [TypeOrmModule.forFeature([AuctionEntity])],
  controllers: [AuctionController],
  providers: [AuctionService, AuthService],
})
export class AuctionModule {}
