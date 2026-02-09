import * as categoriesService from "./categories-service.js";

/**
 * @param fastify
 * @param userId
 * @returns {Promise<WithId<Document>[]>}
 */
export async function getTransactions (fastify, userId) {
    const collection = fastify.mongo.db.collection('transactions')
    return await collection.find({ userId }).toArray()
}

/**
 * @param fastify
 * @param userId
 * @param transaction
 * @returns {Promise<Document & {_id: InferIdType<Document>}>}
 */
export async function getTransaction (fastify, userId, transaction) {
    const collection = fastify.mongo.db.collection('transactions')
    return await collection.findOne({ userId, ...transaction })
}


/**
 * a function that check the request body and create a transaction
 * @param {FastifyInstance} fastify encapsulated fastify instance
 * @param {String} userId the user identifier
 * @param {Object} body the request body object
 * @returns {Promise<Object>} the created transaction
 */
export async function createTransaction (fastify, userId, body) {
    const collection = fastify.mongo.db.collection('transactions')
    const { type, amount, description, category, account, date } = body

    if (!type || !amount || !category || !account) {
        throw new Error('Invalid request')
    }

    const transaction = {
        userId,
        type,
        amount,
        description,
        category,
        account,
        date
    }

    const categoryBody = {category}

    const categoryExists = await categoriesService.checkIfCategoryExists(fastify, userId, categoryBody)
    if (!categoryExists) {
        await categoriesService.createCategory(fastify, userId, categoryBody)
    }

    return await collection.insertOne(transaction)
}