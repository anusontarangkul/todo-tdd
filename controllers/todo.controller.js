const TodoModel = require("../model/todo.model");

exports.createTodo = async (req, res, next) => {
    try {
        const createdModel = await TodoModel.create(req.body);
        res.status(201).json(createdModel);
    }
    catch (err) {
        next(err)
    }

};

exports.getTodos = async (req, res, next) => {
    try {
        const allTodos = await TodoModel.find({})
        res.status(200).json(allTodos)
    } catch (err) {
        next(err)
    }
}

exports.getTodoById = async (req, res, next) => {

    try {
        const singleTodo = await TodoModel.findById(req.params.todoId)
        if (!singleTodo) {
            return res.status(404).send()
        }
        res.status(200).json(singleTodo)
    } catch (error) {
        next(error)
    }
}

exports.updateTodo = async (req, res, next) => { }