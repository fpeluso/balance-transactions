// Require the framework and instantiate it

// ESM
import Fastify from 'fastify'
import dbConnector from "./config/db-connector";
import transactionsRoutes from './routes/transactions-routes'
import {categoriesRoutes} from "./routes/categories-routes";

const fastify = Fastify({
    logger: true
})

fastify.register(dbConnector)
fastify.register(transactionsRoutes)
fastify.register(categoriesRoutes)

// Run the server!
fastify.listen({ port: 3000 }, function (err, address) {
    if (err) {
        fastify.log.error(err)
        process.exit(1)
    }
    // Server is now listening on ${address}
})

//"start": "node ./dist/index.js "