import {createTransaction, getTransaction, getTransactions} from "../service/transactions-service.js";
import {updateAccounts} from "../events/update-accounts.js";
import {requireAuth} from "../config/auth-handler.js";

/**
 * A plugin that provide encapsulated routes
 * @param {FastifyInstance} fastify encapsulated fastify instance
 * @param {Object} options plugin options, refer to https://fastify.dev/docs/latest/Reference/Plugins/#plugin-options
 */
async function transactionsRoutes(fastify, options) {

    fastify.get('/transactions', { preHandler: requireAuth }, async (request, reply) => {
        const result = await getTransactions(fastify, request.user.userId)
        if (result.length === 0) {
            throw new Error('No documents found')
        }
        return result
    })

    fastify.get('/transactions/:transaction', { preHandler: requireAuth }, async (request, reply) => {
        const result = await getTransaction(fastify, request.user.userId, {transactionDesc: request.params.transactionDesc})
        if (!result) {
            throw new Error('Invalid value')
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

    fastify.post('/transaction', { schema, preHandler: requireAuth }, async (request, reply) => {
        const result = await createTransaction(fastify, request.user.userId, request.body)
        await updateAccounts(fastify, request.body)
        return result
    })
}

export default transactionsRoutes