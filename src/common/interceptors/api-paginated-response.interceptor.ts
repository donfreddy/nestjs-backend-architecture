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
import { ApiPaginatedResponse, IMessage } from '../interfaces';
import { StatusCode } from '../helpers';
import { I18nService } from 'nestjs-i18n';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';

type InterceptApiPaginatedResponse<T> = NestInterceptor<T, ApiPaginatedResponse<T>>;

export function ApiPaginatedResponseInterceptor<T>(
  msg: IMessage,
): Type<InterceptApiPaginatedResponse<T>> {
  @Injectable()
  class ApiPaginatedResponseInterceptorMixin implements InterceptApiPaginatedResponse<T> {
    constructor(private readonly i18n: I18nService) {}

    async intercept(
      context: ExecutionContext,
      next: CallHandler,
    ): Promise<Observable<ApiPaginatedResponse<T>>> {
      const ctx: HttpArgumentsHost = context.switchToHttp();
      const lang = ctx.getRequest().i18nLang;
      const message = await this.i18n.t(msg.key || 'common.success', {
        lang,
        args: msg.args,
      });

      return next.handle().pipe(
        map((data: ApiPaginatedResponse<T>) => ({
          success: true,
          status_code: StatusCode.SUCCESS,
          message: message,
          items: data.items,
          meta: data.meta,
          links: data.links,
        })),
      );
    }
  }

  return mixin(ApiPaginatedResponseInterceptorMixin);
}
