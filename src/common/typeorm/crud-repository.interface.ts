import {
  DeepPartial,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
} from "typeorm";
import { Entity } from "./crud-service";

export interface TypeormCrudRepository<
  E extends Entity,
> {
  findOne(
    findOptions: FindOneOptions<E>,
    options?: unknown,
  ): Promise<E | null>;
  findMany(
    findOptions: FindManyOptions<E>,
    options?: unknown,
  ): Promise<E[]>;
  createOne(
    dto: DeepPartial<E>,
    options?: unknown,
  ): Promise<E | null>;
  createMany(
    dtos: unknown[],
    options?: unknown,
  ): Promise<E[]>;
  updateOne(
    findOptions: FindOptionsWhere<E>,
    dto: DeepPartial<E>,
    options?: unknown,
  ): Promise<E | null>;
  updateMany(
    findOptions: FindOptionsWhere<E>,
    dto: DeepPartial<E>,
    options?: unknown,
  ): Promise<E[]>;
  removeOne(
    findOptions: FindOptionsWhere<E>,
    options?: unknown,
  ): Promise<E | null>;
  removeMany(
    findOptions: FindOptionsWhere<E>,
    options?: unknown,
  ): Promise<E[]>;
}
