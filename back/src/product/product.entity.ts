import { Platoon } from '../platoon/platoon.entity';
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Recipe } from '../recipe/recipe.entity';

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

  @OneToMany(() => Recipe, (recipe) => recipe.product)
  recipe: Recipe;
}
