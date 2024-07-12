import {
  Controller,
  Post,
  Body,
  ForbiddenException,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { EmailService } from './email.service';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';
import { AppClsStore, UserRole } from 'src/Types/users.types';
import { UsersService } from 'src/users/users.service';
import { AuthGuard } from '@nestjs/passport';
import { ClsService } from 'nestjs-cls';
import { SendInventoryReportDto } from './dto/send-Inventory-report.dto';

@ApiTags('email')
@Controller({ path: 'email', version: '1' })
export class EmailController {
  constructor(
    private readonly emailService: EmailService,
    private readonly clsService: ClsService,
    private readonly usersService: UsersService,
  ) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Send inventory report to merchants' })
  @ApiBody({
    type: SendInventoryReportDto,
    examples: {
      example1: {
        summary: 'Sample request',
        value: {
          itemName: 'Product A',
          quantity: 100,
          emails: 'merchant1@example.com,merchant2@example.com',
        },
      },
    },
  })
  @Post('send-inventory-report')
  async sendInventoryReport(
    @Body() sendInventoryReportDto: SendInventoryReportDto,
  ): Promise<{ sentCount: number; failedEmails: string[] }> {
    const { itemName, quantity, emails } = sendInventoryReportDto;

    const context = this.clsService.get<AppClsStore>();
    if (!context || !context.user) {
      throw new NotFoundException('User not found');
    }
    const UserId = parseInt(context.user.id, 10);
    const user = await this.usersService.findOne({ id: UserId });
    if (user.role !== UserRole.ADMIN && user.role !== UserRole.MANAGER) {
      throw new ForbiddenException(
        'You are not authorized to perform this action',
      );
    }

    // Split and trim emails
    const emailList = emails.split(',').map((email) => email.trim());

    const result = await this.emailService.sendInventoryReport(
      emailList,
      itemName,
      quantity,
    );
    return { sentCount: result.sentCount, failedEmails: result.failedEmails };
  }
}
