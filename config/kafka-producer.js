import { fastifyKafka } from '@fastify/kafka'
import fastifyPlugin from "fastify-plugin";

async function kafkaProducer (fastify, options) {
    fastify
        .register(fastifyKafka, {
            producer: {
                'metadata.broker.list': '127.0.0.1:9092',
                'fetch.wait.max.ms': 10,
                'fetch.error.backoff.ms': 50,
                'dr_cb': true
            }
        })
}

export default fastifyPlugin(kafkaProducer)