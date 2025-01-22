import { CastMemberSequelizeRepository } from '@core/cast-member/infra/db/sequelize/cast-member-sequelize.repository';
import { CategoriesIdExistsInDatabaseValidator } from '../../../../../category/application/validations/categories-ids-exists-in-database.validator';
import { CategorySequelizeRepository } from '../../../../../category/infra/db/sequelize/category-sequelize.repository';
import { CategoryModel } from '../../../../../category/infra/db/sequelize/category.model';
import { GenresIdExistsInDatabaseValidator } from '../../../../../genre/application/validations/genres-ids-exists-in-database.validator';
import { GenreModel } from '../../../../../genre/infra/db/sequelize/genre-model';
import { GenreSequelizeRepository } from '../../../../../genre/infra/db/sequelize/genre-sequelize.repository';
import { UnitOfWorkSequelize } from '../../../../../shared/infra/db/sequelize/unit-of-work-sequelize';
import { setupSequelizeForVideo } from '../../../../infra/db/sequelize/testing/helpers';
import { VideoSequelizeRepository } from '../../../../infra/db/sequelize/video-sequelize.repository';
import { VideoModel } from '../../../../infra/db/sequelize/video.model';

import { CastMemberModel } from '@core/cast-member/infra/db/sequelize/cast-member.model';
import { CastMembersIdExistsInDatabaseValidator } from '@core/cast-member/application/validations/cast-members-ids-exists-in-database.validator';
import { generateVideoPayloads } from 'src/nest-modules/videos-module/testing/videoFixture';
import { CreateVideoUseCase } from '../../create-video/create-video.use-case';
import { SearchVideosUseCase } from '../list-video.usecase';
describe('CreateVideoUseCase Integration Tests', () => {
  let uow: UnitOfWorkSequelize;
  let createUseCase: CreateVideoUseCase;

  let videoRepo: VideoSequelizeRepository;
  let genreRepo: GenreSequelizeRepository;
  let castMemberRepo: CastMemberSequelizeRepository;

  let categoryRepo: CategorySequelizeRepository;
  let categoriesIdsValidator: CategoriesIdExistsInDatabaseValidator;
  let genresIdsValidator: GenresIdExistsInDatabaseValidator;
  let castMembersIdsValidator: CastMembersIdExistsInDatabaseValidator;
  let useCase: SearchVideosUseCase;
  const sequelizeHelper = setupSequelizeForVideo();

  beforeEach(() => {
    uow = new UnitOfWorkSequelize(sequelizeHelper.sequelize);
    videoRepo = new VideoSequelizeRepository(VideoModel, uow);
    genreRepo = new GenreSequelizeRepository(GenreModel, uow);
    categoryRepo = new CategorySequelizeRepository(CategoryModel);
    castMemberRepo = new CastMemberSequelizeRepository(CastMemberModel);
    categoriesIdsValidator = new CategoriesIdExistsInDatabaseValidator(
      categoryRepo,
    );
    genresIdsValidator = new GenresIdExistsInDatabaseValidator(genreRepo);
    castMembersIdsValidator = new CastMembersIdExistsInDatabaseValidator(
      castMemberRepo,
    );
    createUseCase = new CreateVideoUseCase(
      uow,
      videoRepo,
      categoriesIdsValidator,
      genresIdsValidator,
      castMembersIdsValidator,
    );
    useCase = new SearchVideosUseCase(videoRepo);
  });

  it('should list videos with pagination', async () => {
    const { payloads } = await generateVideoPayloads(
      castMemberRepo,
      categoryRepo,
      genreRepo,
    );
    for (const payload of payloads) {
      await createUseCase.execute(payload);
    }

    let res = await useCase.execute({ per_page: 2, page: 1 });
    expect(res.items.length).toBe(2);
    expect(res.total).toBe(payloads.length);

    res = await useCase.execute({ per_page: 2, page: 2 });
    expect(res.items.length).toBe(2);
    expect(res.total).toBe(payloads.length);

    res = await useCase.execute({ per_page: 4, page: 3 });
    expect(res.items.length).toBe(2);
    expect(res.total).toBe(payloads.length);
  });

  it('should list videos filtered by genre', async () => {
    const { payloads, genres } = await generateVideoPayloads(
      castMemberRepo,
      categoryRepo,
      genreRepo,
    );
    for (const payload of payloads) {
      await createUseCase.execute(payload);
    }
    const res = await useCase.execute({
      filter: {
        genres_id: [genres[0].genre_id.id],
      },
    });
    expect(res.items.length).toBe(1);
  });

  it('should list videos filtered by cast member', async () => {
    const { payloads, castMembers } = await generateVideoPayloads(
      castMemberRepo,
      categoryRepo,
      genreRepo,
    );
    for (const payload of payloads) {
      await createUseCase.execute(payload);
    }

    try {
      const res = await useCase.execute({
        filter: {
          cast_members_id: [castMembers[0].cast_member_id.id],
        },
      });
      expect(res.items.length).toBe(8);
    } catch (e) {
      throw e;
    }
  });

  it('should list videos filtered by category', async () => {
    const { payloads, categories } = await generateVideoPayloads(
      castMemberRepo,
      categoryRepo,
      genreRepo,
    );
    for (const payload of payloads) {
      await createUseCase.execute(payload);
    }

    const res = await useCase.execute({
      filter: {
        categories_id: [categories[0].category_id.id],
      },
    });
    expect(res.items.length).toBe(8);
  });

  it('should list videos filtered by title', async () => {
    const { payloads } = await generateVideoPayloads(
      castMemberRepo,
      categoryRepo,
      genreRepo,
    );
    for (const payload of payloads) {
      await createUseCase.execute(payload);
    }

    const res = await useCase.execute({
      filter: {
        title: 'The Lord of the Rings',
      },
    });
    expect(res.items.length).toBe(1);
    expect(res.items[0].title).toBe('The Lord of the Rings');
  });
});
