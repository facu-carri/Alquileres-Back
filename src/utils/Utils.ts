import { BadRequestException } from "@nestjs/common";
import { randomBytes } from "crypto";
import path from "path";

export function generateCode(length: number) {
    return randomBytes(Math.ceil(length / 2)).toString('hex').slice(0, length);
}

export function validFileExt(file: Express.Multer.File, msg: string, ...exts: string[]) {
    const file_ext = path.extname(file.filename)

    for (const ext of exts) {
        if(file_ext == ext) return true
    }

    throw new BadRequestException(msg)
}

export function getImageLink(image: Express.Multer.File) {
    const baseDir = path.resolve('')
    return `${process.env.BACK_URL}${image.path.substring(baseDir.length)}`.replaceAll("\\", "/")
}