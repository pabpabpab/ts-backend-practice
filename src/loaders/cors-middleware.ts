import cors from 'cors';

export function createCorsMiddleware(): any {
    return cors({
        credentials: true,
        origin: 'http://localhost:3000' // где фронтенд
    });
}