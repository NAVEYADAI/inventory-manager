import { Invetory } from '../invetory/invetory.entity';
import { RecipeProduct } from '../recipe-product/recipe-product.entity';
import { Subscription } from '../subscription/subscription.entity';
import { MeasurementType } from '../enums';
import { RawMaterialConversion } from './raw-material-conversion.entity';
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

  @Column({ nullable: false, default: false })
  priceIsOnUnit: boolean;

  @Column({ nullable: false, default: MeasurementType.WEIGHT })
  measurementType: MeasurementType;

  @Column({ nullable: false, default: 'gram' })
  uom: string;

  @Column({ nullable: true })
  category?: string;

  @ManyToOne(() => Subscription, (subscription) => subscription.raw_material)
  subscription: Subscription;

  @OneToMany(() => Invetory, (invetory) => invetory.raw_material)
  invetory: Invetory[];

  @OneToMany(
    () => RecipeProduct,
    (recipe_product) => recipe_product.raw_material,
  )
  recipe_product: RecipeProduct[];

  @OneToMany(
    () => RawMaterialConversion,
    (conversion) => conversion.rawMaterial,
    { cascade: true }
  )
  conversions: RawMaterialConversion[];
}
