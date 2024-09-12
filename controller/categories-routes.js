import {createCategory, getCategories, getCategory} from "../service/categories-service.js";

/**
 * A plugin that provide encapsulated routes
 * @param {FastifyInstance} fastify encapsulated fastify instance
 * @param {Object} options plugin options, refer to https://fastify.dev/docs/latest/Reference/Plugins/#plugin-options
 */
async function categoriesRoutes(fastify, options) {

    fastify.get('/categories', async (request, reply) => {
        const result = await getCategories(fastify)
        if (result.length === 0) {
            throw new Error('No documents found')
        }
        return result
    })

    fastify.get('/categories/:category', async (request, reply) => {
        const result = await getCategory(fastify, {category: request.params.category})
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

    fastify.post('/category', {schema}, async (request, reply) => {
        // we can use the `request.body` object to get the data sent by the client
        return await createCategory(fastify, {...request.body})
    })
}

export default categoriesRoutes