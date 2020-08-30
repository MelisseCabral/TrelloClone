/* eslint-disable camelcase */
const Joi = require('joi');
const connection = require('../database/connection');
const todoSchema = require('../models/todo');

module.exports = {

  /*
    Retrive all todos from list by id page by page
  */

  async index(request, response) {
    const {
      page = 1,
      list_id,
    } = request.query;

    const [count] = await connection('todo').where('list_id', '=', list_id).count();

    const todos = await connection('todo')
      .join('todo', 'todo.list_id', '=', list_id)
      .limit(5)
      .offset((page - 1) * 5)
      .select([
        'todo.id',
        'todo.label',
        'todo.description',
        'todo.status',
      ]);

    response.header('X-Total-Count', count['count(*)']);

    return response.json(todos);
  },

  /* Store data at the database on MongoDb */
  async store(request, response) {
    const { body } = request;

    const result = Joi.validade(body, todoSchema);
    const { error } = result;
    const valid = error == null;
    if (valid) {
      const createPost = await connection('todo').insert({ body });
      return response.json({ message: 'List Created', data: createPost });
    }
    /*
      If havent returned return status 422
    */
    return response.status(422).json({
      message: 'Invalid Request',
      data: body,
    });
  },
  async delete(request, response) {
    const {
      id,
    } = request.params;

    const todo = await connection('todo')
      .where('id', id)
      .first();

    if (!todo) {
      return response.status(404).json({
        error: 'Was not found that list.',
      });
    }
    await connection('todo').where('id', id).delete();
    return response.status(204).send();
  },
};
