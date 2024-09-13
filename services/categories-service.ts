import {FastifyInstance} from "fastify";
import {Document} from "mongodb";

export async function getCategories(fastify: FastifyInstance) {
    const collection = fastify.mongo.db?.collection('categories')
    return await collection?.find().toArray()
}

export async function getCategory(fastify: FastifyInstance, category: Document) {
    const collection = fastify.mongo.db?.collection('categories')
    return await collection?.findOne(category)
}

export async function createCategory(fastify: FastifyInstance, category: Document) {
    const collection = fastify.mongo.db?.collection('categories')
    return await collection?.insertOne(category);
}

export async function checkIfCategoryExists(fastify: FastifyInstance, category: Document) {
    const collection = fastify.mongo.db?.collection('categories')
    const result = await collection?.findOne(category)
    return !!result
}