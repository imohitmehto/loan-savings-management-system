import { Controller, Post, Body, Get, Query, Req } from "@nestjs/common";
import { TransactionService } from "./transaction.service";
import { CreateTransactionDto } from "./dtos";

@Controller("transactions")
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  async create(@Body() dto: CreateTransactionDto, @Req() req: any) {
    return this.transactionService.createTransaction(dto, req.user.id);
  }

  @Get()
  async getAll() {
    return this.transactionService.getAllTransactions();
  }
}
