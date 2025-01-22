import request from 'supertest';
import { IGenreRepository } from '../../src/core/genre/domain/genre.repository';
import { startApp } from '../../src/nest-modules/shared-module/testing/helpers';
import { GENRES_PROVIDERS } from '../../src/nest-modules/genres-module/genres.providers';
import { ICategoryRepository } from '../../src/core/category/domain/category.repository';
import { CATEGORY_PROVIDERS } from '../../src/nest-modules/categories-module/categories.providers';
import { ICastMemberRepository } from '@core/cast-member/domain/cast-member.repository';
import { CAST_MEMBERS_PROVIDERS } from 'src/nest-modules/cast-members-module/cast-member.providers';
import { getVideoInsertPayload } from 'src/nest-modules/videos-module/testing/videoFixture';
import { v4 } from 'uuid';
import { IVideoRepository } from '@core/video/domain/video.repository';
import { VIDEOS_PROVIDERS } from 'src/nest-modules/videos-module/videos.providers';
import { VideoId } from '@core/video/domain/video.aggregate';

describe('Video Controller (e2e)', () => {
  describe('/video/:id (GET)', () => {
    const app = startApp();
    let genreRepo: IGenreRepository;
    let categoryRepo: ICategoryRepository;
    let castMemberRepo: ICastMemberRepository;
    let videoRepo: IVideoRepository;
    beforeEach(async () => {
      genreRepo = app.app.get<IGenreRepository>(
        GENRES_PROVIDERS.REPOSITORIES.GENRE_REPOSITORY.provide,
      );
      categoryRepo = app.app.get<ICategoryRepository>(
        CATEGORY_PROVIDERS.REPOSITORIES.CATEGORY_REPOSITORY.provide,
      );
      castMemberRepo = app.app.get<ICastMemberRepository>(
        CAST_MEMBERS_PROVIDERS.REPOSITORIES.CAST_MEMBER_REPOSITORY.provide,
      );
      videoRepo = app.app.get<IVideoRepository>(
        VIDEOS_PROVIDERS.REPOSITORIES.VIDEO_REPOSITORY.provide,
      );
    });
    it('should update a video by id', async () => {
      const { payload } = await getVideoInsertPayload(
        castMemberRepo,
        categoryRepo,
        genreRepo,
      );
      const resultPost = await request(app.app.getHttpServer())
        .post('/videos')
        .authenticate(app.app)
        .send(payload);

      const id = resultPost.body.data.id;
      await request(app.app.getHttpServer())
        .patch(`/videos/${id}`)
        .send({
          ...payload,
          title: 'new title',
        })
        .authenticate(app.app)
        .expect(200);
      const videoDb = await videoRepo.findById(new VideoId(id));
      expect(videoDb.title).toBe('new title');
    });
    it('should return 404 id  not found', async () => {
      await request(app.app.getHttpServer())
        .patch(`/videos/${v4()}`)
        .authenticate(app.app)
        .expect(404);
    });
    it('should return 422 invalid uuid', async () => {
      await request(app.app.getHttpServer())
        .patch(`/videos/sdksdaksadfksd`)
        .authenticate(app.app)
        .expect(422);
    });
  });
});
