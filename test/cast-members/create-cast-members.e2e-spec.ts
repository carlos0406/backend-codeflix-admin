import { CastMemberType } from '@core/cast-member/domain/cast-member-type-enum';
import { ICastMemberRepository } from '@core/cast-member/domain/cast-member.repository';
import { CAST_MEMBERS_PROVIDERS } from 'src/nest-modules/cast-members-module/cast-member.providers';
import { startApp } from 'src/nest-modules/shared-module/testing/helpers';
import request from 'supertest';

describe('cast members e2e', () => {
  const appHelper = startApp();
  let castMemberRepo: ICastMemberRepository;

  beforeEach(async () => {
    castMemberRepo = appHelper.app.get<ICastMemberRepository>(
      CAST_MEMBERS_PROVIDERS.REPOSITORIES.CAST_MEMBER_REPOSITORY.provide,
    );
  });
  describe('/cast-members (POST)', () => {
    it('should error when create a cast member with invalid name', async () => {
      async () => {
        const response = await request(appHelper.app.getHttpServer())
          .post('/cast-members')
          .send({
            type: CastMemberType.DIRECTOR,
          });
        expect(response.status).toBe(422);
        expect(response.body.message).toEqual([
          'name should not be empty',
          'name must be a string',
        ]);
        const repoResult = await castMemberRepo.findAll();
        expect(repoResult).toHaveLength(0);
      };
    });

    it('should error when create a cast member with invalid type', async () => {
      const response = await request(appHelper.app.getHttpServer())
        .post('/cast-members')
        .send({
          name: 'name',
          type: 3,
        });
      expect(response.status).toBe(422);

      expect(response.body.message).toEqual([
        'type must be one of the following values: 1, 2',
      ]);
      const repoResult = await castMemberRepo.findAll();
      expect(repoResult).toHaveLength(0);
    });

    it('should create a cast member actor', async () => {
      const response = await request(appHelper.app.getHttpServer())
        .post('/cast-members')
        .send({
          name: 'name',
          type: CastMemberType.ACTOR,
        });
      expect(response.status).toBe(201);
      expect(response.body.data).toEqual({
        id: expect.any(String),
        name: 'name',
        type: CastMemberType.ACTOR,
        created_at: expect.any(String),
      });
      const repoResult = await castMemberRepo.findAll();
      expect(repoResult).toHaveLength(1);
      expect(repoResult[0]).toEqual(
        expect.objectContaining({
          name: 'name',
          type: CastMemberType.ACTOR,
        }),
      );
    });

    it('should create a cast member director', async () => {
      const response = await request(appHelper.app.getHttpServer())
        .post('/cast-members')
        .send({
          name: 'name',
          type: CastMemberType.DIRECTOR,
        });
      expect(response.status).toBe(201);
      expect(response.body.data).toEqual({
        id: expect.any(String),
        name: 'name',
        type: CastMemberType.DIRECTOR,
        created_at: expect.any(String),
      });
      const repoResult = await castMemberRepo.findAll();
      expect(repoResult).toHaveLength(1);
      expect(repoResult[0]).toEqual(
        expect.objectContaining({
          name: 'name',
          type: CastMemberType.DIRECTOR,
        }),
      );
    });
  });
});
