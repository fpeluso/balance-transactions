import fastifyPlugin from 'fastify-plugin'
import fastifyJwt from '@fastify/jwt'
import jwksClient from 'jwks-rsa'

async function authPlugin(fastify, options) {
    const authServerUrl = options.authServerUrl || process.env.AUTH_SERVER_URL || 'http://localhost:9000'
    
    const client = jwksClient({
        jwksUri: `${authServerUrl}/.well-known/jwks.json`,
        cache: true,
        cacheMaxAge: 36000000,
        rateLimit: true,
        jwksRequestsPerMinute: 10
    })

    const getSigningKey = (header, callback) => {
        client.getSigningKey(header.kid, (err, key) => {
            if (err) {
                callback(err)
                return
            }
            const signingKey = key.getPublicKey()
            callback(null, signingKey)
        })
    }

    fastify.register(fastifyJwt, {
        secret: getSigningKey,
        decode: { complete: true }
    })

    fastify.decorate('authenticate', async function(request, reply) {
        try {
            await request.jwtVerify()
        } catch (err) {
            reply.code(401).send({ error: 'Unauthorized', message: err.message })
        }
    })
}

export default fastifyPlugin(authPlugin)
