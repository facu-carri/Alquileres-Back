import { Controller, Get, NotFoundException, Param, Post, Query, Req, Res, Response, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { createReadStream, existsSync } from 'fs';
import path from 'path';

@Controller('images')
export class ImagesController {

    private basePath: string

    constructor() {
        this.basePath = path.resolve('./images')
    }
    
    @Get('/*')
    getImage(
        @Req() req: Request,
        @Res() res
    ) {
        const route = path.normalize(req.path.substring("/images/".length))
        const filePath = path.join(this.basePath, route)
        if (!existsSync(filePath)) throw new NotFoundException()
        
        const file = createReadStream(path.join(this.basePath, route));
        file.pipe(res);
    }
}