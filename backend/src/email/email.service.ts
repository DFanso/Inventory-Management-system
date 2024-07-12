import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import Handlebars from 'handlebars';
import * as juice from 'juice';
import * as fs from 'fs';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter;
  private templateDir = 'src/email/templates';
  private readonly templateExt = '.hbs';

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('BREVO_SMTP'),
      port: this.configService.get<string>('BREVO_SMTP_PORT'),
      secure: false,
      auth: {
        user: this.configService.get<string>('BREVO_USER'),
        pass: this.configService.get<string>('BREVO_PASS'),
      },
    });

    this.templateDir = `${
      fs.existsSync('src') ? 'src' : 'dist'
    }/email/templates`;
    this.logger.verbose(`Template directory: ${this.templateDir}`);
  }

  private async inlineStyles(html: string): Promise<string> {
    return juice(html);
  }

  private readTemplate(templateName: string): string {
    const templatePath = `${this.templateDir}/${templateName}`;
    return fs.readFileSync(templatePath, 'utf8');
  }

  async renderTemplate(
    templateFile: string,
    context: Record<string, unknown>,
  ): Promise<string> {
    const template = Handlebars.compile(this.readTemplate(templateFile));
    const html = template(context);
    return this.inlineStyles(html);
  }

  async sendEmail(to: string, subject: string, html: string): Promise<boolean> {
    const mailOptions = {
      from: this.configService.get<string>('EMAIL_FROM_ADDRESS'),
      to: to,
      subject: subject,
      html: html,
    };

    this.logger.verbose(`Sending email to: ${to}`);

    try {
      const info = await this.transporter.sendMail(mailOptions);
      this.logger.verbose(`Email sent: ${info.messageId}`);
      return true;
    } catch (error) {
      this.logger.error(`Email error: ${error}`);
      return false;
    }
  }

  async sendInventoryReport(
    emails: string[],
    itemName: string,
    quantity: number,
  ): Promise<{ sentCount: number; failedEmails: string[] }> {
    const subject = 'Inventory Report';
    const html = await this.renderTemplate('inventory-report.hbs', {
      itemName,
      quantity,
    });

    let sentCount = 0;
    const failedEmails: string[] = [];

    for (const email of emails) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (emailRegex.test(email)) {
        const success = await this.sendEmail(email, subject, html);
        if (success) {
          sentCount++;
        } else {
          failedEmails.push(email);
        }
      } else {
        this.logger.warn(`Invalid email format: ${email}`);
        failedEmails.push(email);
      }
    }

    return { sentCount, failedEmails };
  }
}
