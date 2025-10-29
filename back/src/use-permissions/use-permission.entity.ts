import { Company } from 'src/company/company.entity';
import { User } from 'src/user/user.entity';
import { Entity, ManyToOne, PrimaryGeneratedColumn, Column } from 'typeorm';

export enum PermissionRole {
  ADMIN = 'admin',
  EDITOR = 'editor',
  VIEWER = 'viewer',
}

@Entity()
export class UserPermission {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.userPermissions)
  user: User;

  @ManyToOne(() => Company)
  company: Company;

  @Column({ type: 'enum', enum: PermissionRole, default: PermissionRole.VIEWER })
  role: PermissionRole;
}
