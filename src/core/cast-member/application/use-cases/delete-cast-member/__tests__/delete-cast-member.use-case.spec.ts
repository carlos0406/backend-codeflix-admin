import { CastMemberInMemoryRepository } from '@core/cast-member/infra/db/in-memory/cast-member.in-memory-repository';
import { NotFoundError } from '../../../../../shared/domain/errors/not-found-erros';
import {
  InvalidUuidError,
  Uuid,
} from '../../../../../shared/domain/value-objects/uuid.vo';
import { CastMember } from '../../../../domain/cast-member.entity';
import { DeleteCastMemberUseCase } from '../delete-cast-member.use-case';
import { CastMemberType } from '@core/cast-member/domain/cast-member-type-enum';

describe('DeleteCastMemberUseCase Unit Tests', () => {
  let useCase: DeleteCastMemberUseCase;
  let repository: CastMemberInMemoryRepository;

  beforeEach(() => {
    repository = new CastMemberInMemoryRepository();
    useCase = new DeleteCastMemberUseCase(repository);
  });

  it('should throws error when entity not found', async () => {
    await expect(() => useCase.execute({ id: 'fake id' })).rejects.toThrow(
      new InvalidUuidError(),
    );

    const uuid = new Uuid();

    await expect(() => useCase.execute({ id: uuid.id })).rejects.toThrow(
      new NotFoundError(uuid, CastMember),
    );
  });

  it('should delete a cast-member', async () => {
    const items = [
      new CastMember({ name: 'test 1', type: CastMemberType.ACTOR }),
    ];
    repository.items = items;
    await useCase.execute({
      id: items[0].cast_member_id.id,
    });
    expect(repository.items).toHaveLength(0);
  });
});
