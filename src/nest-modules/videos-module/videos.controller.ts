import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Inject,
  ParseUUIDPipe,
  UploadedFiles,
  ValidationPipe,
  UseInterceptors,
  BadRequestException,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateVideoUseCase } from '../../core/video/application/use-cases/create-video/create-video.use-case';
import { UpdateVideoUseCase } from '../../core/video/application/use-cases/update-video/update-video.use-case';
import { UploadAudioVideoMediasUseCase } from '../../core/video/application/use-cases/upload-audio-video-medias/upload-audio-video-medias.use-case';
import { GetVideoUseCase } from '../../core/video/application/use-cases/get-video/get-video.use-case';
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';
import { UpdateVideoInput } from '../../core/video/application/use-cases/update-video/update-video.input';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { UploadAudioVideoMediaInput } from '../../core/video/application/use-cases/upload-audio-video-medias/upload-audio-video-media.input';
import { DeleteVideoUseCase } from '@core/video/application/use-cases/delete-video/delete-video.use-case';
import { SearchVideosUseCase } from '@core/video/application/use-cases/list-video/list-video.usecase';

export type SearchVideoInput = {
  page?: number;
  per_page?: number;
  sort?: string;
  sort_dir?: string;
  title?: string;
  categories_id?: string[];
  genres_id?: string[];
  cast_members_id?: string[];
};

import { AuthGuard } from '../auth-module/auth.guard';
import { CheckIsAdminGuard } from '../auth-module/check-is-admin.guard';

@UseGuards(AuthGuard, CheckIsAdminGuard)
@Controller('videos')
export class VideosController {
  @Inject(CreateVideoUseCase)
  private createUseCase: CreateVideoUseCase;

  @Inject(UpdateVideoUseCase)
  private updateUseCase: UpdateVideoUseCase;

  @Inject(UploadAudioVideoMediasUseCase)
  private uploadAudioVideoMedia: UploadAudioVideoMediasUseCase;

  @Inject(GetVideoUseCase)
  private getUseCase: GetVideoUseCase;

  @Inject(DeleteVideoUseCase)
  private deleteUseCase: DeleteVideoUseCase;

  @Inject(SearchVideosUseCase)
  private searchUseCase: SearchVideosUseCase;

  @Post()
  async create(@Body() createVideoDto: CreateVideoDto) {
    const { id } = await this.createUseCase.execute(createVideoDto);
    //VideoPresenter
    return await this.getUseCase.execute({ id });
  }

  @Get(':id')
  async findOne(
    @Param('id', new ParseUUIDPipe({ errorHttpStatusCode: 422 })) id: string,
  ) {
    //VideoPresenter
    return await this.getUseCase.execute({ id });
  }

  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'banner', maxCount: 1 },
      { name: 'thumbnail', maxCount: 1 },
      { name: 'thumbnail_half', maxCount: 1 },
      { name: 'trailer', maxCount: 1 },
      { name: 'video', maxCount: 1 },
    ]),
  )
  @Patch(':id')
  async update(
    @Param('id', new ParseUUIDPipe({ errorHttpStatusCode: 422 })) id: string,
    @Body() updateVideoDto: any,
    @UploadedFiles()
    files: {
      banner?: Express.Multer.File[];
      thumbnail?: Express.Multer.File[];
      thumbnail_half?: Express.Multer.File[];
      trailer?: Express.Multer.File[];
      video?: Express.Multer.File[];
    },
  ) {
    const hasFiles = files ? Object.keys(files).length : false;
    const hasData = Object.keys(updateVideoDto).length > 0;

    if (hasFiles && hasData) {
      throw new BadRequestException('Files and data cannot be sent together');
    }

    if (hasData) {
      const data = await new ValidationPipe({
        errorHttpStatusCode: 422,
      }).transform(updateVideoDto, {
        metatype: UpdateVideoDto,
        type: 'body',
      });
      const input = new UpdateVideoInput({ id, ...data });
      await this.updateUseCase.execute(input);
    }

    if (hasFiles) {
      const hasMoreThanOneFile = Object.keys(files).length > 1;

      if (hasMoreThanOneFile) {
        throw new BadRequestException('Only one file can be sent');
      }

      const hasAudioVideoMedia = files.trailer?.length || files.video?.length;
      const fieldField = Object.keys(files)[0];
      const file = files[fieldField][0];

      if (hasAudioVideoMedia) {
        const dto: UploadAudioVideoMediaInput = {
          video_id: id,
          field: fieldField as any,
          file: {
            raw_name: file.originalname,
            data: file.buffer,
            mime_type: file.mimetype,
            size: file.size,
          },
        };

        const input = await new ValidationPipe({
          errorHttpStatusCode: 422,
        }).transform(dto, {
          metatype: UploadAudioVideoMediaInput,
          type: 'body',
        });

        await this.uploadAudioVideoMedia.execute(input);
      } else {
        //use case upload image media
      }
    }
    return await this.getUseCase.execute({ id });
  }

  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'banner', maxCount: 1 },
      { name: 'thumbnail', maxCount: 1 },
      { name: 'thumbnail_half', maxCount: 1 },
      { name: 'trailer', maxCount: 1 },
      { name: 'video', maxCount: 1 },
    ]),
  )
  @Patch(':id/upload')
  async uploadFile(
    @Param('id', new ParseUUIDPipe({ errorHttpStatusCode: 422 })) id: string,
    @UploadedFiles()
    files: {
      banner?: Express.Multer.File[];
      thumbnail?: Express.Multer.File[];
      thumbnail_half?: Express.Multer.File[];
      trailer?: Express.Multer.File[];
      video?: Express.Multer.File[];
    },
  ) {
    const hasMoreThanOneFile = Object.keys(files).length > 1;

    if (hasMoreThanOneFile) {
      throw new BadRequestException('Only one file can be sent');
    }

    const hasAudioVideoMedia = files.trailer?.length || files.video?.length;
    const fieldField = Object.keys(files)[0];
    const file = files[fieldField][0];

    if (hasAudioVideoMedia) {
      const dto: UploadAudioVideoMediaInput = {
        video_id: id,
        field: fieldField as any,
        file: {
          raw_name: file.originalname,
          data: file.buffer,
          mime_type: file.mimetype,
          size: file.size,
        },
      };

      const input = await new ValidationPipe({
        errorHttpStatusCode: 422,
      }).transform(dto, {
        metatype: UploadAudioVideoMediaInput,
        type: 'body',
      });

      await this.uploadAudioVideoMedia.execute(input);
    } else {
      //use case upload image media
    }
    return await this.getUseCase.execute({ id });
  }

  @Delete(':id')
  async delete(
    @Param('id', new ParseUUIDPipe({ errorHttpStatusCode: 422 })) id: string,
  ) {
    //VideoPresenter
    return await this.deleteUseCase.execute({ id });
  }

  @Get()
  async search(@Query() searchParams: SearchVideoInput) {
    return await this.searchUseCase.execute({
      filter: {
        cast_members_id: searchParams.cast_members_id,
        categories_id: searchParams.categories_id,
        genres_id: searchParams.genres_id,
        title: searchParams.title,
      },
      page: searchParams.page,
      per_page: searchParams.per_page,
      sort: searchParams.sort,
      sort_dir: searchParams.sort_dir,
    });
  }
}
