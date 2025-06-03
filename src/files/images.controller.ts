import { Controller, Get, NotFoundException, Req, Res } from '@nestjs/common';
import { Request } from 'express';
import { createReadStream, existsSync } from 'fs';
import path from 'path';
import { lookup } from 'mime-types';
import { EXT_IMAGES } from './extensions';

@Controller('images')
export class ImagesController {

    private basePath: string

    constructor() {
        this.basePath = path.resolve('./images')
    }
    
    @Get('/ext')
    getExtensions() {
        return EXT_IMAGES
    }

    @Get('/*')
    getImage(
        @Req() req: Request,
        @Res() res
    ) {
        const route = path.normalize(req.path.substring("/images/".length))
        const filePath = decodeURIComponent(path.join(this.basePath, route))

        if (!existsSync(filePath)) throw new NotFoundException('No se encontro la imagen')
        
        const mimeType = lookup(path.extname(filePath)) || 'application/octet-stream';
        res.setHeader('Content-Type', mimeType);
        
        const file = createReadStream(filePath);
        file.pipe(res);
    }
}