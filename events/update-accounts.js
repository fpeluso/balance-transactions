export async function updateAccounts(fastify, payload) {
    const message = JSON.stringify({
        type: payload.type,
        amount: payload.amount,
        account: payload.account,
    })

    fastify.kafka.push({
        topic: 'update-account', payload: message, key: 'dataKey'
    })
}

