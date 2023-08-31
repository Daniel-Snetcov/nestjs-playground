import { TypeormCrudTypeMap } from "src/common/typeorm/crud-type-map.interface";
import { UserEntity } from "./user.entity";
import { DeepPartial } from "typeorm";

export class UserMapping implements TypeormCrudTypeMap<UserEntity> {
  findOne: { output: UserEntity; options?: unknown };
  findMany: { output: UserEntity[]; options?: unknown };
  createOne: {
    dto: DeepPartial<UserEntity>;
    output: UserEntity;
    options?: unknown;
  };
  createMany: {
    dto: DeepPartial<UserEntity>;
    output: UserEntity[];
    options?: unknown;
  };
  updateOne: {
    dto: DeepPartial<UserEntity>;
    output: UserEntity;
    options?: unknown;
  };
  updateMany: {
    dto: DeepPartial<UserEntity>;
    output: UserEntity[];
    options?: unknown;
  };
  removeOne: { output: UserEntity; options?: unknown };
  removeMany: { output: UserEntity[]; options?: unknown };
}
