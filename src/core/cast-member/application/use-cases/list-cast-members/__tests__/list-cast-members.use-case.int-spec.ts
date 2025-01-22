import { CastMemberType } from '@core/cast-member/domain/cast-member-type-enum';
import { setupSequelize } from '../../../../../shared/infra/testing/helpers';
import { CastMember } from '../../../../domain/cast-member.entity';
import { CastMemberSequelizeRepository } from '../../../../infra/db/sequelize/cast-member-sequelize.repository';
import { CastMemberModel } from '../../../../infra/db/sequelize/cast-member.model';
import { CastMemberOutputMapper } from '../../common/cast-member-output';
import { ListCastMembersUseCase } from '../list-cast-members.use-case';

describe('ListCategoriesUseCase Integration Tests', () => {
  let useCase: ListCastMembersUseCase;
  let repository: CastMemberSequelizeRepository;

  setupSequelize({ models: [CastMemberModel] });

  beforeEach(() => {
    repository = new CastMemberSequelizeRepository(CastMemberModel);
    useCase = new ListCastMembersUseCase(repository);
  });

  it('should return output sorted by created_at when input param is empty', async () => {
    const items = [
      new CastMember({ name: 'test 1', type: CastMemberType.ACTOR }),
      new CastMember({ name: 'test 2', type: CastMemberType.DIRECTOR }),
    ];

    await repository.bulkInsert(items);

    const output = await useCase.execute({});
    expect(output.total).toBe(2);
    expect(output.current_page).toBe(1);
    expect(output.per_page).toBe(15);
    expect(output.items).toHaveLength(2);
    expect(output.items[0]).toStrictEqual(
      CastMemberOutputMapper.toOutput(items[0]),
    );
    expect(output.items[1]).toStrictEqual(
      CastMemberOutputMapper.toOutput(items[1]),
    );
  });

  it('should returns output using pagination, sort and filter', async () => {
    const castMembers = [
      CastMember.fake().anActor().withName('Robson').build(),
      CastMember.fake().anActor().withName('Pedrooooo').build(),
      CastMember.fake().aDirector().withName('Pedro').build(),
      CastMember.fake().anActor().withName('Pedrinho').build(),
      CastMember.fake().aDirector().withName('Diretorzinho').build(),
      CastMember.fake().aDirector().withName('Diretorzinho2').build(),
    ];
    await repository.bulkInsert(castMembers);
    let output = await useCase.execute({
      page: 1,
      per_page: 2,
      sort: 'name',
      filter: { name: 'Pedr', type: CastMemberType.ACTOR },
    });
    expect(output).toEqual({
      items: [castMembers[3], castMembers[1]].map(
        CastMemberOutputMapper.toOutput,
      ),
      total: 2,
      current_page: 1,
      per_page: 2,
      last_page: 1,
    });

    output = await useCase.execute({
      page: 1,
      per_page: 2,
      sort: 'name',
      filter: { name: 'diretor', type: CastMemberType.DIRECTOR },
    });

    expect(output).toEqual({
      items: [castMembers[4], castMembers[5]].map(
        CastMemberOutputMapper.toOutput,
      ),
      total: 2,
      current_page: 1,
      per_page: 2,
      last_page: 1,
    });

    output = await useCase.execute({
      page: 3,
      per_page: 2,
      sort: 'name',
      sort_dir: 'desc',
    });
    expect(output).toEqual({
      items: [castMembers[5], castMembers[4]].map(
        CastMemberOutputMapper.toOutput,
      ),
      total: 6,
      current_page: 3,
      per_page: 2,
      last_page: 3,
    });

    output = await useCase.execute({
      page: 1,
      per_page: 2,
      sort: 'created_at',
      sort_dir: 'asc',
    });
    expect(output).toEqual({
      items: [castMembers[0], castMembers[1]].map(
        CastMemberOutputMapper.toOutput,
      ),
      total: 6,
      current_page: 1,
      per_page: 2,
      last_page: 3,
    });
    output = await useCase.execute({
      page: 2,
      per_page: 2,
      sort: 'created_at',
      sort_dir: 'asc',
    });
    expect(output).toEqual({
      items: [castMembers[2], castMembers[3]].map(
        CastMemberOutputMapper.toOutput,
      ),
      total: 6,
      current_page: 2,
      per_page: 2,
      last_page: 3,
    });

    output = await useCase.execute({
      page: 3,
      per_page: 2,
      sort: 'created_at',
      sort_dir: 'asc',
    });
    expect(output).toEqual({
      items: [castMembers[4], castMembers[5]].map(
        CastMemberOutputMapper.toOutput,
      ),
      total: 6,
      current_page: 3,
      per_page: 2,
      last_page: 3,
    });
  });
});
