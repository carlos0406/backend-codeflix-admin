import { CastMemberInMemoryRepository } from '@core/cast-member/infra/db/in-memory/cast-member.in-memory-repository';
import { NotFoundError } from '../../../../../shared/domain/errors/not-found-erros';
import {
  InvalidUuidError,
  Uuid,
} from '../../../../../shared/domain/value-objects/uuid.vo';
import { CastMember } from '../../../../domain/cast-member.entity';
import { GetCastMemberUseCase } from '../get-cast-member.use-case';
import { CastMemberType } from '@core/cast-member/domain/cast-member-type-enum';

describe('GetCastMemberUseCase Unit Tests', () => {
  let useCase: GetCastMemberUseCase;
  let repository: CastMemberInMemoryRepository;

  beforeEach(() => {
    repository = new CastMemberInMemoryRepository();
    useCase = new GetCastMemberUseCase(repository);
  });

  it('should throws error when entity not found', async () => {
    await expect(() => useCase.execute({ id: 'fake id' })).rejects.toThrow(
      new InvalidUuidError(),
    );

    const uuid = new Uuid();
    await expect(() => useCase.execute({ id: uuid.id })).rejects.toThrow(
      new NotFoundError(uuid.id, CastMember),
    );
  });

  it('should returns a category', async () => {
    const items = [
      CastMember.create({ name: 'test', type: CastMemberType.ACTOR }),
    ];
    repository.items = items;
    const spyFindById = jest.spyOn(repository, 'findById');
    const output = await useCase.execute({ id: items[0].cast_member_id.id });
    expect(spyFindById).toHaveBeenCalledTimes(1);
    expect(output).toStrictEqual({
      id: items[0].cast_member_id.id,
      name: 'test',
      type: CastMemberType.ACTOR,
      created_at: items[0].created_at,
    });
  });
});
