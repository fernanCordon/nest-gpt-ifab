import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { GptService } from './gpt.service';
import { OrthographyDto, ProsConsDiscusserDto, TranslateDto } from './dtos';
import { Response } from 'express';

@Controller('gpt')
export class GptController {

  constructor( private readonly gptService: GptService ) { }


  @Post('orthography-check')
  orthographyCheck( 
    @Body() orthographyDto: OrthographyDto
  ) {
    return this.gptService.orthographyCheck( orthographyDto );
  }

  @Post('pros-cons-disscusser')
  prosConsDiscusser( 
    @Body() prosConsDiscusserDto: ProsConsDiscusserDto
  ) {
    return this.gptService.prosConsDiscusser( prosConsDiscusserDto );
  }


  @Post('pros-cons-disscusser-stream')
  async prosConsDiscusserStream( 
    @Body() prosConsDiscusserDto: ProsConsDiscusserDto,
    @Res() res: Response
  ) {

    const stream = await this.gptService.prosConsDiscusserStream( prosConsDiscusserDto );

    res.setHeader('Content-Type', 'application/json');
    res.status( HttpStatus.OK )

    for await( const chunk of stream ) {
      const piece = chunk.choices[0].delta.content || '';
      console.log(piece);
      res.write(piece);
    }

    res.end();
  }

  @Post('translate')
  translateText( 
    @Body() translateDto: TranslateDto
  ) {
    return this.gptService.translateText(translateDto);
  }




}
