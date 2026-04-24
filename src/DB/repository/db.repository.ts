import { Types } from "mongoose";
import {
  Model,
  MongooseUpdateQueryOptions,
  ObjectId,
  ProjectionType,
  QueryFilter,
  QueryOptions,
  UpdateQuery,
} from "mongoose";

export abstract class AbstractDBRepository<T> {
  constructor(private _model: Model<T>) {}

  public async create(item: Partial<T>) {
    const doc = new this._model(item);
    return doc.save();
  }

  public findOne(
    filter: QueryFilter<T>,
    projection?: ProjectionType<T>,
    options?: QueryOptions,
  ) {
    return this._model.findOne(filter, projection, options);
  }

  public find(
    filter: QueryFilter<T>,
    projection?: ProjectionType<T>,
    options?: QueryOptions,
  ) {
    return this._model.find(filter, projection, options);
  }
  public findById(
    id: Types.ObjectId | string,
    projection?: ProjectionType<T>,
    options?: QueryOptions,
  ) {
    return this._model.findById(id, projection, options);
  }

  public findByIdAndUpdate(
    id: ObjectId,
    update: UpdateQuery<T>,
    options: QueryOptions = {}, //skip , limit , populate
  ) {
    options.returnDocument = "after";
    return this._model.findByIdAndUpdate(id, update, options);
  }
  public findByIdAndDelete(id: Types.ObjectId) {
    return this._model.findByIdAndDelete(id);
  }

  public updateOne(
    filter: QueryFilter<T>,
    update: UpdateQuery<T>,
    options?: MongooseUpdateQueryOptions,
  ) {
    return this._model.updateOne(filter, update, options);
  }
}
