import { RawMaterial } from '../raw-material/raw-material.entity';
import { Recipe } from '../recipe/recipe.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UOM } from '@inventory-manager/shared';

@Entity()
export class RecipeProduct {
  @PrimaryGeneratedColumn()
  id: number; 

  @Column({ nullable: false })
  volume: number;

  @Column({ nullable: false, type: 'enum', enum: UOM })
  uom: UOM;

  @ManyToOne(() => Recipe, (recipe) => recipe.recipe_product)
  recipe: Recipe;

  @ManyToOne(() => RawMaterial, (raw_material) => raw_material.recipe_product)
  raw_material: RawMaterial;
}
