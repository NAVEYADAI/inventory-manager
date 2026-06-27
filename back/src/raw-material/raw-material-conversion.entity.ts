import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { RawMaterial } from './raw-material.entity';

@Entity()
export class RawMaterialConversion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  uomName: string;

  @Column({ type: 'float', nullable: false })
  conversionFactor: number;

  @Column({ nullable: false, default: 'gram' })
  baseUom: string;

  @ManyToOne(() => RawMaterial, (rawMaterial) => rawMaterial.conversions, { onDelete: 'CASCADE' })
  rawMaterial: RawMaterial;
}
