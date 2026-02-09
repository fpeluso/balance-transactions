/**
 *
 * @param fastify
 * @param userId
 * @returns {Promise<WithId<Document>[]>}
 */
export async function getCategories(fastify, userId) {
    const collection = fastify.mongo.db.collection('categories')
    return await collection.find({ userId }).toArray()
}

/**
 *
 * @param fastify
 * @param userId
 * @param category
 * @returns {Promise<Document & {_id: InferIdType<Document>}>}
 */
export async function getCategory(fastify, userId, category) {
    const collection = fastify.mongo.db.collection('categories')
    return await collection.findOne({ userId, ...category })
}

/**
 * a function that save a new category on db
 * @param {FastifyInstance} fastify encapsulated fastify instance
 * @param {String} userId the user identifier
 * @param {Object} category the category object
 * @returns {Promise<Object>} the created category
 */
export async function createCategory(fastify, userId, category) {
    const collection = fastify.mongo.db.collection('categories')
    return await collection.insertOne({ userId, ...category })
}

/**
 * a function that check if a category already exist
 * @param {FastifyInstance} fastify encapsulated fastify instance
 * @param {String} userId the user identifier
 * @param {object} category the category name
 * @returns {Promise<Boolean>} true if the category exist
 */
export async function checkIfCategoryExists(fastify, userId, category) {
    const collection = fastify.mongo.db.collection('categories')
    const result = await collection.findOne({ userId, ...category })
    return !!result
}