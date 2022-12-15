import { Field, Int, ObjectType } from '@nestjs/graphql';
import { CreateMovementDto } from '../../../dto/movement/create-movement.dto';

import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { v4 as uuid } from 'uuid';
import { AccountEntity } from './account.entity';

@ObjectType()
@Index(
  'movement_acc_id_income_acc_id_outcome_Idx',
  ['incomeAccountId', 'outcomeAccountId'],
  {},
)
@Index('pkmovement', ['id'], { unique: true })
@Entity('movement', { schema: 'public' })
export class MovementEntity {
  @Field(() => String)
  @PrimaryGeneratedColumn('uuid', { name: 'mov_id' })
  id: string = uuid();

  @Field(() => String)
  @Column('uuid', { name: 'acc_id_income' })
  incomeAccountId: string;

  @Field(() => String)
  @Column('uuid', { name: 'acc_id_outcome' })
  outcomeAccountId: string;

  @Field(() => String)
  @Column('character varying', { name: 'mov_reason', length: 500 })
  reason: string;

  @Field(() => String)
  @Column('bigint', { name: 'mov_amount' })
  amount: string;

  @Field(() => Int)
  @Column('integer', { name: 'mov_fees', default: () => '0' })
  fees: number;

  @Field(() => Date)
  @Column('timestamp without time zone', {
    name: 'mov_datetime',
    default: () => 'now()',
  })
  dateTime: Date;

  @ManyToOne(() => AccountEntity, (account) => account.incomes, {
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn([{ name: 'acc_id_income', referencedColumnName: 'id' }])
  income: AccountEntity;

  @ManyToOne(() => AccountEntity, (account) => account.outcomes, {
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn([{ name: 'acc_id_outcome', referencedColumnName: 'id' }])
  outcome: AccountEntity;

  constructor(movement: CreateMovementDto) {
    this.incomeAccountId = movement?.incomeAccountId;
    this.outcomeAccountId = movement?.outcomeAccountId;
    this.reason = movement?.reason;
    this.amount = movement?.amount;
    this.fees = movement?.fees;
  }
}
