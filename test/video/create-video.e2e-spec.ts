import request from 'supertest';
import { IGenreRepository } from '../../src/core/genre/domain/genre.repository';
import { startApp } from '../../src/nest-modules/shared-module/testing/helpers';
import { GENRES_PROVIDERS } from '../../src/nest-modules/genres-module/genres.providers';
import { ICategoryRepository } from '../../src/core/category/domain/category.repository';
import { CATEGORY_PROVIDERS } from '../../src/nest-modules/categories-module/categories.providers';
import { ICastMemberRepository } from '@core/cast-member/domain/cast-member.repository';
import { CAST_MEMBERS_PROVIDERS } from 'src/nest-modules/cast-members-module/cast-member.providers';
import { getVideoInsertPayload } from 'src/nest-modules/videos-module/testing/videoFixture';

describe('Video Controller (e2e)', () => {
  describe('/videos (POST)', () => {
    const app = startApp();
    let genreRepo: IGenreRepository;
    let categoryRepo: ICategoryRepository;
    let castMemberRepo: ICastMemberRepository;
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
    });
    it('should create a video', async () => {
      const { payload } = await getVideoInsertPayload(
        castMemberRepo,
        categoryRepo,
        genreRepo,
      );
      await request(app.app.getHttpServer())
        .post('/videos')
        .send(payload)
        .expect(201);
    });
    it('should throw entity validation error', async () => {
      await request(app.app.getHttpServer())
        .post('/videos')
        .send({ error: 'qualquer_valor' })
        .expect(422);

      const { payload } = await getVideoInsertPayload(
        castMemberRepo,
        categoryRepo,
        genreRepo,
      );

      payload.title = 'a'.repeat(300);
      await request(app.app.getHttpServer())
        .post('/videos')
        .send(payload)
        .expect(422);
    });
  });
});
