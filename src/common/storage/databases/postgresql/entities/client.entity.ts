import { Field, Int, ObjectType } from '@nestjs/graphql';
import { CreateClientDto } from '../../../dto/client/create-client.dto';

import {
  Column,
  Entity,
  Index,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { v4 as uuid } from 'uuid';
import { AccountEntity } from './account.entity';
import { AppEntity } from './app.entity';

@ObjectType()
@Index('client_cli_email_Idx', ['email'], { unique: true })
@Index('pkclient', ['id'], { unique: true })
@Index('client_cli_phone_Idx', ['phone'], { unique: true })
@Entity('client', { schema: 'public' })
export class ClientEntity {
  @Field(() => String)
  @PrimaryGeneratedColumn('uuid', { name: 'cli_id' })
  id: string = uuid();

  @Field(() => String)
  @Column('character varying', { name: 'cli_full_name', length: 500 })
  fullName: string;

  @Field(() => String)
  @Column('character varying', { name: 'cli_email', length: 500 })
  email: string;

  @Field(() => String)
  @Column('character varying', { name: 'cli_phone', length: 500 })
  phone: string;

  @Field(() => String)
  @Column('character varying', { name: 'cli_photo', length: 500 })
  photo: string;

  @Field(() => Int)
  @Column('integer', { name: 'cli_state', default: () => '1' })
  state: number;

  @Field(() => Date)
  @Column('timestamp without time zone', {
    name: 'cli_created_at',
    default: () => 'now()',
  })
  createdDate: Date;

  @Field(() => Date, { nullable: true })
  @Column('timestamp without time zone', {
    name: 'cli_updated_at',
    nullable: true,
  })
  updatedDate: Date | null;

  @Field(() => Date, { nullable: true })
  @Column('timestamp without time zone', {
    name: 'cli_deleted_at',
    nullable: true,
  })
  deletedDate: Date | null;

  @OneToOne(() => AccountEntity, (account) => account.client, {
    cascade: ['insert'],
  })
  account: AccountEntity;

  @OneToOne(() => AppEntity, (app) => app.client, {
    cascade: ['insert'],
  })
  app: AppEntity;

  constructor(client: CreateClientDto) {
    this.fullName = client?.fullName;
    this.email = client?.email;
    this.phone = client?.phone;
    this.photo = client?.photo;
    this.app = new AppEntity();
    this.account = new AccountEntity();
  }
}
