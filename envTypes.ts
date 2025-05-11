declare namespace NodeJS {
    export interface ProcessEnv {
        DB_PASSWORD: string,
        DB_NAME: string,
        JWT_SECRET: string
    }
}