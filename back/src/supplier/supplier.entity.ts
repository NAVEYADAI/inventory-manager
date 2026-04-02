import { Company } from 'src/company/company.entity';
import { Invetory } from 'src/invetory/invetory.entity';
import {
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Supplier {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => Invetory, (invetory) => invetory.supplier)
  invetory: Invetory[];
}
