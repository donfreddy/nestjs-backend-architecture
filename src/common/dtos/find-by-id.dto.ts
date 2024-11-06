import { IsMongoId } from 'class-validator';

export class FindByIdDto {
  @IsMongoId()
  readonly id: string;
}
