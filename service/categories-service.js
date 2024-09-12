/**
 *
 * @param fastify
 * @returns {Promise<WithId<Document>[]>}
 */
export async function getCategories(fastify) {
    const collection = fastify.mongo.db.collection('categories')
    return await collection.find().toArray()
}

/**
 *
 * @param fastify
 * @param category
 * @returns {Promise<Document & {_id: InferIdType<Document>}>}
 */
export async function getCategory(fastify, category) {
    const collection = fastify.mongo.db.collection('categories')
    return await collection.findOne(category)
}

/**
 * a function that save a new category on db
 * @param {FastifyInstance} fastify encapsulated fastify instance
 * @param {Object} category the category object
 * @returns {Promise<Object>} the created category
 */
export async function createCategory(fastify, category) {
    const collection = fastify.mongo.db.collection('categories')
    return await collection.insertOne(category)
}

/**
 * a function that check if a category already exist
 * @param {FastifyInstance} fastify encapsulated fastify instance
 * @param {object} category the category name
 * @returns {Promise<Boolean>} true if the category exist
 */
export async function checkIfCategoryExists(fastify, category) {
    const collection = fastify.mongo.db.collection('categories')
    const result = await collection.findOne(category)
    return !!result
}