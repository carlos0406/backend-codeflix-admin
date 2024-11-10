import { CastMemberSequelizeRepository } from '@core/cast-member/infra/db/sequelize/cast-member-sequelize.repository';
import { NotFoundError } from '../../../../../shared/domain/errors/not-found-erros';
import { Uuid } from '../../../../../shared/domain/value-objects/uuid.vo';
import { setupSequelize } from '../../../../../shared/infra/testing/helpers';
import { CastMember } from '../../../../domain/cast-member.entity';
import { CastMemberModel } from '../../../../infra/db/sequelize/cast-member.model';
import { GetCastMemberUseCase } from '../get-cast-member.use-case';

describe('GetCastMemberUseCase Integration Tests', () => {
  let useCase: GetCastMemberUseCase;
  let repository: CastMemberSequelizeRepository;

  setupSequelize({ models: [CastMemberModel] });

  beforeEach(() => {
    repository = new CastMemberSequelizeRepository(CastMemberModel);
    useCase = new GetCastMemberUseCase(repository);
  });

  it('should throws error when entity not found', async () => {
    const uuid = new Uuid();
    await expect(() => useCase.execute({ id: uuid.id })).rejects.toThrow(
      new NotFoundError(uuid.id, CastMember),
    );
  });

  it('should returns a category', async () => {
    const castMember = CastMember.fake().anActor().build();
    await repository.insert(castMember);
    const output = await useCase.execute({ id: castMember.cast_member_id.id });
    expect(output).toStrictEqual({
      id: castMember.cast_member_id.id,
      name: castMember.name,
      created_at: castMember.created_at,
      type: castMember.type,
    });
  });
});
