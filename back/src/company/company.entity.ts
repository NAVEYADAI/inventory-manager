import { Subscription } from '../subscription/subscription.entity';
import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn, JoinColumn } from 'typeorm';

@Entity()
export class Company {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  name: string;

  @Column()
  identifier: string;

  @Column()
  address: string;

  @Column()
  phone: string;

  @OneToOne(() => Subscription, (subscription) => subscription.company, { cascade: true })
  @JoinColumn()
  subscription: Subscription;
}
