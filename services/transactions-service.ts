import * as categoriesService from "./categories-service";
import {FastifyInstance} from "fastify";
import {Document} from "mongodb";

export async function getTransactions (fastify: FastifyInstance) {
    const collection = fastify.mongo.db?.collection('transactions')
    return await collection?.find().toArray()
}

export async function getTransaction (fastify: FastifyInstance, transaction: Document) {
    const collection = fastify.mongo.db?.collection('transactions')
    return await collection?.findOne(transaction)
}

export async function createTransaction (fastify: FastifyInstance, body: Document) {
    const collection = fastify.mongo.db?.collection('transactions')
    if(!collection) {
        throw new Error('Collection not found')
    }
    const { type, amount, description, category, account, date } = body

    if (!type || !amount || !category || !account) {
        throw new Error('Invalid request')
    }

    const transaction = {
        type,
        amount,
        description,
        category,
        account,
        date
    }

    const categoryBody = {category}

    const categoryExists = await categoriesService.checkIfCategoryExists(fastify,categoryBody)
    if (!categoryExists) {
        await categoriesService.createCategory(fastify, categoryBody)
    }

    return await collection.insertOne(transaction)
}