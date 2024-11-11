import { Types, FilterQuery, QueryOptions, SaveOptions } from 'mongoose';

export interface IRepository<T> {
  create(doc: Partial<T>, saveOptions?: SaveOptions): Promise<T>;

  findOne(filter: FilterQuery<T>, options?: QueryOptions): Promise<T>;

  findById(id: Types.ObjectId, options?: QueryOptions): Promise<T>;

  findAll(filter: FilterQuery<T>, options?: QueryOptions): Promise<T[]>;

  updateOne(filter: FilterQuery<T>, update: Partial<T>, options?: QueryOptions): Promise<T>;

  delete(filter: FilterQuery<T>, options?: QueryOptions): Promise<T>;
}
