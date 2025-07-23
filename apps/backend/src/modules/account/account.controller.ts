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

  @Post("create")
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateAccountDto) {
    return this.accountService.createAccount(dto);
  }

  // @Get()
  // findAll() {
  //     return this.accountService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //     return this.accountService.findOne(id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() dto: UpdateAccountDto) {
  //     return this.accountService.update(id, dto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //     return this.accountService.remove(id);
  // }
}
