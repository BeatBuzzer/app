# Examples how to create api handlers

## Example 1: Simple handler

Route based: `server/api/v1/hello.ts` will hear on `/api/v1/hello`

```ts
import {serverSupabaseClient} from '#supabase/server'

export default defineEventHandler(async (event) => {
    const client = await serverSupabaseClient(event)
    const {data} = await client.from('calculations').select('*')

    return {data: data}
})
```

## Example 2: Handler with Route parameters
File: `server/api/hello/[name].ts`.  
Square brackets indicate wildcard that will get passed to handler.


```ts
export default defineEventHandler((event) => {
    const name = getRouterParam(event, 'name')

    return `Hello, ${name}!`
})
```

## Example 3: Handler with Query parameters
Example: `/api/query?foo=bar&baz=qux`

```ts
export default defineEventHandler((event) => {
    const query = getQuery(event)

    return { a: query.foo, b: query.baz }   
})
```

## Example 4: Handler with POST body

File: `server/api/v1/hello.POST.ts`
```ts
import { z } from 'zod'

const userSchema = z.object({
    name: z.string().default('Guest'),
    email: z.string().email(),
})

export default defineEventHandler(async (event) => {
    const result = await readValidatedBody(event, body => userSchema.safeParse(body)) // or `.parse` to directly throw an error

    if (!result.success)
        throw result.error.issues

    // User object is validated and typed!
    return result.data
})
```

## Example 5: Custom Error handling

```ts
export default defineEventHandler(async (event) => {
    throw createError({
        statusCode: 400,
        statusMessage: 'ID should be an integer',
    })
})
```

## Example 6: Custom Status Codes
```ts
export default defineEventHandler(async (event) => {
    setResponseStatus(event, 202)
})
```