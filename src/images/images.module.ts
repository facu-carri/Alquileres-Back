import { MulterModule, MulterModuleOptions } from '@nestjs/platform-express';
import { existsSync, mkdirSync } from 'fs';
import { diskStorage } from 'multer';
import path from 'path';

type paramType = string | (() => string)
type argsParams = [...(paramType)[]]

const baseDir = path.resolve('./images')

function processBody(body, ret: string) {
    if (!body) return ret
    for (const key in body) {
        const replacer = "{" + key + "}"
        if (ret.includes(replacer)) ret = ret.replaceAll(replacer, body[key])
    }
    return ret
}

export const setRoute = (...args: argsParams): any => {
    return {
        destination: ({ body }, file, cb) => {
            const dest: string = processBody(body, path.join(baseDir, ...args.map(value => getRealValue(value))))
            if (!existsSync(dest)) mkdirSync(dest, { recursive: true })
            cb(null, dest)
        },
    }
}

function getRealValue(value): string {
    const typeOfValue = typeof (value)
    return (typeOfValue == 'function') ? value() : value
}

export const setFilename = (...args: argsParams): any => {
    return {
        filename: ({ body }, file, cb) => {
            const ext = path.extname(file.originalname)
            const filename: string = getRealValue(args.reduce((pv, cv) => getRealValue(pv) + getRealValue(cv)))
            cb(null, processBody(body, filename) + ext);
        }
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