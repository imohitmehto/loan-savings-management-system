import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { CreateAccountDto } from './dtos/create-account.dto';
import { nanoid } from 'nanoid';

@Injectable()
export class AccountService {
    constructor(private readonly prisma: PrismaService) { }

    async createAccount(dto: CreateAccountDto) {
        const user = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });

        const accountNumber = this.generateAccountNumber();
        const account = await this.prisma.account.create({
            data: {
                accountNumber: accountNumber,
                name: dto.name,
                // type: dto.type,
                balance: dto.balance || 0,
                status: 'active',
                userId: dto.userId,
                groupId: dto.groupId || null,
                addresses: dto.address
                    ? {
                        create: {
                            line1: dto.address,
                        },
                    }
                    : undefined,
            },
        });

        return account;
    }

    private generateAccountNumber(): string {
        // You can use a more secure/random logic here
        return 'SMS' + nanoid(5).toUpperCase(); // Example: SMS7654
    }
}
