import { Column } from 'typeorm';
import { UpdateAppReceiverDto } from './update-app-receiver.dto';

export class UpdateAppDto {
  color: string;
  @Column('timestamp without time zone', {
    name: 'cli_created_at',
    default: () => 'now()',
  })
  updatedDate: Date;
  constructor(app: UpdateAppReceiverDto) {
    this.color = app?.color;
  }
}
