import request from 'supertest';
import { IGenreRepository } from '../../src/core/genre/domain/genre.repository';
import { startApp } from '../../src/nest-modules/shared-module/testing/helpers';
import { GENRES_PROVIDERS } from '../../src/nest-modules/genres-module/genres.providers';
import { ICategoryRepository } from '../../src/core/category/domain/category.repository';
import { CATEGORY_PROVIDERS } from '../../src/nest-modules/categories-module/categories.providers';
import { ICastMemberRepository } from '@core/cast-member/domain/cast-member.repository';
import { CAST_MEMBERS_PROVIDERS } from 'src/nest-modules/cast-members-module/cast-member.providers';
import { generateVideoPayloads } from 'src/nest-modules/videos-module/testing/videoFixture';
import { CreateVideoUseCase } from '@core/video/application/use-cases/create-video/create-video.use-case';
import { VIDEOS_PROVIDERS } from 'src/nest-modules/videos-module/videos.providers';

describe('Video Controller (e2e)', () => {
  describe('/video/:id (GET)', () => {
    const app = startApp();
    let genreRepo: IGenreRepository;
    let categoryRepo: ICategoryRepository;
    let castMemberRepo: ICastMemberRepository;
    let createUseCase: CreateVideoUseCase;
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
      createUseCase = app.app.get<CreateVideoUseCase>(
        VIDEOS_PROVIDERS.USE_CASES.CREATE_VIDEO_USE_CASE.provide,
      );
    });
    it('should list videos with pagination', async () => {
      const { payloads } = await generateVideoPayloads(
        castMemberRepo,
        categoryRepo,
        genreRepo,
      );
      for (const payload of payloads) {
        await createUseCase.execute(payload);
      }

      let params = new URLSearchParams({ per_page: '2', page: '1' });
      let res = await request(app.app.getHttpServer()).get(
        `/videos?${params.toString()}`,
      );

      expect(res.body.data.items.length).toBe(2);
      expect(res.body.data.total).toBe(payloads.length);

      params = new URLSearchParams({ per_page: '2', page: '2' });
      res = await request(app.app.getHttpServer()).get(
        `/videos?${params.toString()}`,
      );
      expect(res.body.data.items.length).toBe(2);
      expect(res.body.data.total).toBe(payloads.length);

      params = new URLSearchParams({ per_page: '4', page: '3' });
      res = await request(app.app.getHttpServer()).get(
        `/videos?${params.toString()}`,
      );
      expect(res.body.data.items.length).toBe(2);
      expect(res.body.data.total).toBe(payloads.length);
    });

    it('should list videos filtered by genre', async () => {
      const { payloads, genres } = await generateVideoPayloads(
        castMemberRepo,
        categoryRepo,
        genreRepo,
      );
      for (const payload of payloads) {
        await createUseCase.execute(payload);
      }
      const params = new URLSearchParams({
        'genres_id[]': genres[0].genre_id.id,
      });
      const res = await request(app.app.getHttpServer()).get(
        `/videos?${params.toString()}`,
      );
      expect(res.body.data.items.length).toBe(1);
    });

    it('should list videos filtered by cast member', async () => {
      const { payloads, castMembers } = await generateVideoPayloads(
        castMemberRepo,
        categoryRepo,
        genreRepo,
      );
      for (const payload of payloads) {
        await createUseCase.execute(payload);
      }

      try {
        const params = new URLSearchParams({
          'cast_members_id[]': castMembers[0].cast_member_id.id,
        });
        const res = await request(app.app.getHttpServer()).get(
          `/videos?${params.toString()}`,
        );
        expect(res.body.data.items.length).toBe(8);
      } catch (e) {
        console.log(e);
        throw e;
      }
    });

    it('should list videos filtered by category', async () => {
      const { payloads, categories } = await generateVideoPayloads(
        castMemberRepo,
        categoryRepo,
        genreRepo,
      );
      for (const payload of payloads) {
        await createUseCase.execute(payload);
      }

      const params = new URLSearchParams({
        'categories_id[]': [categories[0].category_id.id],
      } as any);
      const res = await request(app.app.getHttpServer()).get(
        `/videos?${params.toString()}`,
      );
      expect(res.body.data.items.length).toBe(8);
    });

    it('should list videos filtered by title', async () => {
      const { payloads } = await generateVideoPayloads(
        castMemberRepo,
        categoryRepo,
        genreRepo,
      );
      for (const payload of payloads) {
        await createUseCase.execute(payload);
      }

      const params = new URLSearchParams({
        title: 'The Lord of the Rings',
      });
      const res = await request(app.app.getHttpServer()).get(
        `/videos?${params.toString()}`,
      );
      expect(res.body.data.items.length).toBe(1);
      expect(res.body.data.items[0].title).toBe('The Lord of the Rings');
    });
  });
});
