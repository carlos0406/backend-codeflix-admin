import { setupSequelize } from '@core/shared/infra/testing/helpers';
import { CastMemberSequelizeRepository } from '../cast-member-sequelize.repository';
import { CastMemberModel } from '../cast-member.model';
import { CastMemberType } from '@core/cast-member/domain/cast-member-type-enum';
import { CastMember } from '@core/cast-member/domain/cast-member.entity';
import { NotFoundError } from '@core/shared/domain/errors/not-found-erros';
import { CastMemberModelMapper } from '../cast-member.model-maper';
import {
  CastMemberSearchParams,
  CastMemberSearchResult,
} from '@core/cast-member/domain/cast-member.repository';

describe('CastMemberSequelizeRepository Integration Test', () => {
  let repository: CastMemberSequelizeRepository;
  setupSequelize({ models: [CastMemberModel] });

  beforeEach(async () => {
    repository = new CastMemberSequelizeRepository(CastMemberModel);
  });

  it('should insert a cast member', async () => {
    const castMember = new CastMember({
      name: 'any_name',
      type: CastMemberType.DIRECTOR,
    });

    await repository.insert(castMember);
    const result = await CastMemberModel.findByPk(castMember.cast_member_id.id);
    expect(result).not.toBeNull();
  });

  it('shoud find a cast member by id', async () => {
    const castMember = new CastMember({
      name: 'any_name',
      type: CastMemberType.DIRECTOR,
    });

    await repository.insert(castMember);
    const result = await repository.findById(castMember.cast_member_id);
    expect(result).not.toBeNull();
  });

  it('shoud find all cast members', async () => {
    const castMember = new CastMember({
      name: 'any_name',
      type: CastMemberType.DIRECTOR,
    });

    await repository.insert(castMember);
    const result = await repository.findAll();
    console.log(result);
    expect(result).toHaveLength(1);
    expect(JSON.stringify(result)).toBe(JSON.stringify([castMember]));
  });

  it('shold throw error on update a non existing cast member', async () => {
    const castMember = new CastMember({
      name: 'any_name',
      type: CastMemberType.DIRECTOR,
    });

    await expect(repository.update(castMember)).rejects.toThrow(
      new NotFoundError(castMember.entity_id.id, CastMember),
    );
  });

  it('shold update a cast member', async () => {
    const castMember = new CastMember({
      name: 'any_name',
      type: CastMemberType.DIRECTOR,
    });

    await repository.insert(castMember);
    castMember.changeName('new_name');
    await repository.update(castMember);
    const result = await CastMemberModel.findByPk(castMember.cast_member_id.id);
    expect(result.name).toBe('new_name');
  });

  it('shold throw error on delete a non existing cast member', async () => {
    const castMember = new CastMember({
      name: 'any_name',
      type: CastMemberType.DIRECTOR,
    });

    await expect(repository.delete(castMember.cast_member_id)).rejects.toThrow(
      new NotFoundError(castMember.entity_id.id, CastMember),
    );
  });

  it('shold delete a cast member', async () => {
    const castMember = new CastMember({
      name: 'any_name',
      type: CastMemberType.DIRECTOR,
    });

    await repository.insert(castMember);
    await repository.delete(castMember.cast_member_id);
    const result = await CastMemberModel.findByPk(castMember.cast_member_id.id);
    expect(result).toBeNull();
  });

  describe('cast-member search method test', () => {
    it('should only apply paginate when other params are null', async () => {
      const created_at = new Date();
      const castMembers = CastMember.fake()
        .theCastMembers(16)
        .withName('name test')
        .withCreatedAt(created_at)
        .build();
      await repository.bulkInsert(castMembers);
      const spyToEntity = jest.spyOn(CastMemberModelMapper, 'toEntity');
      const searchOutput = await repository.search(
        new CastMemberSearchParams(),
      );

      expect(spyToEntity).toHaveBeenCalledTimes(15);
      expect(searchOutput).toBeInstanceOf(CastMemberSearchResult);
      expect(searchOutput.toJSON()).toMatchObject({
        total: 16,
        current_page: 1,
        per_page: 15,
        last_page: 2,
      });
      searchOutput.items.forEach((item) => {
        expect(item).toBeInstanceOf(CastMember);
        expect(item.cast_member_id).toBeDefined();
      });
      const items = searchOutput.items.map((item) => item.toJSON());
      expect(items).toMatchObject(
        new Array(15).fill({
          name: 'name test',
          created_at: created_at,
        }),
      );
    });
    it('should  order by created at desc when search params are null', async () => {
      const created_at = new Date();
      const castMembers = CastMember.fake()
        .theCastMembers(16)
        .withName((index) => `name ${index}`)
        .withCreatedAt((index) => new Date(created_at.getTime() + index))
        .build();

      await repository.bulkInsert(castMembers);
      const searchOutput = await repository.search(
        new CastMemberSearchParams(),
      );
      const items = searchOutput.items;
      [...items].reverse().forEach((item, index) => {
        expect(item.name).toBe(`${castMembers[index + 1].name}`);
      });
    });
    it('shoud search by name', async () => {
      const created_at = new Date();
      const castMembers = [
        new CastMember({
          name: 'carlos roberto',
          type: CastMemberType.DIRECTOR,
          created_at,
        }),
        new CastMember({
          name: 'carlos robson',
          type: CastMemberType.DIRECTOR,
          created_at,
        }),
        new CastMember({
          name: 'pedro roberto',
          type: CastMemberType.DIRECTOR,
          created_at,
        }),
      ];
      await repository.bulkInsert(castMembers);
      const searchParams = new CastMemberSearchParams({
        filter: {
          name: 'carlos',
        },
      });
      const searchOutput = await repository.search(searchParams);
      const items = searchOutput.items;
      expect(items).toHaveLength(2);
      expect(items[0].name).toBe('carlos roberto');
      expect(items[1].name).toBe('carlos robson');
    });
    it('shoud search by type', async () => {
      const created_at = new Date();
      const castMembers = [
        new CastMember({
          name: 'carlos roberto',
          type: CastMemberType.DIRECTOR,
          created_at,
        }),
        new CastMember({
          name: 'carlos robson',
          type: CastMemberType.ACTOR,
          created_at,
        }),
        new CastMember({
          name: 'pedro roberto',
          type: CastMemberType.DIRECTOR,
          created_at,
        }),
      ];
      await repository.bulkInsert(castMembers);
      const searchParams = new CastMemberSearchParams({
        filter: {
          type: CastMemberType.DIRECTOR,
        },
      });
      const searchOutput = await repository.search(searchParams);
      const items = searchOutput.items;
      expect(items).toHaveLength(2);
      expect(items[0].name).toBe('carlos roberto');
      expect(items[1].name).toBe('pedro roberto');
    });
    it('should apply paginate and filter by name', async () => {
      const created_at = new Date();
      const castMembers = CastMember.fake()
        .theCastMembers(16)
        .withName('name test')
        .withCreatedAt(created_at)
        .build();
      await repository.bulkInsert(castMembers);
      const searchParams = new CastMemberSearchParams({
        filter: {
          name: 'name test',
        },
        page: 2,
        per_page: 5,
      });
      const searchOutput = await repository.search(searchParams);
      expect(searchOutput).toBeInstanceOf(CastMemberSearchResult);
      expect(searchOutput.toJSON()).toMatchObject({
        total: 16,
        current_page: 2,
        per_page: 5,
        last_page: 4,
      });
      searchOutput.items.forEach((item) => {
        expect(item).toBeInstanceOf(CastMember);
        expect(item.cast_member_id).toBeDefined();
      });
      const items = searchOutput.items.map((item) => item.toJSON());
      expect(items).toMatchObject(
        new Array(5).fill({
          name: 'name test',
          created_at: created_at,
        }),
      );
    });

    it('should apply paginate and filter by type', async () => {
      const created_at = new Date();
      const castMembersDirectors = CastMember.fake()
        .theCastMembers(8)
        .withType(CastMemberType.DIRECTOR)
        .withCreatedAt(created_at)
        .build();

      const castMembersActors = CastMember.fake()
        .theCastMembers(8)
        .withType(CastMemberType.ACTOR)
        .withCreatedAt(created_at)
        .build();
      await repository.bulkInsert([
        ...castMembersDirectors,
        ...castMembersActors,
      ]);
      const searchParams = new CastMemberSearchParams({
        filter: {
          type: CastMemberType.DIRECTOR,
        },
        page: 1,
        per_page: 4,
      });
      const searchOutput = await repository.search(searchParams);
      console.log(searchOutput);
      expect(searchOutput).toBeInstanceOf(CastMemberSearchResult);
      expect(searchOutput.toJSON()).toMatchObject({
        total: 8,
        current_page: 1,
        per_page: 4,
        last_page: 2,
      });
      expect(searchOutput.items).toHaveLength(4);
      searchOutput.items.forEach((item) => {
        expect(item).toBeInstanceOf(CastMember);
        expect(item.cast_member_id).toBeDefined();
      });
    });

    it('should search using filter, sort and paginate', async () => {
      const created_at = new Date();
      const castMembers = [
        new CastMember({
          name: 'carlos rabelo',
          type: CastMemberType.DIRECTOR,
          created_at: new Date(created_at.getTime() + 30),
        }),
        new CastMember({
          name: 'carlos robson',
          type: CastMemberType.ACTOR,
          created_at: new Date(created_at.getTime() + 10),
        }),
        new CastMember({
          name: 'cedro roberto',
          type: CastMemberType.DIRECTOR,
          created_at: new Date(created_at.getTime() + 5),
        }),
      ];
      await repository.bulkInsert(castMembers);
      const searchOutput = await repository.search(
        new CastMemberSearchParams({
          filter: {
            name: 'carlos',
          },
          sort: 'created_at',
          sort_dir: 'desc',
          page: 1,
          per_page: 1,
        }),
      );
      expect(searchOutput).toBeInstanceOf(CastMemberSearchResult);
      expect(searchOutput.toJSON()).toMatchObject({
        total: 2,
        current_page: 1,
        per_page: 1,
        last_page: 2,
      });
      expect(searchOutput.items).toHaveLength(1);
      const items = searchOutput.items.map((item) => item.toJSON());
      expect(items).toMatchObject([
        {
          name: 'carlos rabelo',
          created_at: new Date(created_at.getTime() + 30),
        },
      ]);
      const searchOutput2 = await repository.search(
        new CastMemberSearchParams({
          filter: {
            name: 'carlos',
          },
          sort: 'created_at',
          sort_dir: 'asc',
          page: 1,
          per_page: 1,
        }),
      );
      expect(searchOutput2).toBeInstanceOf(CastMemberSearchResult);
      expect(searchOutput2.toJSON()).toMatchObject({
        total: 2,
        current_page: 1,
        per_page: 1,
        last_page: 2,
      });

      expect(searchOutput2.items).toHaveLength(1);
      const items2 = searchOutput2.items.map((item) => item.toJSON());
      expect(items2).toMatchObject([
        {
          name: 'carlos robson',
          created_at: new Date(created_at.getTime() + 10),
        },
      ]);
    });
  });
});
