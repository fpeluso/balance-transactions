/**
 * A plugin that provide encapsulated routes
 * @param {FastifyInstance} fastify encapsulated fastify instance
 * @param {Object} options plugin options, refer to https://fastify.dev/docs/latest/Reference/Plugins/#plugin-options
 */
async function categoriesRoutes(fastify, options) {
    const collection = fastify.mongo.db.collection('categories')

    const opts = {
        schema: {
            response: {
                200: {
                    type: 'object',
                    properties: {
                        hello: { type: 'string' }
                    }
                }
            }
        }
    }

    fastify.get('/categories', async (request, reply) => {
        const result = await collection.find().toArray()
        if (result.length === 0) {
            throw new Error('No documents found')
        }
        return result
    })

    fastify.get('/categories/:category', async (request, reply) => {
        const result = await collection.findOne({transactionDesc: request.params.transactionDesc})
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
        const result = await collection.insertOne({category: request.body})
        return result
    })
}

export default categoriesRoutes