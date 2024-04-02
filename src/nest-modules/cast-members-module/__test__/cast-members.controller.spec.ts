import { CastMemberType } from '@core/cast-member/domain/cast-member-type-enum';
import { CastMembersController } from '../cast-members.controller';
import {
  CastMemberCollectionPresenter,
  CastMemberPresenter,
} from '../cast-member.preseter';
import { SearchCastMemberDto } from '../dto/search-cast-member.dto';

describe('CastMembersController unit test', () => {
  let controller: CastMembersController;

  beforeEach(async () => {
    controller = new CastMembersController();
  });

  it('should creates a cast member', async () => {
    //Arrange
    const output = {
      id: '9366b7dc-2d71-4799-b91c-c64adb205104',
      name: 'Actor',
      type: CastMemberType.ACTOR,
      created_at: new Date(),
    };
    const mockCreateUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    };
    //@ts-expect-error defined part of methods
    controller['createUseCase'] = mockCreateUseCase;
    const input = {
      name: 'Actor',
      type: 1,
    };

    //Act
    const presenter = await controller.create(input);

    //Assert
    expect(mockCreateUseCase.execute).toHaveBeenCalledWith(input);
    expect(presenter).toBeInstanceOf(CastMemberPresenter);
    expect(presenter).toStrictEqual(new CastMemberPresenter(output));
  });

  it('should updates a cast member', async () => {
    const id = '9366b7dc-2d71-4799-b91c-c64adb205104';
    const output = {
      id,
      name: 'Actor',
      type: CastMemberType.ACTOR,
      created_at: new Date(),
    };
    const mockUpdateUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    };
    //@ts-expect-error defined part of methods
    controller['updateUseCase'] = mockUpdateUseCase;
    const input = {
      name: 'Actor',
      type: 1,
    };
    const presenter = await controller.update(id, input);
    expect(mockUpdateUseCase.execute).toHaveBeenCalledWith({ id, ...input });
    expect(presenter).toBeInstanceOf(CastMemberPresenter);
    expect(presenter).toStrictEqual(new CastMemberPresenter(output));
  });

  it('should delete a cast member', async () => {
    const id = '9366b7dc-2d71-4799-b91c-c64adb205104';

    const mockDeleteUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve()),
    };
    //@ts-expect-error defined part of methods
    controller['deleteUseCase'] = mockDeleteUseCase;
    await controller.remove(id);
    expect(mockDeleteUseCase.execute).toHaveBeenCalledWith({ id });
  });

  it('should get a cast member', async () => {
    const id = '9366b7dc-2d71-4799-b91c-c64adb205104';
    const output = {
      id,
      name: 'Actor',
      type: CastMemberType.ACTOR,
      created_at: new Date(),
    };
    const mockGetUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    };
    //@ts-expect-error defined part of methods
    controller['getUseCase'] = mockGetUseCase;
    const presenter = await controller.findOne(id);
    expect(mockGetUseCase.execute).toHaveBeenCalledWith({ id });
    expect(presenter).toBeInstanceOf(CastMemberPresenter);
    expect(presenter).toStrictEqual(new CastMemberPresenter(output));
  });

  it('should search a cast member', async () => {
    const output = {
      items: [
        {
          id: '9366b7dc-2d71-4799-b91c-c64adb205104',
          name: 'Actor',
          type: CastMemberType.ACTOR,
          created_at: new Date(),
        },
      ],
      current_page: 1,
      last_page: 1,
      per_page: 1,
      total: 1,
    };
    const mockListUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    };
    //@ts-expect-error defined part of methods
    controller['listUseCase'] = mockListUseCase;
    const input: SearchCastMemberDto = {
      filter: {
        name: 'Actor',
        type: CastMemberType.ACTOR,
      },
      page: 1,
      per_page: 1,
      sort: 'name',
    };
    const presenter = await controller.search(input);
    expect(mockListUseCase.execute).toHaveBeenCalledWith(input);
    expect(presenter).toBeInstanceOf(CastMemberCollectionPresenter);
    expect(presenter).toStrictEqual(new CastMemberCollectionPresenter(output));
  });
});
