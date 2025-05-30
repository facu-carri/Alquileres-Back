import { BadRequestException } from '@nestjs/common';
import { MulterModule, MulterModuleOptions } from '@nestjs/platform-express';
import { existsSync, mkdirSync } from 'fs';
import { diskStorage } from 'multer';
import path from 'path';

type fileFilters = {
    exts: string[],
    msg: string
}
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

export function setImgOpts(fileFilters: fileFilters, ...fns: any[]): MulterModuleOptions {
    
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
        }),
        fileFilter: (req, file, cb) => {
            const ext = path.extname(file.originalname).toLowerCase().substring(1)
            if (fileFilters && !fileFilters.exts.includes(ext)) return cb(new BadRequestException(fileFilters.msg), false)
            cb(null, true);
        }
    }
}

export const FilesModuleByRoute = (...route: argsParams) => MulterModule.register(setImgOpts(setRoute(...route)))
export const FilesModule = MulterModule.register(setImgOpts(setRoute('')))