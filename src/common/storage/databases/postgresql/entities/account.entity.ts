import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { v4 as uuid } from 'uuid';
import { ClientEntity } from './client.entity';
import { MovementEntity } from './movement.entity';

@ObjectType()
@Index('pkaccount', ['id'], { unique: true })
@Index('account_cli_id_Idx', ['clientId'], { unique: true })
@Entity('account', { schema: 'public' })
export class AccountEntity {
  @Field(() => String)
  @PrimaryGeneratedColumn('uuid', { name: 'acc_id' })
  id: string = uuid();

  @Field(() => String)
  @Column('uuid', { name: 'cli_id' })
  clientId: string;

  @Field(() => String)
  @Column('bigint', { name: 'acc_balance', default: () => '0' })
  balance: string;

  @Field(() => String)
  @Column('bigint', { name: 'acc_credit', default: () => '50000000' })
  credit: string;

  @Field(() => Int)
  @Column('integer', { name: 'acc_state', default: () => '1' })
  state: number;

  @Field(() => Date)
  @Column('timestamp without time zone', {
    name: 'acc_created_at',
    default: () => 'now()',
  })
  createdDate: Date;

  @Field(() => Date, { nullable: true })
  @Column('timestamp without time zone', {
    name: 'acc_updated_at',
    nullable: true,
  })
  updatedDate: Date | null;

  @Field(() => Date, { nullable: true })
  @Column('timestamp without time zone', {
    name: 'acc_deleted_at',
    nullable: true,
  })
  deletedDate: Date | null;

  @OneToOne(() => ClientEntity, (client) => client.account, {
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn([{ name: 'cli_id', referencedColumnName: 'id' }])
  client: ClientEntity;

  @OneToMany(() => MovementEntity, (movement) => movement.income)
  @JoinColumn([{ name: 'acc_id', referencedColumnName: 'acc_id_income' }])
  incomes: MovementEntity[];

  @OneToMany(() => MovementEntity, (movement) => movement.outcome)
  @JoinColumn([{ name: 'acc_id', referencedColumnName: 'acc_id_outcome' }])
  outcomes: MovementEntity[];
}
