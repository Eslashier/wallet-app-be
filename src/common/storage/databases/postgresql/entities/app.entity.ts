import {
  Column,
  Entity,
  Index,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { v4 as uuid } from 'uuid';
import { ClientEntity } from './client.entity';

@Index('pkapp', ['id'], { unique: true })
@Index('app_cli_id_Idx', ['clientId'], { unique: true })
@Entity('app', { schema: 'public' })
export class AppEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'app_id' })
  id: string = uuid();

  @Column('uuid', { name: 'cli_id' })
  clientId: string;

  @Column('character varying', {
    name: 'app_color',
    length: 30,
    default: () => "'default'",
  })
  color: string;

  @Column('timestamp without time zone', {
    name: 'app_created_at',
    default: () => 'now()',
  })
  createdDate: Date;

  @Column('timestamp without time zone', {
    name: 'app_updated_at',
    nullable: true,
  })
  updatedDate: Date | null;

  @OneToOne(() => ClientEntity, (client) => client.app, {
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn([{ name: 'cli_id', referencedColumnName: 'id' }])
  client: ClientEntity;
}
