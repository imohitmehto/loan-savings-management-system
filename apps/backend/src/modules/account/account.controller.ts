import { Body, Controller, HttpCode, Post } from "@nestjs/common";
import { AccountService } from "./account.service";
import { CreateAccountDto } from "./dtos/create-account.dto";

@Controller("account")
export class AccountController {

    constructor(private readonly accountservice: AccountService) { }

    @Post("create")
    @HttpCode(200)
    create(@Body() dto: CreateAccountDto) {
        return this.accountservice.createAccount(dto);
    }
}
