import { Injectable, NotFoundException } from '@nestjs/common';
import { audioToTextUseCase, imageGenerationUseCase, orthographyCheckUseCase, prosConsDiscusserStreamUseCase, prosConsDiscusserUseCase, textToAudioUseCase } from './use-cases';
import { AudioToTextDto, ImageGenerationDto, OrthographyDto, ProsConsDiscusserDto, TextToAudioDto, TranslateDto } from './dtos';
import { OpenAI } from 'openai';
import { translateUseCase } from './use-cases/translate.use-case';
import * as path from 'path';
import * as fs from 'fs';



@Injectable()
export class GptService {

    private openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
    });

    async orthographyCheck( orthographyDto: OrthographyDto ) {
        return await orthographyCheckUseCase(this.openai, { 
            prompt: orthographyDto.prompt 
        });
    }

    async prosConsDiscusser( { prompt }: ProsConsDiscusserDto) {
        return await prosConsDiscusserUseCase( this.openai, { prompt } );
    }

    async prosConsDiscusserStream( { prompt }: ProsConsDiscusserDto) {
        return await prosConsDiscusserStreamUseCase( this.openai, { prompt } );
    }


    async translateText( { prompt, lang }: TranslateDto ) {
        return await translateUseCase( this.openai, { prompt, lang } );
    }

    async textToAudio( { prompt, voice }: TextToAudioDto ) {

        return await textToAudioUseCase( this.openai, { prompt, voice } );
    }


    
    async textToAudioGetter( field: string ) {
       
        const filePath = path.resolve(__dirname, '../../generated/audios/', `${ field }.mp3` );

        const wasFound = fs.existsSync( filePath );

        if ( !wasFound ) throw new NotFoundException(`File ${ field } not found`);

        return filePath;
        
    }


    async audioToText( audioFile: Express.Multer.File, audioToTextDto: AudioToTextDto ) {

        const { prompt } = audioToTextDto;

        return await audioToTextUseCase( this.openai, { audioFile, prompt } );
    }


    async imageGeneration( imageGenerationDto: ImageGenerationDto ) {

        return imageGenerationUseCase( this.openai, { ...imageGenerationDto } );
    }

}
