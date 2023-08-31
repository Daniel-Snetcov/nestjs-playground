import { DeepPartial } from "typeorm";
import { Entity } from "./crud-service";

export interface TypeormCrudTypeMap<E extends Entity> {
  findOne: {
    output: E;
    options?: unknown;
  };
  findMany: {
    output: E[];
    options?: unknown;
  };
  createOne: {
    dto: DeepPartial<E>;
    output: E;
    options?: unknown;
  };
  createMany: {
    dto: DeepPartial<E>;
    output: E[];
    options?: unknown;
  };
  updateOne: {
    dto: DeepPartial<E>;
    output: E;
    options?: unknown;
  };
  updateMany: {
    dto: DeepPartial<E>;
    output: E[];
    options?: unknown;
  };
  removeOne: {
    output: E;
    options?: unknown;
  };
  removeMany: {
    output: E[];
    options?: unknown;
  };
}
