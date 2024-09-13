import {createTransaction, getTransactions} from "../services/transactions-service";
import {FastifyInstance} from "fastify";

/**
 * A plugin that provide encapsulated routes
 * @param {FastifyInstance} fastify encapsulated fastify instance
 * @param {Object} options plugin options, refer to https://fastify.dev/docs/latest/Reference/Plugins/#plugin-options
 */
async function transactionsRoutes(fastify: FastifyInstance) {

    fastify.get('/transactions', async (request, reply) => {
        const result = await getTransactions(fastify)
        if (!result || result.length === 0) {
            throw new Error('No documents found')
        }
        return result
    })


    const transactionBodyJsonSchema = {
        type: 'object',
        required: ['type', 'amount', 'account'],
        properties: {
            type: { type: 'string', },
            amount: { type: 'number' },
            description: { type: 'string' },
            category: { type: 'string' },
            account: { type: 'number' },
            date: { type: 'string' }
        },
    }

    const schema = {
        body: transactionBodyJsonSchema,
    }

    fastify.post('/transaction', {schema}, async (request, reply) => {
        // we can use the `request.body` object to get the data sent by the client
        // const resulta = await collection.insertOne({transaction: request.body})
        return await createTransaction(fastify, {transaction: request.body})
    })
}

export default transactionsRoutes