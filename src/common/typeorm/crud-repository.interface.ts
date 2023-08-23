import { FindManyOptions, FindOneOptions, FindOptionsWhere } from 'typeorm';
import { TypeormCrudTypeMap } from './crud-type-map.interface';
import { Entity } from './crud-service';

export interface TypeormCrudRepository<
  E extends Entity,
  T extends TypeormCrudTypeMap<E>,
> {
  findOne(
    findOptions: FindOneOptions<E>,
    options?: T['findOne']['options'],
  ): Promise<T['findOne']['output'] | null>;
  findMany(
    findOptions: FindManyOptions<E>,
    options?: T['findMany']['options'],
  ): Promise<T['findMany']['output']>;
  createOne(
    dto: T['createOne']['dto'],
    options?: T['createOne']['options'],
  ): Promise<T['createOne']['output'] | null>;
  createMany(
    dtos: T['createMany']['dtos'],
    options?: T['createMany']['options'],
  ): Promise<T['createMany']['output']>;
  updateOne(
    findOptions: FindOptionsWhere<E>,
    dto: T['updateOne']['dto'],
    options?: T['updateOne']['options'],
  ): Promise<T['updateOne']['output'] | null>;
  updateMany(
    findOptions: FindOptionsWhere<E>,
    dto: T['updateMany']['dto'],
    options?: T['updateMany']['options'],
  ): Promise<T['updateMany']['output']>;
  removeOne(
    findOptions: FindOptionsWhere<E>,
    options?: T['removeOne']['options'],
  ): Promise<T['removeOne']['output'] | null>;
  removeMany(
    removeOptions: FindOptionsWhere<E>,
    options?: T['removeMany']['options'],
  ): Promise<T['removeMany']['output']>;
}
