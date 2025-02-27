import { AuctionEntity } from 'src/auction/entities/auction.entity';
import { ChatEntity } from 'src/chat/entities/chat.entity';
import { NoticeEntity } from 'src/notice/entities/notice.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('User')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ length: 30 })
  name: string;

  @Column({ length: 60 })
  email: string;

  @Column()
  password: string;

  @Column()
  photoUrl: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdDt: Date = new Date();

  @OneToMany(() => AuctionEntity, (auction) => auction.user)
  auctions: AuctionEntity[];

  @OneToMany(() => NoticeEntity, (notice) => notice.user)
  notices: NoticeEntity[];

  @OneToMany(() => ChatEntity, (chat) => chat.user)
  chatList: ChatEntity[];
}
