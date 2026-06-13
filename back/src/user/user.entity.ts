import { Password } from '../password/password.entity';
import { UserPermission } from '../use-permissions/use-permission.entity';
import { Subscription } from '../subscription/subscription.entity';
import { Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

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

  @ManyToMany(() => Subscription, (subscription) => subscription.users)
  subscriptions: Subscription[];

  @OneToMany(() => UserPermission, (userPermission) => userPermission.id)
  userPermission: UserPermission;

  @OneToMany(() => Password, (password) => password.id)
  password: Password;
}
