import { Logger } from '@nestjs/common';
import {
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { TypeormCrudTypeMap } from './crud-type-map.interface';
import { TypeormCrudRepository } from './crud-repository.interface';
import { LoggingInterceptor } from './logging.interceptor';

export class Entity {
  id!: string;
}

export class TypeormCrudService<
  E extends Entity,
  T extends TypeormCrudTypeMap<E>,
> implements TypeormCrudRepository<E, T>
{
  private readonly _logger: Logger = new Logger();
  constructor(private readonly _repository: Repository<E>) {}

  @LoggingInterceptor()
  async createOne(
    dto: T['createOne']['dto'],
  ): Promise<T['createOne']['output']> {
    const entity: E = this._repository.create(dto);
    return this._repository.save(entity);
  }

  @LoggingInterceptor()
  async createMany(
    dtos: T['createMany']['dtos'],
  ): Promise<T['createMany']['output']> {
    const entities: E[] = dtos.map((dto) => this._repository.create(dto));
    return Promise.all(
      entities.map((entity: E) => this._repository.save(entity)),
    );
  }

  @LoggingInterceptor()
  async findOne(
    findOptions: FindOneOptions<E>,
  ): Promise<T['findOne']['output'] | null> {
    return this._repository.findOne(findOptions);
  }

  @LoggingInterceptor()
  async findMany(
    findOptions: FindManyOptions<E>,
  ): Promise<T['findMany']['output']> {
    return this._repository.find(findOptions);
  }

  @LoggingInterceptor()
  async updateOne(
    findOptions: FindOptionsWhere<E>,
    dto: T['updateOne']['dto'],
  ): Promise<T['updateOne']['output'] | null> {
    const entity: E = await this.findOne({
      where: findOptions,
    });

    if (!entity?.id) {
      return null;
    }

    await this._repository.update({ id: entity?.id }, dto);

    return this.findOne({ where: findOptions });
  }

  async updateMany(
    findOptions: FindOptionsWhere<E>,
    dto: T['updateMany']['dto'],
  ): Promise<T['updateMany']['output']> {
    throw new Error('Method not implemented.');
  }

  async removeOne(
    findOptions: FindOptionsWhere<E>,
  ): Promise<T['removeOne']['output'] | null> {
    const entity: E = await this.findOne({
      where: findOptions,
    });

    if (!entity?.id) {
      return null;
    }

    await this._repository.remove(entity).then(() => {
      this._logger.verbose(
        `[Step] => ${JSON.stringify({ findOptions, id: entity.id })}`,
      );
    });

    return this.findOne({ where: findOptions });
  }

  async removeMany(
    removeOptions: FindOptionsWhere<E>,
  ): Promise<T['removeMany']['output']> {
    throw new Error('Method not implemented.');
  }
}
