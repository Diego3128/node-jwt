import { Resend } from "resend";
import { CustomError } from "../../../domain";

export interface SendMailOptions {
  to: string | string[];
  subject: string;
  htmlBody: string;
  attachements?: Attachement[];
}

export interface Attachement {
  filename: string;
  path: string;
}

export class EmailService {
  constructor(
    private readonly RESENDAPIKEY: string,
    private readonly RESENDTESTEMAIL: string
  ) {}

  async sendEmail(options: SendMailOptions): Promise<boolean> {
    const { to, subject, htmlBody, attachements = [] } = options;
    const resend = new Resend(this.RESENDAPIKEY);
    const { data, error } = await resend.emails.send({
      from: `node-auth <${this.RESENDTESTEMAIL}>`,
      to: to,
      subject: subject,
      html: htmlBody,
    });

    if (error)throw CustomError.internalServer("Authentication email not sent");
    return true;
  }
}
