import { Controller, Post } from "@nestjs/common";
import { UsersService } from "./users.service";
import { LoggingInterceptor } from "src/common/typeorm/logging.interceptor";

@Controller("users")
export class UsersController {
  constructor(private readonly _usersService: UsersService) {}

  @Post()
  @LoggingInterceptor()
  create() {
    return this._usersService.createOne({ name: "Daniel" });
  }
}
