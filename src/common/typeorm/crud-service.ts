import {
  DeepPartial,
  FindManyOptions,
  FindOneOptions,
  FindOptionsSelect,
  FindOptionsWhere,
  In,
  Repository,
} from "typeorm";
import { TypeormCrudRepository } from "./crud-repository.interface";
import { LoggingInterceptor } from "./logging.interceptor";

export interface Entity {
  id: string;
}

export class TypeormCrudService<
  E extends Entity,
> implements TypeormCrudRepository<E> {
  constructor(
    private readonly _repository: Repository<E>,
  ) {}

  @LoggingInterceptor()
  async createOne(
    dto: DeepPartial<E>,
  ): Promise<E> {
    const entity: E = this._repository.create(dto);
    return this._repository.save(entity);
  }

  @LoggingInterceptor()
  async createMany(
    dtos: DeepPartial<E>[],
  ): Promise<E[]> {
    const entities: E[] = dtos.map((dto) => this._repository.create(dto));
    return Promise.all(
      entities.map((entity: E) => this._repository.save(entity)),
    );
  }

  @LoggingInterceptor()
  async findOne(
    findOptions: FindOneOptions<E>,
  ): Promise<E | null> {
    return this._repository.findOne(findOptions);
  }

  @LoggingInterceptor()
  async findMany(
    findOptions: FindManyOptions<E>,
  ): Promise<E[]> {
    return this._repository.find(findOptions);
  }

  @LoggingInterceptor()
  async updateOne(
    findOptions: FindOptionsWhere<E>,
    dto: DeepPartial<E>,
  ): Promise<E | null> {
    const entity: E = await this.findOne({
      where: findOptions,
    });

    if (!entity?.id) {
      return null;
    }

    await this._repository.update(
      { id: entity.id } as FindOptionsWhere<E>,
      dto as Partial<E>,
    );

    return this.findOne({ where: { id: entity.id } as FindOptionsWhere<E> });
  }

  @LoggingInterceptor()
  async updateMany(
    findOptions: FindOptionsWhere<E>,
    dto: DeepPartial<E>,
  ): Promise<E[]> {
    const entities: E[] = await this.findMany({
      where: findOptions,
      select: { id: true } as FindOptionsSelect<E>,
    });

    const ids = entities.map(({ id }) => id);

    await this._repository.update(
      ids,
      dto as Partial<E>,
    );

    return this.findMany({ where: { id: In(ids) } as FindOptionsWhere<E> });
  }

  @LoggingInterceptor()
  async removeOne(
    findOptions: FindOptionsWhere<E>,
  ): Promise<E | null> {
    const entity: E = await this.findOne({
      where: findOptions,
    });

    if (!entity?.id) {
      return null;
    }

    await this._repository.remove(entity);

    return entity;
  }

  @LoggingInterceptor()
  async removeMany(
    findOptions: FindOptionsWhere<E>,
  ): Promise<E[]> {
    const entities: E[] = await this.findMany({
      where: findOptions,
    });

    await this._repository.remove(
      entities,
    );

    return entities;
  }
}
