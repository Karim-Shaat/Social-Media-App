import type { Model, QueryFilter } from "mongoose";

export class BaseRepo<T> {
  constructor(protected readonly model: Model<T>) {
    
  }
  async find(filter: QueryFilter<T>) {
    return await this.model.create({

    });
  }
  async findOne(filter: QueryFilter<T>) {
    return await this.model.findOne(filter);
  }
}
