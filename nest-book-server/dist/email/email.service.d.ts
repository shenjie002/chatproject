import { ConfigService } from '@nestjs/config';
import { Transporter } from 'nodemailer';
export declare class EmailService {
    private configService;
    transporter: Transporter;
    constructor(configService: ConfigService);
    sendMail({ to, subject, html }: {
        to: any;
        subject: any;
        html: any;
    }): Promise<void>;
}
