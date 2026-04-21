"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractDBRepository = void 0;
class AbstractDBRepository {
    _model;
    constructor(_model) {
        this._model = _model;
    }
    async create(item) {
        const doc = new this._model(item);
        return doc.save();
    }
    findOne(filter, projection, options) {
        return this._model.findOne(filter, projection, options);
    }
    find(filter, projection, options) {
        return this._model.find(filter, projection, options);
    }
    findById(id, projection, options) {
        return this._model.findById(id, projection, options);
    }
    findByIdAndUpdate(id, update, options = {}) {
        options.returnDocument = "after";
        return this._model.findByIdAndUpdate(id, update, options);
    }
    findByIdAndDelete(id) {
        return this._model.findByIdAndDelete(id);
    }
    updateOne(filter, update, options) {
        return this._model.updateOne(filter, update, options);
    }
}
exports.AbstractDBRepository = AbstractDBRepository;
