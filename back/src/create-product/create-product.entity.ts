import { Recipe } from 'src/recipe/recipe.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class CreateProduct {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Recipe, (recipe) => recipe.create_product)
  recipe: Recipe;

  @Column()
  batche_count: number;

  @Column()
  created_time: Date;

  @Column()
  updated_time: Date;
}
