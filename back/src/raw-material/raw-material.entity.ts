import { Invetory } from 'src/invetory/invetory.entity';
import { RecipeProduct } from 'src/recipe-product/recipe-product.entity';
import { Subscription } from 'src/subscription/subscription.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class RawMaterial {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  priceIsOnUnit: boolean;

  @ManyToOne(() => Subscription, (subscription) => subscription.raw_material)
  subscription: Subscription;

  @OneToMany(() => Invetory, (invetory) => invetory.raw_material)
  invetory: Invetory[];

  @OneToMany(
    () => RecipeProduct,
    (recipe_product) => recipe_product.raw_material,
  )
  recipe_product: RecipeProduct[];
}
