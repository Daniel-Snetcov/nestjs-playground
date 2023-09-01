import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { UserEntity } from "./user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { TypeormCrudService } from "src/common/typeorm/crud-service";

@Injectable()
export class UsersService extends TypeormCrudService<UserEntity> {
  constructor(
    @InjectRepository(UserEntity) private readonly _userRepository: Repository<
      UserEntity
    >,
  ) {
    super(_userRepository);
  }
}
