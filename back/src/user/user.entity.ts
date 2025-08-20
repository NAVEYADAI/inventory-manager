import { Password } from 'src/password/password.entity';
import { UserPermission } from 'src/use-permissions/use-permission.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  address: string;

  @Column()
  phone: string;

  @Column()
  email: string;

  @OneToMany(() => UserPermission, (userPremission) => userPremission.id)
  userPremission: UserPermission;

  @OneToMany(() => Password, (password) => password.id)
  password: Password;
}
