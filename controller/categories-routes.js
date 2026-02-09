import {createCategory, getCategories, getCategory} from "../service/categories-service.js";
import {requireAuth} from "../config/auth-handler.js";

/**
 * A plugin that provide encapsulated routes
 * @param {FastifyInstance} fastify encapsulated fastify instance
 * @param {Object} options plugin options, refer to https://fastify.dev/docs/latest/Reference/Plugins/#plugin-options
 */
async function categoriesRoutes(fastify, options) {

    fastify.get('/categories', { preHandler: requireAuth }, async (request, reply) => {
        const result = await getCategories(fastify, request.user.userId)
        if (result.length === 0) {
            throw new Error('No documents found')
        }
        return result
    })

    fastify.get('/categories/:category', { preHandler: requireAuth }, async (request, reply) => {
        const result = await getCategory(fastify, request.user.userId, {category: request.params.category})
        if (!result) {
            throw new Error('Invalid value')
        }
        return result
    })

    const categoryBodyJsonSchema = {
        type: 'object',
        required: ['category', ],
        properties: {
            category: { type: 'string' },
        },
    }

    const schema = {
        body: categoryBodyJsonSchema,
    }

    fastify.post('/category', { schema, preHandler: requireAuth }, async (request, reply) => {
        return await createCategory(fastify, request.user.userId, {...request.body})
    })
}

export default categoriesRoutes