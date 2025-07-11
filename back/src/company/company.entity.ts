import { Subscription } from 'src/subscription/subscription.entity';
import { Supplier } from 'src/supplier/supplier.entity';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

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

  @OneToOne(() => Subscription, (subscription) => subscription.company)
  subscription: Subscription;

  @OneToOne(() => Supplier, (supplier) => supplier.company)
  supplier: Supplier;
}
