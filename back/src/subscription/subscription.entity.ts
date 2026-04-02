import { Company } from 'src/company/company.entity';
import { User } from 'src/user/user.entity';
import { Invetory } from 'src/invetory/invetory.entity';
import { Platoon } from 'src/platoon/platoon.entity';
import { RawMaterial } from 'src/raw-material/raw-material.entity';
import { Recipe } from 'src/recipe/recipe.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Subscription {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Company, (company) => company.subscription, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @ManyToMany(() => User, (user) => user.subscriptions)
  @JoinTable({ name: 'user_subscriptions' })
  users: User[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @OneToMany(() => RawMaterial, (raw_material) => raw_material.subscription)
  raw_material: RawMaterial[];

  @OneToMany(() => Recipe, (recipe) => recipe.subscription)
  recipe: Recipe[];

  @OneToMany(() => Platoon, (platoon) => platoon.subscription)
  platoon: Platoon[];

  @OneToMany(() => Invetory, (invetory) => invetory.subscription)
  invetory: Invetory[];
}
