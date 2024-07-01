import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('User')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ length: 30 })
  name: string;

  @Column({ length: 60 })
  email: string;

  @Column({ length: 30 })
  password: string;

  @Column({ length: 60 })
  photoUrl: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMPSTAMP' })
  createdDt: Date = new Date();
}
