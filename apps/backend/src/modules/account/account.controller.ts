import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { CreateAccountDto } from "./dtos";
import { AccountService } from "./account.service";
// import { UpdateAccountDto } from './dto/update-account.dto';

@Controller("account")
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Get("get")
  getAll() {
    return this.accountService.getAllAccounts();
  }

  @Get("get/:id")
  getOne(@Param("id") id: string) {
    return this.accountService.getAccountById(id);
  }

  @Post("create")
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateAccountDto) {
    return this.accountService.createAccount(dto);
  }

  // @Patch("update/:id")
  // update(
  //   @Param("id") id: string,
  //   @Body() dto: UpdateAccountDto,
  // ) {
  //   return this.accountService.updateAccount(id, dto);
  // }

  // @Delete('delete/:id')
  // remove(@Param('id') id: string) {
  //   return this.accountService.remove(id);
  // }
}
