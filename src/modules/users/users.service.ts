import { Injectable} from "@nestjs/common";
import { Repository } from "typeorm";
import { UserEntity } from "./user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { TypeormCrudService } from "src/common/typeorm/crud-service";
import { UserMapping } from "./user.mapping";

@Injectable()
export class UsersService extends TypeormCrudService<UserEntity, UserMapping> {
  constructor(
    @InjectRepository(UserEntity) private readonly _userRepository: Repository<
      UserEntity
    >,
  ) {
    super(_userRepository);
  }
}
