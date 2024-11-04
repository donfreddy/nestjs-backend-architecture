import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Response } from 'express';
import { StatusCode } from '../../helpers';
import { I18nService } from 'nestjs-i18n';
import { IMessage } from '../../interfaces';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly i18n: I18nService) {}

  async catch(exception: HttpException, host: ArgumentsHost): Promise<void> {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const lang = (ctx.getRequest().i18nLang as string) ?? 'en';
    const status = exception.getStatus();
    let message = exception.getResponse() as IMessage;
    const statusCode = status == 401 ? StatusCode.INVALID_ACCESS_TOKEN : StatusCode.FAILURE;

    if (message.key) {
      console.log(lang);
      message = await this.i18n.translate(message.key, { lang, args: message.args });
      response.status(status).json({
        status_code: statusCode,
        message: message,
      });
    } else {
      response.status(status).json({
        status_code: statusCode,
        message: exception.message,
      });
    }
  }
}
