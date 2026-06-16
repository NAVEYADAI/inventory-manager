import { Company } from '../company/company.entity';
import { User } from '../user/user.entity';
import { Invetory } from '../invetory/invetory.entity';
import { Platoon } from '../platoon/platoon.entity';
import { RawMaterial } from '../raw-material/raw-material.entity';
import { Recipe } from '../recipe/recipe.entity';
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
  recipes: Recipe[];

  @OneToMany(() => Platoon, (platoon) => platoon.subscription) // מחלקות מוצרים
  platoon: Platoon[];

  @OneToMany(() => Invetory, (invetory) => invetory.subscription) // מלאי
  invetory: Invetory[];
}
