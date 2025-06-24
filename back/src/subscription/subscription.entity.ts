import { Company } from 'src/company/company.entity';
import { Invetory } from 'src/invetory/invetory.entity';
import { Platoon } from 'src/platoon/platoon.entity';
import { RawMaterial } from 'src/raw-material/raw-material.entity';
import { Recipe } from 'src/recipe/recipe.entity';
import {
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Subscription {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Company, (company) => company.subscription, { cascade: true })
  @JoinColumn()
  company: Company;

  @OneToMany(() => RawMaterial, (raw_material) => raw_material.subscription)
  raw_material: RawMaterial[];

  @OneToMany(() => Recipe, (recipe) => recipe.subscription)
  recipe: Recipe[];

  @OneToMany(() => Platoon, (platoon) => platoon.subscription)
  platoon: Platoon[];

  @OneToMany(() => Invetory, (invetory) => invetory.subscription)
  invetory: Invetory[];
}
