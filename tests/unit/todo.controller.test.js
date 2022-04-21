const TodoController = require('../../controllers/todo.controller')
const TodoModel = require('../../model/todo.model')
const httpMocks = require('node-mocks-http')
const newTodo = require('../mock-data/new-todo.json')
const allTodos = require('../mock-data/all-todos.json')

TodoModel.create = jest.fn()
TodoModel.find = jest.fn()
TodoModel.findById = jest.fn()
TodoModel.findByIdAndUpdate = jest.fn()

let req, res, next;

beforeEach(() => {

    req = httpMocks.createRequest()
    res = httpMocks.createResponse()
    next = jest.fn()
})

describe("TodoController.getTodoById", () => {
    it("should have a getTodoById function", () => {
        expect(typeof TodoController.getTodoById).toBe('function')
    })
    it("should call todoModel.findById with params", async () => {
        req.params.todoId = "62600f5ee47674e86c34f3b7"
        await TodoController.getTodoById(req, res, next)
        expect(TodoModel.findById).toHaveBeenCalledWith("62600f5ee47674e86c34f3b7")
    })
    it("should return json body and response code 200", async () => {
        TodoModel.findById.mockReturnValue(newTodo)
        await TodoController.getTodoById(req, res, next)
        expect(res.statusCode).toBe(200)
        expect(res._isEndCalled()).toBeTruthy()
        expect(res._getJSONData()).toStrictEqual(newTodo)
    })
    it("should handle erros", async () => {
        const errorMessage = { message: "error finding todo" }
        const rejectedPromise = Promise.reject(errorMessage)
        TodoModel.findById.mockReturnValue(rejectedPromise)
        await TodoController.getTodoById(req, res, next)
        expect(next).toBeCalledWith(errorMessage)
    })
    it("should return 404 when item doesn't exist", async () => {
        TodoModel.findById.mockReturnValue(null)
        await TodoController.getTodoById(req, res, next)
        expect(res.statusCode).toBe(404)
        expect(res._isEndCalled()).toBeTruthy()
    })
})

describe("TodoController.getTodos", () => {
    it("should have a getTodos function", () => {
        expect(typeof TodoController.getTodos).toBe('function')
    })
    it("should call TodoModel.find({})", async () => {
        await TodoController.getTodos(req, res, next)
        expect(TodoModel.find).toHaveBeenCalledWith({})
    })
    it("should return response with status 200 and all todos", async () => {
        TodoModel.find.mockReturnValue(allTodos)
        await TodoController.getTodos(req, res, next)
        expect(res.statusCode).toBe(200)
        expect(res._isEndCalled()).toBeTruthy()
        expect(res._getJSONData()).toStrictEqual(allTodos)
    })
    it("should handle errors", async () => {
        const errorMessage = { message: "error" }
        const rejectedPromise = Promise.reject(errorMessage)
        TodoModel.find.mockReturnValue(rejectedPromise)
        await TodoController.getTodos(req, res, next)
        expect(next).toBeCalledWith(errorMessage)
    })
})

describe('TodoController.createTodo', () => {

    beforeEach(() => {
        req.body = newTodo;
    })
    it("should have a createTodo function", () => {
        expect(typeof TodoController.createTodo).toBe('function')
    })
    it('should call TodoModel.create', () => {
        TodoController.createTodo(req, res, next)
        expect(TodoModel.create).toBeCalledWith(newTodo)
    })
    it('should return 201 response code', async () => {
        await TodoController.createTodo(req, res, next)
        expect(res.statusCode).toBe(201)
        expect(res._isEndCalled()).toBeTruthy()
    })
    it('should return json body in response', async () => {
        TodoModel.create.mockReturnValue(newTodo)
        await TodoController.createTodo(req, res, next)
        expect(res._getJSONData()).toStrictEqual(newTodo)
    })
    it("should handle errors", async () => {
        const errorMessage = { message: "done property missing" }
        const rejectedPromise = Promise.reject(errorMessage)
        TodoModel.create.mockReturnValue(rejectedPromise)
        await TodoController.createTodo(req, res, next)
        expect(next).toBeCalledWith(errorMessage)
    })

    describe("TodoController.updateTodo", () => {
        it("should have a updateTodo function", () => {
            expect(typeof TodoController.updateTodo).toBe("function")
        })
    })
})