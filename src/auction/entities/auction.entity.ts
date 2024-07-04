import { UserEntity } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Auction')
export class AuctionEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ length: 30 })
  name: string;

  @Column({ length: 60 })
  description: string;

  @Column()
  startPrice: number;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  endDate: Date = new Date();

  @Column()
  photoUrl: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdDt: Date = new Date();

  @Column()
  userId: string;

  @ManyToOne(() => UserEntity, (user) => user.auctions)
  user: UserEntity;
}
