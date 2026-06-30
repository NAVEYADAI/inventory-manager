import { Company } from 'src/company/company.entity';
import { User } from 'src/user/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

export enum PermissionRole {
  OWNER = 'owner',
  ADMIN = 'admin',
  EDITOR = 'editor',
  VIEWER = 'viewer',
}
@Entity()
export class UserPermission {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.id)
  user: User;

  @ManyToOne(() => Company, (company) => company.id)
  company: Company;

  @Column({
    type: 'enum',
    enum: PermissionRole,
    default: PermissionRole.EDITOR,
  })
  role: PermissionRole;
}
