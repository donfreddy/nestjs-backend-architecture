import { Document, FilterQuery, Model, QueryOptions, SaveOptions, Types } from 'mongoose';
import { IRepository } from '../interfaces/repository.interface';
import { ApiPaginatedResponse, PaginationOpts } from '../interfaces';

export abstract class BaseRepository<T extends Document> implements IRepository<T> {
  protected constructor(private readonly model: Model<T>) {}

  create(doc: Partial<T>, saveOptions?: SaveOptions): Promise<T> {
    const createdEntity: T = new this.model(doc);
    return createdEntity.save(saveOptions);
  }

  findOne(filter: FilterQuery<T>, options?: QueryOptions) {
    return this.model.findOne(filter, null, options);
  }

  findById(id: Types.ObjectId, options?: QueryOptions): Promise<T> {
    return this.model.findById(id, null, options).exec();
  }

  findAll(filter: FilterQuery<T>, options?: QueryOptions) {
    return this.model.find(filter, null, options);
  }

  updateOne(filter: FilterQuery<T>, update: Partial<T>, options?: QueryOptions): Promise<T> {
    return this.model.findOneAndUpdate(filter, update, { new: true, ...options }).exec();
  }

  delete(filter: FilterQuery<T>, options?: QueryOptions): Promise<T> {
    return this.model.findOneAndDelete(filter, options).exec();
  }

  async findWithPagination(
    filter: FilterQuery<T> = {},
    paginationOpts: PaginationOpts,
    options?: QueryOptions,
  ): Promise<ApiPaginatedResponse<T>> {
    const { page, limit } = paginationOpts;

    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.model.find(filter, null, { ...options, skip, limit }).exec(),
      this.model.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / limit);
    const hasNext = page < totalPages;
    const hasPrevious = page > 1;

    return {
      items: data,
      meta: {
        current_page: page,
        page_size: limit,
        total_items: total,
        total_pages: totalPages,
        has_next: hasNext,
        has_previous: hasPrevious,
      },
    };
  }
}
