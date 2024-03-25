import { CastMemberInMemoryRepository } from '@core/cast-member/infra/db/in-memory/cast-member.in-memory-repository';
import { NotFoundError } from '../../../../../shared/domain/errors/not-found-erros';
import {
  InvalidUuidError,
  Uuid,
} from '../../../../../shared/domain/value-objects/uuid.vo';
import { UpdateCastMemberUseCase } from '../update-cast-member.use-case';
import { CastMemberType } from '@core/cast-member/domain/cast-member-type-enum';
import { CastMember } from '@core/cast-member/domain/cast-member.entity';

describe('UpdateCategoryUseCase Unit Tests', () => {
  let useCase: UpdateCastMemberUseCase;
  let repository: CastMemberInMemoryRepository;

  beforeEach(() => {
    repository = new CastMemberInMemoryRepository();
    useCase = new UpdateCastMemberUseCase(repository);
  });

  it('should throws error when entity not found', async () => {
    await expect(() =>
      useCase.execute({
        id: 'fake id',
        name: 'fake',
        type: CastMemberType.ACTOR,
      }),
    ).rejects.toThrow(new InvalidUuidError());

    const uuid = new Uuid();

    await expect(() =>
      useCase.execute({
        id: uuid.id,
        name: 'fake',
        type: CastMemberType.ACTOR,
      }),
    ).rejects.toThrow(new NotFoundError(uuid.id, CastMember));
  });

  it('should update a category', async () => {
    const spyUpdate = jest.spyOn(repository, 'update');
    const entity = new CastMember({ name: 'test', type: CastMemberType.ACTOR });
    repository.items = [entity];

    const output = await useCase.execute({
      id: entity.cast_member_id.id,
      name: 'test',
      type: CastMemberType.DIRECTOR,
    });
    expect(spyUpdate).toHaveBeenCalledTimes(1);
    expect(output).toStrictEqual({
      id: entity.cast_member_id.id,
      name: 'test',
      type: CastMemberType.DIRECTOR,
      created_at: entity.created_at,
    });
  });
});
