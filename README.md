# BeatBuzzer Music Game

## Setup

Execute the following commands to run the project locally:

```bash
npm install && npm run dev
```

The server will be available at `http://localhost:3000`.

## TSDocs

To generate the TSDoc documentation, run the following command:

```bash
npm run docs:serve
```

## Required Environment Variables

Check `.env.example` for the required environment variables.

Utilize ur systems capabilities to set the environment variables or create a `.env` file in the root of the project and
set the variables there. Latter is suggested.

> [!WARNING] Careful
> Make sure to never commit the `.env` file to the repository.  
> Check the `.gitignore` file to see the `.env` file is ignored.

## Project Structure
We are using the following project structure:

```
.
├── pages                   # For Vue pages
├── components              # For Vue components
├── composables             # For composables (Vue composition API)
├── DB                      # All DDLs for the database
├── layouts                 # For Vue layouts
├── types                   # For TypeScript types
└── server                  # For the Nitro server
    ├── api                 # All API routes (route automatically defined as folder/file)
        └── health.get.ts   # eg, GET /api/health  
    └── utils               # For server utilities
```
Please see the [Nuxt Documentation](https://nuxt.com/docs/guide/directory-structure/app) for more detailed information.