import { CastMember } from '@core/cast-member/domain/cast-member.entity';
import { CastMemberInMemoryRepository } from './cast-member.in-memory-repository';
import { CastMemberType } from '@core/cast-member/domain/cast-member-type-enum';

describe('CastMember InMemory repository', () => {
  let repository: CastMemberInMemoryRepository;
  beforeEach(() => (repository = new CastMemberInMemoryRepository()));

  it('should no filter items when filter object is null', async () => {
    const items = [
      CastMember.create({ name: 'test', type: CastMemberType.ACTOR }),
    ];
    const filterSpy = jest.spyOn(items, 'filter' as any);

    const itemsFiltered = await repository['applyFilter'](items, null);
    expect(filterSpy).not.toHaveBeenCalled();
    expect(itemsFiltered).toStrictEqual(items);
  });
  it('should filter items using type filter param', async () => {
    const items = [
      CastMember.create({ name: 'TEST', type: CastMemberType.ACTOR }),
      CastMember.create({ name: 'TEST', type: CastMemberType.DIRECTOR }),
      CastMember.create({ name: 'fake', type: CastMemberType.ACTOR }),
    ];
    const filterSpy = jest.spyOn(items, 'filter' as any);

    const itemsFiltered = await repository['applyFilter'](items, {
      type: CastMemberType.ACTOR,
    });
    expect(filterSpy).toHaveBeenCalledTimes(1);
    expect(itemsFiltered).toStrictEqual([items[0], items[2]]);
  });

  it('should filter items using name filter param', async () => {
    const items = [
      CastMember.create({ name: 'robson', type: CastMemberType.ACTOR }),
      CastMember.create({ name: 'TEST', type: CastMemberType.DIRECTOR }),
      CastMember.create({ name: 'fake', type: CastMemberType.ACTOR }),
    ];
    const filterSpy = jest.spyOn(items, 'filter' as any);

    const itemsFiltered = await repository['applyFilter'](items, {
      name: 'robson',
    });
    expect(filterSpy).toHaveBeenCalledTimes(1);
    expect(itemsFiltered).toStrictEqual([items[0]]);
  });
  it('should filter items using all filter parameters', async () => {
    const items = [
      CastMember.create({ name: 'test', type: CastMemberType.ACTOR }),
      CastMember.create({ name: 'TEST', type: CastMemberType.DIRECTOR }),
      CastMember.create({ name: 'fake', type: CastMemberType.ACTOR }),
    ];
    const filterSpy = jest.spyOn(items, 'filter' as any);

    const itemsFiltered = await repository['applyFilter'](items, {
      name: 'TEST',
      type: CastMemberType.DIRECTOR,
    });
    expect(filterSpy).toHaveBeenCalledTimes(1);
    expect(itemsFiltered).toStrictEqual([items[1]]);
  });

  it('should sort by created_at when sort param is null', async () => {
    const created_at = new Date();

    const items = [
      new CastMember({
        name: 'test',
        created_at,
        type: CastMemberType.ACTOR,
      }),
      new CastMember({
        name: 'TEST',
        created_at: new Date(created_at.getTime() + 100),
        type: CastMemberType.DIRECTOR,
      }),
      new CastMember({
        name: 'fake',
        created_at: new Date(created_at.getTime() + 200),
        type: CastMemberType.ACTOR,
      }),
    ];

    const itemsSorted = repository['applySort'](items, null, null);
    expect(itemsSorted).toStrictEqual([items[2], items[1], items[0]]);
  });

  it('should sort by name', async () => {
    const items = [
      new CastMember({
        name: 'B',
        type: CastMemberType.ACTOR,
      }),
      new CastMember({
        name: 'D',
        type: CastMemberType.DIRECTOR,
      }),
      new CastMember({
        name: 'C',
        type: CastMemberType.ACTOR,
      }),
    ];

    const itemsSorted = repository['applySort'](items, 'name', 'asc');
    expect(itemsSorted).toStrictEqual([items[0], items[2], items[1]]);
  });
});
