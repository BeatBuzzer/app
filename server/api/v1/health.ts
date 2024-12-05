export default defineEventHandler(async () => {
    return {
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        memoryUsage: process.memoryUsage().heapUsed*1e-6, // in MB
    };
})