import { CreateProduct } from '../create-product/create-product.entity';
import { RecipeProduct } from '../recipe-product/recipe-product.entity';
import { Subscription } from '../subscription/subscription.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Product } from '../product/product.entity';

@Entity()
export class Recipe {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  name: string;

  @Column()
  is_deleted: boolean;

  @ManyToOne(() => Subscription, (subscription) => subscription.recipes)
  subscription: Subscription;

  @ManyToOne(()=> Product, (product) => product.recipe, { nullable: true })
  product: Product;

  @OneToMany(() => RecipeProduct, (recipe_product) => recipe_product.recipe, { cascade: true })
  recipe_product: RecipeProduct[];

  @OneToMany(() => CreateProduct, (create_product) => create_product.recipe)
  create_product: CreateProduct[];
}
