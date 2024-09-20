// ESM
import Fastify from 'fastify'
import dbConnector from "./config/db-connector.js";
import transactionsRoutes from './controller/transactions-routes.js'
import categoriesRoutes from "./controller/categories-routes.js";
import kafkaProducer from "./config/kafka-producer.js";

const fastify = Fastify({
    logger: true
})

fastify.register(dbConnector)
fastify.register(kafkaProducer)
fastify.register(transactionsRoutes)
fastify.register(categoriesRoutes)

// Run the server!
fastify.listen({ port: 3001 }, function (err, address) {
    if (err) {
        fastify.log.error(err)
        process.exit(1)
    }
    // Server is now listening on ${address}
})