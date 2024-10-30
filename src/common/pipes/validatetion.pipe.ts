import { Injectable, PipeTransform, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class ValidationPipe implements PipeTransform {
  async transform(value: any, { metatype: metaType }: ArgumentMetadata) {
    // Check if is empty
    if (value instanceof Object && this.isEmpty(value)) {
      throw new BadRequestException('Validation failed: No body submitted');
    }

    // destructuring metadata
    if (!metaType || !this.toValidate(metaType)) {
      return value;
    }

    const object = plainToInstance(metaType, value);

    const rawErrors: Record<string, any>[] = await validate(object);
    if (rawErrors.length > 0) {
      throw new BadRequestException(`${this.formatErrors(rawErrors)}`);
    }
    return value;
  }

  private toValidate(metaType: any): boolean {
    const types = [String, Boolean, Number, Array, Object];
    return !types.includes(metaType);
  }

  private formatErrors(errors: any[]) {
    return errors
      .map((err) => {
        const messages = [];
        for (const property in err.constraints) {
          messages.push(err.constraints[property]);
        }
        return messages.join(', ');
      })
      .join(', ');
  }

  private isEmpty(value: any) {
    return Object.keys(value).length <= 0;
  }
}
