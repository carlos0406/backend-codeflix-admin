import { CastMemberType } from '@core/cast-member/domain/cast-member-type-enum';
import { CastMember } from '@core/cast-member/domain/cast-member.entity';
import { ICastMemberRepository } from '@core/cast-member/domain/cast-member.repository';
import { CAST_MEMBERS_PROVIDERS } from 'src/nest-modules/cast-members-module/cast-member.providers';
import { startApp } from 'src/nest-modules/shared-module/testing/helpers';
import request from 'supertest';
describe('CastMembersController (e2e)', () => {
  const nestApp = startApp();
  describe('/update/:id (PUT)', () => {
    describe('should a response error when id is invalid or not found', () => {
      const arrange = [
        {
          id: '88ff2587-ce5a-4769-a8c6-1d63d29c5f7a',
          expected: {
            message:
              'CastMember Not Found using ID 88ff2587-ce5a-4769-a8c6-1d63d29c5f7a',
            statusCode: 404,
            error: 'Not Found',
          },
        },
        {
          id: 'id fakeaaaaa',
          expected: {
            statusCode: 422,
            message: 'Validation failed (uuid is expected)',
            error: 'Unprocessable Entity',
          },
        },
      ];
      test.each(arrange)('when id is $id', async ({ id, expected }) => {
        console.log(id);
        return request(nestApp.app.getHttpServer())
          .patch(`/cast-members/${id}`)
          .expect(expected.statusCode)
          .expect(expected);
      });
    });
    it('should update a cast member', async () => {
      const castmemberRepo = nestApp.app.get<ICastMemberRepository>(
        CAST_MEMBERS_PROVIDERS.REPOSITORIES.CAST_MEMBER_REPOSITORY.provide,
      );
      const castMember = CastMember.fake().aDirector().build();
      await castmemberRepo.insert(castMember);
      const response = await request(nestApp.app.getHttpServer())
        .patch(`/cast-members/${castMember.cast_member_id.id}`)
        .send({
          name: 'New Name',
          type: CastMemberType.ACTOR,
        })
        .expect(200);
      expect(response.body.data).toEqual(
        expect.objectContaining({
          id: castMember.cast_member_id.id,
          name: 'New Name',
          type: CastMemberType.ACTOR,
        }),
      );
    });
  });
});
