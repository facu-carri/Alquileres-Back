declare namespace NodeJS {
    export interface ProcessEnv {
        DB_TYPE: string,
        DB_HOST: string,
        DB_NAME: string,
        DB_PORT: string,
        DB_USER_NAME: string,
        DB_USER_PASSWORD: string,
        JWT_SECRET: string,
        GMAIL_APP_PASSWORD: string,
        GMAIL_USER: string,
        MAILER_PORT: string,
        MERCADO_PAGO_TOKEN: string,
        FRONT_URL: string
    }
}