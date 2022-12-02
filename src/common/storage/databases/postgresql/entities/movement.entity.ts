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

@Index(
  'movement_acc_id_income_acc_id_outcome_Idx',
  ['incomeAccountId', 'outcomeAccountId'],
  {},
)
@Index('pkmovement', ['id'], { unique: true })
@Entity('movement', { schema: 'public' })
export class MovementEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'mov_id' })
  id: string = uuid();

  @Column('uuid', { name: 'acc_id_income' })
  incomeAccountId: string;

  @Column('uuid', { name: 'acc_id_outcome' })
  outcomeAccountId: string;

  @Column('character varying', { name: 'mov_reason', length: 500 })
  reason: string;

  @Column('bigint', { name: 'mov_amount' })
  amount: string;

  @Column('integer', { name: 'mov_fees', default: () => '1' })
  fees: number;

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
}
