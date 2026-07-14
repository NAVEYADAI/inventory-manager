import { Subscription } from '../subscription/subscription.entity';
import { User } from '../user/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

export enum ActivityCategory {
  WORK_MANAGEMENT = 'work_management',
  EMPLOYEE_MANAGEMENT = 'employee_management',
}

export enum ActivityAction {
  CREATE_RECIPE = 'CREATE_RECIPE',
  UPDATE_RECIPE = 'UPDATE_RECIPE',
  DELETE_RECIPE = 'DELETE_RECIPE',
  CREATE_RAW_MATERIAL_BULK = 'CREATE_RAW_MATERIAL_BULK',
  UPDATE_RAW_MATERIAL = 'UPDATE_RAW_MATERIAL',
  DELETE_RAW_MATERIAL = 'DELETE_RAW_MATERIAL',
  ADD_RAW_MATERIAL_CONVERSION = 'ADD_RAW_MATERIAL_CONVERSION',
  EXECUTE_RECIPE = 'EXECUTE_RECIPE',
  UPDATE_EXECUTION_YIELD = 'UPDATE_EXECUTION_YIELD',
  DELETE_EXECUTION = 'DELETE_EXECUTION',
  REGISTER_EMPLOYEE = 'REGISTER_EMPLOYEE',
  UPDATE_EMPLOYEE_ROLE = 'UPDATE_EMPLOYEE_ROLE',
  REMOVE_EMPLOYEE = 'REMOVE_EMPLOYEE',
}

@Entity()
export class ActivityLog {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Subscription, { nullable: false, onDelete: 'CASCADE' })
  subscription: Subscription;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  user: User;

  @Column({ nullable: true })
  userName: string; // Snapshot of the user's name at the time of action (e.g. "ישראל ישראלי")

  @Column({
    type: 'enum',
    enum: ActivityAction,
  })
  action: ActivityAction;

  @Column({
    type: 'enum',
    enum: ActivityCategory,
    default: ActivityCategory.WORK_MANAGEMENT,
  })
  category: ActivityCategory;

  @Column({ type: 'text', nullable: true })
  details: string; // Hebrew human-readable description of what changed

  @CreateDateColumn()
  createdTime: Date;
}

