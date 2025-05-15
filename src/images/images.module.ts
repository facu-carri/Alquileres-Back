import { MulterModule, MulterModuleOptions } from '@nestjs/platform-express';
import { existsSync, mkdirSync } from 'fs';
import { diskStorage } from 'multer';
import path from 'path';

type argsParams = [...(string | ((body: Record<string, any>) => Record<string, any>))[]]

const baseDir = path.resolve('./images')

function processBody(body, ret: string, proxyBody) {
    if (!body) return ret
    let processedBody = body
    if (proxyBody) processedBody = proxyBody(body)
    for (const key in processedBody) {
        const replacer = "{" + key + "}"
        if (ret.includes(replacer)) ret = ret.replaceAll(replacer, processedBody[key])
    }
    return ret
}

export const setRoute = (...args: argsParams): any => {
    const proxyBody: Function = (typeof(args.at(-1)) == 'function' ? args.at(-1) : null) as Function
    const route: any[] = proxyBody ? args.slice(0, -1) : args
    let dest = path.join(baseDir, ...route)
    return {
        destination: ({ body }, file, cb) => {
            if (body) {
                dest = processBody(body, dest, proxyBody)
            }
            if (!existsSync(dest)) {
                mkdirSync(dest, { recursive: true })
            }
            cb(null, dest)
        },
    }
}

export const setFilename = (...args: argsParams): any => {
    const proxyBody: Function = (typeof (args.at(-1)) == 'function' ? args.at(-1) : null) as Function
    let filename: string = (proxyBody ? args.slice(0, -1) : args).join('')

    return {
        filename: ({ body }, file, cb) => {
            const ext = path.extname(file.originalname)
            if (body) {
                filename = processBody(body, filename, proxyBody)
            }
            cb(null, filename + ext);
        },
    }
}

export function setImgOpts(...fns: any[]): MulterModuleOptions {
    
    const mergeObjs = {}
    for (const val of fns) Object.assign(mergeObjs, val)

    return {
        storage: diskStorage({
            ...setRoute(""),
            filename: (_req, file, cb) => {
                const filename = file.originalname;
                cb(null, filename);
            },
            ...mergeObjs
        })
    }
}

export const ImagesModuleByRoute = (...route: argsParams) => MulterModule.register(setImgOpts(setRoute(...route)))
export const ImagesModule = MulterModule.register(setImgOpts(setRoute('')))