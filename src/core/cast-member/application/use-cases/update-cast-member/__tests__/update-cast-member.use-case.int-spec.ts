import { CastMemberSequelizeRepository } from '@core/cast-member/infra/db/sequelize/cast-member-sequelize.repository';
import { NotFoundError } from '../../../../../shared/domain/errors/not-found-erros';
import { Uuid } from '../../../../../shared/domain/value-objects/uuid.vo';
import { setupSequelize } from '../../../../../shared/infra/testing/helpers';

import { UpdateCastMemberUseCase } from '../update-cast-member.use-case';
import { CastMember } from '@core/cast-member/domain/cast-member.entity';
import { CastMemberModel } from '@core/cast-member/infra/db/sequelize/cast-member.model';
import { CastMemberType } from '@core/cast-member/domain/cast-member-type-enum';

describe('UpdateCategoryUseCase Integration Tests', () => {
  let useCase: UpdateCastMemberUseCase;
  let repository: CastMemberSequelizeRepository;

  setupSequelize({ models: [CastMemberModel] });

  beforeEach(() => {
    repository = new CastMemberSequelizeRepository(CastMemberModel);
    useCase = new UpdateCastMemberUseCase(repository);
  });

  it('should throws error when entity not found', async () => {
    const uuid = new Uuid();
    await expect(() =>
      useCase.execute({
        id: uuid.id,
        name: 'fake',
        type: CastMemberType.ACTOR,
      }),
    ).rejects.toThrow(new NotFoundError(uuid.id, CastMember));
  });

  it('should update a CastMember type ', async () => {
    const entity = CastMember.fake().anActor().build();
    repository.insert(entity);

    const output = await useCase.execute({
      id: entity.cast_member_id.id,
      name: entity.name,
      type: CastMemberType.DIRECTOR,
    });
    expect(output).toStrictEqual({
      id: entity.cast_member_id.id,
      name: entity.name,
      type: CastMemberType.DIRECTOR,
      created_at: entity.created_at,
    });
  });

  it('should update a CastMember name ', async () => {
    const entity = CastMember.fake().anActor().build();
    repository.insert(entity);

    const output = await useCase.execute({
      id: entity.cast_member_id.id,
      name: entity.name,
      type: CastMemberType.DIRECTOR,
    });
    expect(output).toStrictEqual({
      id: entity.cast_member_id.id,
      name: entity.name,
      type: CastMemberType.DIRECTOR,
      created_at: entity.created_at,
    });
  });

  it('should update a CastMember name and type ', async () => {
    const entity = CastMember.fake().anActor().build();
    repository.insert(entity);

    const output = await useCase.execute({
      id: entity.cast_member_id.id,
      name: 'new name',
      type: CastMemberType.DIRECTOR,
    });
    expect(output).toStrictEqual({
      id: entity.cast_member_id.id,
      name: 'new name',
      type: CastMemberType.DIRECTOR,
      created_at: entity.created_at,
    });
  });
});
