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

  @OneToOne(() => Company, (company) => company.supplier, { cascade: true })
  @JoinColumn()
  company: Company;

  @OneToMany(() => Invetory, (invetory) => invetory.supplier)
  invetory: Invetory[];
}
