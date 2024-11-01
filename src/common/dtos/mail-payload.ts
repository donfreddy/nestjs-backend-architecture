export class MailPayload {
  to: string;
  subject: string;
  template: string;
  props?: {
    [name: string]: any;
  };
}
