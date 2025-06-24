import { CreateProduct } from 'src/create-product/create-product.entity';
import { RecipeProduct } from 'src/recipe-product/recipe-product.entity';
import { Subscription } from 'src/subscription/subscription.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Recipe {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  name: string;

  @ManyToOne(() => Subscription, (subscription) => subscription.recipe)
  subscription: Subscription;

  @Column()
  is_deleted: boolean;

  @Column({ nullable: false })
  sum_on_kg: number;

  @OneToMany(() => RecipeProduct, (recipe_product) => recipe_product.recipe)
  recipe_product: RecipeProduct[];

  @OneToMany(() => CreateProduct, (create_product) => create_product.recipe)
  create_product: CreateProduct[];
}
