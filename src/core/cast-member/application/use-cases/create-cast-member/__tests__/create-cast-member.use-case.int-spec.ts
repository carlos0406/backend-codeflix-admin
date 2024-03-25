import { CastMemberSequelizeRepository } from '@core/cast-member/infra/db/sequelize/cast-member-sequelize.repository';
import { setupSequelize } from '../../../../../shared/infra/testing/helpers';
import { CreateCastMemberUseCase } from '../create-cast-member.use-case';
import { CastMemberModel } from '@core/cast-member/infra/db/sequelize/cast-member.model';
import { CastMemberType } from '@core/cast-member/domain/cast-member-type-enum';
import { CastMemberId } from '@core/cast-member/domain/cast-member.entity';

describe('CreateCategoryUseCase Integration Tests', () => {
  let useCase: CreateCastMemberUseCase;
  let repository: CastMemberSequelizeRepository;

  setupSequelize({ models: [CastMemberModel] });

  beforeEach(() => {
    repository = new CastMemberSequelizeRepository(CastMemberModel);
    useCase = new CreateCastMemberUseCase(repository);
  });

  it('should create a category', async () => {
    let output = await useCase.execute({
      name: 'test',
      type: CastMemberType.ACTOR,
    });
    let entity = await repository.findById(new CastMemberId(output.id));

    expect(output).toStrictEqual({
      id: entity.cast_member_id.id,
      name: 'test',
      type: CastMemberType.ACTOR,
      created_at: entity.created_at,
    });
    output = await useCase.execute({
      name: 'test',
      type: CastMemberType.DIRECTOR,
    });
    entity = await repository.findById(new CastMemberId(output.id));
    expect(output).toStrictEqual({
      id: entity.cast_member_id.id,
      name: 'test',
      type: CastMemberType.DIRECTOR,
      created_at: entity.created_at,
    });
  });
});
