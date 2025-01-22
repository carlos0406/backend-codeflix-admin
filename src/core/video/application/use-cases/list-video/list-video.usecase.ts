import { IUseCase } from '@core/shared/application/use-case.interface';
import {
  IVideoRepository,
  VideoSearchParams,
  VideoSearchResult,
} from '@core/video/domain/video.repository';

export type SearchVideoInput = {
  page?: number;
  per_page?: number;
  sort?: string;
  sort_dir?: string;
  filter?: {
    title?: string;
    categories_id?: string[];
    genres_id?: string[];
    cast_members_id?: string[];
  };
};

export class SearchVideosUseCase
  implements IUseCase<SearchVideoInput, VideoSearchResult>
{
  constructor(private videoRepo: IVideoRepository) {}

  async execute(input: SearchVideoInput): Promise<VideoSearchResult> {
    const params = VideoSearchParams.create({
      page: input.page,
      per_page: input.per_page,
      sort: input.sort,
      filter: {
        title: input.filter?.title,
        categories_id: input.filter?.categories_id,
        genres_id: input.filter?.genres_id,
        cast_members_id: input.filter?.cast_members_id,
      },
    });

    return this.videoRepo.search(params);
  }
}
