const request = require('supertest')
const app = require('../../app')
const newTodo = require('../mock-data/new-todo.json')

const endpointUrl = "/todos/"
let firstTodo, newTodoCreated
const testData = { title: "Make integration test for PUT", done: true }
const nonExisitingId = "62600f5ee47674e86c34f3b1"

describe(endpointUrl, () => {
    test("GET " + endpointUrl, async () => {
        const response = await request(app).get(endpointUrl)
        expect(response.statusCode).toBe(200)
        expect(Array.isArray(response.body)).toBeTruthy()
        expect(response.body[0].title).toBeDefined()
        expect(response.body[0].done).toBeDefined()
        firstTodo = response.body[0]
    })
    test("GET by Id " + endpointUrl + ":todoId", async () => {
        const response = await request(app).get(endpointUrl + firstTodo._id)
        expect(response.statusCode).toBe(200)
        expect(response.body.title).toBe(firstTodo.title)
        expect(response.body.done).toBe(firstTodo.done)
    })
    test("GET todo by id doesn't exist " + endpointUrl + ":todoId", async () => {
        const response = await request(app).get(endpointUrl + nonExisitingId)
        expect(response.statusCode).toBe(404)
    })
    it("POST " + endpointUrl, async () => {
        const response = await request(app)
            .post(endpointUrl)
            .send(newTodo);
        expect(response.statusCode).toBe(201)
        expect(response.body.title).toBe(newTodo.title)
        expect(response.body.done).toBe(newTodo.done)
        newTodoCreated = response.body._id;
    })
    it("should return error 500 on malformed data with POST" + endpointUrl, async () => {
        const response = await request(app)
            .post(endpointUrl)
            .send({ title: "Missing done property" })
        expect(response.statusCode).toBe(500)
        expect(response.body).toStrictEqual({
            message:
                "Todo validation failed: done: Path `done` is required."
        })
    })
    test("PUT " + endpointUrl, async () => {

        const response = await request(app).put(endpointUrl + newTodoCreated).send(testData)
        expect(response.statusCode).toBe(200)
        expect(response.body.title).toBe(testData.title)
        expect(response.body.done).toBe(testData.done)
    })
    test("DELETE " + endpointUrl + ":todoId", async () => {
        const response = await request(app)
            .delete(endpointUrl + newTodoCreated).send()
        expect(response.statusCode).toBe(200)
        expect(response.body.title).toBe(testData.title)
        expect(response.body.done).toBe(testData.done)
    })
    test("HTTP DELETE 404", async () => {
        const response = await request(app)
            .delete(endpointUrl + nonExisitingId).send()
        expect(response.statusCode).toBe(404)
    })
})

