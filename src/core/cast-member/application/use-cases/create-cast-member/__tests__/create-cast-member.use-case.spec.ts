import { CastMemberInMemoryRepository } from '@core/cast-member/infra/db/in-memory/cast-member.in-memory-repository';
import { CreateCastMemberUseCase } from '../create-cast-member.use-case';
import { CastMemberType } from '@core/cast-member/domain/cast-member-type-enum';

describe('CreateCategoryUseCase Unit Tests', () => {
  let useCase: CreateCastMemberUseCase;
  let repository: CastMemberInMemoryRepository;

  beforeEach(() => {
    repository = new CastMemberInMemoryRepository();
    useCase = new CreateCastMemberUseCase(repository);
  });

  it('should create a category', async () => {
    const spyInsert = jest.spyOn(repository, 'insert');
    let output = await useCase.execute({
      name: 'test',
      type: CastMemberType.ACTOR,
    });

    expect(spyInsert).toHaveBeenCalledTimes(1);
    expect(output).toStrictEqual({
      id: repository.items[0].cast_member_id.id,
      name: 'test',
      type: CastMemberType.ACTOR,
      created_at: repository.items[0].created_at,
    });

    output = await useCase.execute({
      name: 'test2',
      type: CastMemberType.DIRECTOR,
    });
    expect(spyInsert).toHaveBeenCalledTimes(2);
    expect(output).toStrictEqual({
      id: repository.items[1].cast_member_id.id,
      name: 'test2',
      type: CastMemberType.DIRECTOR,
      created_at: repository.items[1].created_at,
    });
  });
});
