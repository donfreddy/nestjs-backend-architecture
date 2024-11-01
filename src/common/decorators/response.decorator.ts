import {
  applyDecorators,
  ClassSerializerInterceptor,
  HttpCode,
  HttpStatus,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { IMessage } from '../interfaces';
import { ApiResponseInterceptor } from '../interceptors/api-response.interceptor';
import { HttpExceptionFilter } from '../exceptions';
import { ApiPaginatedResponseInterceptor } from '../interceptors/api-paginated-response.interceptor';

export type IAuthApplyDecorator = <TFunction extends (...args: any[]) => any, Y>(
  target: Record<string, any> | TFunction,
  propertyKey?: string | symbol,
  descriptor?: TypedPropertyDescriptor<Y>,
) => void;

export function ApiResponse(msg: IMessage, httpCode?: HttpStatus): IAuthApplyDecorator {
  return applyDecorators(
    UseInterceptors(ClassSerializerInterceptor, ApiResponseInterceptor(msg)),
    HttpCode(httpCode),
    UseFilters(HttpExceptionFilter),
  );
}

export function ApiPaginatedResponse(msg: IMessage, httpCode?: HttpStatus): IAuthApplyDecorator {
  return applyDecorators(
    UseInterceptors(ClassSerializerInterceptor, ApiPaginatedResponseInterceptor(msg)),
    HttpCode(httpCode),
    UseFilters(HttpExceptionFilter),
  );
}
