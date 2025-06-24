import { Platoon } from 'src/platoon/platoon.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => Platoon, (platoon) => platoon.product)
  platoon: Platoon[];

  @Column()
  is_raw_material: boolean;

  @Column()
  available: boolean;
}
