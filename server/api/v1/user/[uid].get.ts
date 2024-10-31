export default defineEventHandler((event) => {
    const userId = getRouterParam(event, 'uid')

    return {user: userId};
})