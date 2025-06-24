import { RawMaterial } from 'src/raw-material/raw-material.entity';
import { Subscription } from 'src/subscription/subscription.entity';
import { Supplier } from 'src/supplier/supplier.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Invetory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  price: number;

  @Column({ nullable: false })
  date: Date;

  @ManyToOne(() => Subscription, (subscription) => subscription.invetory)
  subscription: Subscription;

  @ManyToOne(() => RawMaterial, (raw_material) => raw_material.invetory)
  raw_material: RawMaterial;

  @ManyToOne(() => Supplier, (supplier) => supplier.invetory)
  supplier: Supplier;
}
