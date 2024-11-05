import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  mixin,
  Type,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse, IMessage } from '../interfaces';
import { camelToSnakeCase, StatusCode } from '../helpers';
import { I18nService } from 'nestjs-i18n';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';

type InterceptApiResponse<T> = NestInterceptor<T, ApiResponse<T>>;

export function ApiResponseInterceptor<T>(msg: IMessage): Type<InterceptApiResponse<T>> {
  @Injectable()
  class ApiResponseInterceptorMixin implements InterceptApiResponse<T> {
    constructor(private readonly i18n: I18nService) {}

    async intercept(
      context: ExecutionContext,
      next: CallHandler,
    ): Promise<Observable<ApiResponse<T>>> {
      const ctx: HttpArgumentsHost = context.switchToHttp();
      const lang = ctx.getRequest().i18nLang as string;
      const message = (await this.i18n.t(msg.key || 'common.success', {
        lang,
        args: msg.args,
      })) as string;

      return next.handle().pipe(
        map((data: T) => ({
          status_code: StatusCode.SUCCESS,
          message: message,
          data: this.convertToSnakeCase(
            JSON.parse(
              JSON.stringify(data, (_, value) =>
                value && value._bsontype === 'ObjectID' ? value.toString() : value,
              ),
            ),
          ),
        })),
      );
    }

    private convertToSnakeCase(data: any): any {
      if (Array.isArray(data)) {
        return data.map((item) => this.convertToSnakeCase(item));
      } else if (data !== null && typeof data === 'object') {
        const result = {};
        Object.keys(data).forEach((key) => {
          result[camelToSnakeCase(key)] = this.convertToSnakeCase(data[key]);
        });
        return result;
      }
      return data;
    }
  }

  return mixin(ApiResponseInterceptorMixin);
}
