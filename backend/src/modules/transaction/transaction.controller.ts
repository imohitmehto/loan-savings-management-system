// import {
//   Controller,
//   Post,
//   Body,
//   Get,
//   Req,
//   Param,
//   Delete,
//   Put,
//   UseGuards,
//   HttpCode,
//   HttpStatus,
// } from "@nestjs/common";
// import { TransactionService } from "./transaction.service";
// import { CreateTransactionDto } from "./dtos";
// import { Roles } from "../auth/decorators/roles.decorator";
// import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
// import { RolesGuard } from "../auth/guards/roles.guard";
// import { Role } from "@prisma/client";

// @Controller("transaction")
// @UseGuards(JwtAuthGuard, RolesGuard)
// export class TransactionController {
//   constructor(private readonly transactionService: TransactionService) {}

//   @Post("create")
//   @Roles(Role.ADMIN, Role.CUSTOMER)
//   @HttpCode(HttpStatus.OK)
//   // @FormDataRequest()
//   async create(@Body() dto: CreateTransactionDto, @Req() req: any) {
//     return this.transactionService.createTransaction(dto, req.user.id);
//   }

//   @Get("get")
//   @Roles(Role.ADMIN)
//   @HttpCode(HttpStatus.OK)
//   async getAll() {
//     return this.transactionService.getAllTransactions();
//   }

//   @Get(":id")
//   @Roles(Role.ADMIN, Role.CUSTOMER)
//   @HttpCode(HttpStatus.OK)
//   async getById(@Param("id") id: string, @Req() req: any) {
//     return this.transactionService.getTransactionById(id, req.user);
//   }

//   @Delete(":id")
//   @Roles(Role.ADMIN)
//   @HttpCode(HttpStatus.OK)
//   // @FormDataRequest()
//   async delete(@Param("id") id: string, @Req() req: any) {
//     return this.transactionService.deleteTransaction(id, req.user);
//   }

//   // @Put(":id")
//   //   @Roles(Role.ADMIN)
//   // @FormDataRequest()
//   // @HttpCode(HttpStatus.OK)
//   // async update(
//   //   @Param("id") id: string,
//   //   @Body() dto: UpdateTransactionDto,
//   //   @Req() req: any,
//   // ) {
//   //   return this.transactionService.updateTransaction(id, dto, req.user);
//   // }

//   @Get("/account/:accountId")
//   @Roles(Role.ADMIN, Role.CUSTOMER)
//   @HttpCode(HttpStatus.OK)
//   async getAllByAccount(
//     @Param("accountId") accountId: string,
//     @Req() req: any,
//   ) {
//     return this.transactionService.getTransactionsByAccount(
//       accountId,
//       req.user,
//     );
//   }
// }
