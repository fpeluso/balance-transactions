import * as categoriesService from "./categories-service.js";

/**
 * a function that check the request body and create a transaction
 * @param {FastifyInstance} fastify encapsulated fastify instance
 * @param {Object} body the request body object
 * @returns {Promise<Object>} the created transaction
 */
export async function createTransaction (fastify, body) {
    const collection = fastify.mongo.db.collection('transactions')
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


    const result = await collection.insertOne(transaction)
    return result
}