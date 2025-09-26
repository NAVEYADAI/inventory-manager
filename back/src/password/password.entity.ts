import { User } from 'src/user/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Password {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  password: string;

  @Column()
  date: Date;

  @ManyToOne(() => User, (user) => user.id)
  user: User;
}
