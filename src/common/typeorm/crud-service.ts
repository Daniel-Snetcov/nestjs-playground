import {
  FindManyOptions,
  FindOneOptions,
  FindOptionsSelect,
  FindOptionsWhere,
  In,
  Repository,
} from "typeorm";
import { TypeormCrudTypeMap } from "./crud-type-map.interface";
import { TypeormCrudRepository } from "./crud-repository.interface";
import { LoggingInterceptor } from "./logging.interceptor";

export interface Entity {
  id: string;
}

export class TypeormCrudService<
  E extends Entity,
  T extends TypeormCrudTypeMap<E>,
> implements TypeormCrudRepository<E, T> {
  constructor(
    private readonly _repository: Repository<E>,
  ) {}

  @LoggingInterceptor()
  async createOne(
    dto: T["createOne"]["dto"],
  ): Promise<T["createOne"]["output"]> {
    const entity: E = this._repository.create(dto);
    return this._repository.save(entity);
  }

  @LoggingInterceptor()
  async createMany(
    dtos: T["createMany"]["dto"][],
  ): Promise<T["createMany"]["output"]> {
    const entities: E[] = dtos.map((dto) => this._repository.create(dto));
    return Promise.all(
      entities.map((entity: E) => this._repository.save(entity)),
    );
  }

  @LoggingInterceptor()
  async findOne(
    findOptions: FindOneOptions<E>,
  ): Promise<T["findOne"]["output"] | null> {
    return this._repository.findOne(findOptions);
  }

  @LoggingInterceptor()
  async findMany(
    findOptions: FindManyOptions<E>,
  ): Promise<T["findMany"]["output"]> {
    return this._repository.find(findOptions);
  }

  @LoggingInterceptor()
  async updateOne(
    findOptions: FindOptionsWhere<E>,
    dto: T["updateOne"]["dto"],
  ): Promise<T["updateOne"]["output"] | null> {
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
    dto: T["updateMany"]["dto"],
  ): Promise<T["updateMany"]["output"]> {
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
  ): Promise<T["removeOne"]["output"] | null> {
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
  ): Promise<T["removeMany"]["output"]> {
    const entities: E[] = await this.findMany({
      where: findOptions,
    });

    await this._repository.remove(
      entities,
    );

    return entities;
  }
}
