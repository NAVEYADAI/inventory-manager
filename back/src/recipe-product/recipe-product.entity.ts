import { RawMaterial } from 'src/raw-material/raw-material.entity';
import { Recipe } from 'src/recipe/recipe.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class RecipeProduct {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  volume: number;

  @ManyToOne(() => Recipe, (recipe) => recipe.recipe_product)
  recipe: Recipe;

  @ManyToOne(() => RawMaterial, (raw_material) => raw_material.recipe_product)
  raw_material: RawMaterial;
}
