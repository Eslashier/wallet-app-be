import { UpdateAppReceiverDto } from './update-app-receiver.dto';

export class UpdateAppDto {
  color: string;
  updatedDate?: Date;

  constructor(app: UpdateAppReceiverDto) {
    this.color = app?.color;
    this.updatedDate = new Date();
  }
}
