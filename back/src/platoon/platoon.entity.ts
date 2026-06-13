import { Product } from '../product/product.entity';
import { Subscription } from '../subscription/subscription.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Platoon {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  name: string;

  @ManyToOne(() => Subscription, (subscription) => subscription.platoon)
  subscription: Subscription;

  @OneToMany(() => Product, (product) => product.platoon)
  product: Product[];
}
