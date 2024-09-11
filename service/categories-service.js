/**
 * a function that save a new category on db
 * @param {FastifyInstance} fastify encapsulated fastify instance
 * @param {Object} category the category object
 * @returns {Promise<Object>} the created category
 */
export async function createCategory(fastify, category) {
    const collection = fastify.mongo.db.collection('categories')
    const result = await collection.insertOne(category)
    return result
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