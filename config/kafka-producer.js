import { fastifyKafka } from '@fastify/kafka'
import fastifyPlugin from "fastify-plugin";

async function kafkaProducer (fastify, options) {
    // Skip Kafka registration if KAFKA_BROKERS is not set (for docker-compose without Kafka)
    if (!process.env.KAFKA_BROKERS) {
        fastify.log.warn('KAFKA_BROKERS not set, skipping Kafka producer registration');
        return;
    }
    
    fastify
        .register(fastifyKafka, {
            producer: {
                'metadata.broker.list': process.env.KAFKA_BROKERS || '127.0.0.1:9092',
                'fetch.wait.max.ms': 10,
                'fetch.error.backoff.ms': 50,
                'dr_cb': true
            }
        })
}

export default fastifyPlugin(kafkaProducer)
