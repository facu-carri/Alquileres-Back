import { randomBytes } from "crypto";
import path from "path";

export function generateCode(length: number) {
    return randomBytes(Math.ceil(length / 2)).toString('hex').slice(0, length);
}

export function getImageLink(image: Express.Multer.File) {
    const baseDir = path.resolve('')
    return `http://localhost:3000${image.path.substring(baseDir.length)}`.replaceAll("\\", "/")
}