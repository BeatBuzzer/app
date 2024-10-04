import {serverSupabaseClient} from '#supabase/server'

export default defineEventHandler(async (event) => {
    const client = await serverSupabaseClient(event)
    const {data} = await client.from('calculations').select('*')
    await client.from('calculations').insert({operand: '+', left: 10, right: 5, result: 10+5})

    return {data: data}
})
