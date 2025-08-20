import {
  Controller,
  Post,
  Body,
  Get,
  Req,
  Param,
  Delete,
  Put,
  UseGuards,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { TransactionService } from "./transaction.service";
import { CreateTransactionDto } from "./dtos";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { FormDataRequest } from "nestjs-form-data";

@Controller("transaction")
@UseGuards(JwtAuthGuard, RolesGuard)
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post("create")
  @Roles("CUSTOMER", "ADMIN")
  @HttpCode(HttpStatus.OK)
  @FormDataRequest()
  async create(@Body() dto: CreateTransactionDto, @Req() req: any) {
    return this.transactionService.createTransaction(dto, req.user.id);
  }

  @Get("get")
  @Roles("ADMIN")
  @HttpCode(HttpStatus.OK)
  async getAll() {
    return this.transactionService.getAllTransactions();
  }

  @Get(":id")
  @Roles("CUSTOMER", "ADMIN")
  @HttpCode(HttpStatus.OK)
  async getById(@Param("id") id: string, @Req() req: any) {
    return this.transactionService.getTransactionById(id, req.user);
  }

  @Delete(":id")
  @Roles("ADMIN")
  @HttpCode(HttpStatus.OK)
  @FormDataRequest()
  async delete(@Param("id") id: string, @Req() req: any) {
    return this.transactionService.deleteTransaction(id, req.user);
  }

  // @Put(":id")
  // @Roles("ADMIN")
  // @FormDataRequest()
  // @HttpCode(HttpStatus.OK)
  // async update(
  //   @Param("id") id: string,
  //   @Body() dto: UpdateTransactionDto,
  //   @Req() req: any,
  // ) {
  //   return this.transactionService.updateTransaction(id, dto, req.user);
  // }

  @Get("/account/:accountId")
  @Roles("CUSTOMER", "ADMIN")
  @HttpCode(HttpStatus.OK)
  async getAllByAccount(
    @Param("accountId") accountId: string,
    @Req() req: any,
  ) {
    return this.transactionService.getTransactionsByAccount(
      accountId,
      req.user,
    );
  }
}
