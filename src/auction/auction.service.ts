import { InjectRepository } from '@nestjs/typeorm';
import { AuctionEntity } from './entities/auction.entity';
import { Repository } from 'typeorm';
import { CreateAuctionDto } from './dto/create-auction.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AuctionService {
  constructor(
    @InjectRepository(AuctionEntity)
    private auctionRepository: Repository<AuctionEntity>,
  ) {}

  async createAuction(createAuctionDto: CreateAuctionDto) {
    return await this.auctionRepository.save(createAuctionDto);
  }

  async getAuctionList() {
    const auctionList = await this.auctionRepository.find({
      relations: ['user'],
    });

    return auctionList;
  }

  async getAuctionListByUserId(userId: number) {
    const auctionList = await this.auctionRepository.find({
      where: {
        userId: userId,
      },
    });

    return auctionList;
  }
}
