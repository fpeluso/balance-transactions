export async function requireAuth(request, reply) {
    try {
        await request.jwtVerify()
        request.user = {
            userId: request.user.sub
        }
    } catch (err) {
        reply.code(401).send({ error: 'Unauthorized', message: 'Invalid or missing authentication token' })
    }
}
