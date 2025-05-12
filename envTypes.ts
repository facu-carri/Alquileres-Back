declare namespace NodeJS {
    export interface ProcessEnv {
        DB_PASSWORD: string,
        DB_NAME: string,
        JWT_SECRET: string,
        GMAIL_APP_PASSWORD: string,
        GMAIL_USER: string,
        MAILER_PORT: string,
        MERCADO_PAGO_TOKEN: string
    }
}