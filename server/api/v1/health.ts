// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface HealthCheckResponse {
    status: string;
    timestamp: string;
    uptime: number;
    memoryUsage: number;
}

/**
 * Health check endpoint that provides basic server status information
 * @returns {HealthCheckResponse} Server health status information
 */
export default defineEventHandler(async () => {
    return {
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        memoryUsage: process.memoryUsage().heapUsed*1e-6, // in MB
    };
})