import { Video, VideoId } from '@core/video/domain/video.aggregate';
import { VideoSequelizeRepository } from '@core/video/infra/db/sequelize/video-sequelize.repository';
import { DeleteVideoUseCase } from '../delete-video.use-case';
import { UnitOfWorkSequelize } from '@core/shared/infra/db/sequelize/unit-of-work-sequelize';
import { VideoModel } from '@core/video/infra/db/sequelize/video.model';
import { NotFoundError } from '@core/shared/domain/errors/not-found-erros';
import { CategoryModel } from '@core/category/infra/db/sequelize/category.model';
import { CastMemberModel } from '@core/cast-member/infra/db/sequelize/cast-member.model';
import { GenreModel } from '@core/genre/infra/db/sequelize/genre-model';
import { CreateVideoUseCase } from '../../create-video/create-video.use-case';
import { setupSequelizeForVideo } from '@core/video/infra/db/sequelize/testing/helpers';
import { CastMembersIdExistsInDatabaseValidator } from '@core/cast-member/application/validations/cast-members-ids-exists-in-database.validator';
import { GenresIdExistsInDatabaseValidator } from '@core/genre/application/validations/genres-ids-exists-in-database.validator';
import { CategoriesIdExistsInDatabaseValidator } from '@core/category/application/validations/categories-ids-exists-in-database.validator';
import { CategorySequelizeRepository } from '@core/category/infra/db/sequelize/category-sequelize.repository';
import { CastMemberSequelizeRepository } from '@core/cast-member/infra/db/sequelize/cast-member-sequelize.repository';
import { GenreSequelizeRepository } from '@core/genre/infra/db/sequelize/genre-sequelize.repository';
import { Category } from '@core/category/domain/category.aggregate';
import { Genre } from '@core/genre/domain/genre.aggregate';
import { CastMember } from '@core/cast-member/domain/cast-member.entity';
import { RatingValues } from '@core/video/domain/rating.vo';

describe('DeleteVideoUseCase Integration Tests', () => {
  let useCase: DeleteVideoUseCase;
  let repository: VideoSequelizeRepository;
  let uow: UnitOfWorkSequelize;
  let castMemberRepo: CastMemberSequelizeRepository;
  let categoryRepo: CategorySequelizeRepository;
  let genreRepo: GenreSequelizeRepository;
  let categoriesIdsValidator: CategoriesIdExistsInDatabaseValidator;
  let genresIdsValidator: GenresIdExistsInDatabaseValidator;
  let castMembersIdsValidator: CastMembersIdExistsInDatabaseValidator;

  const sequelizeHelper = setupSequelizeForVideo();

  beforeEach(() => {
    uow = new UnitOfWorkSequelize(sequelizeHelper.sequelize);
    repository = new VideoSequelizeRepository(VideoModel, uow);
    useCase = new DeleteVideoUseCase(uow, repository);
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
  });

  it('should throws error when entity not found', async () => {
    const videoId = new VideoId();
    await expect(() => useCase.execute({ id: videoId.id })).rejects.toThrow(
      new NotFoundError(videoId.id, Video),
    );
  });

  it('should delete a video', async () => {
    const categories = Category.fake().theCategories(2).build();
    await categoryRepo.bulkInsert(categories);
    const categoriesId = categories.map((c) => c.category_id.id);

    const genres = Genre.fake().theGenres(2).build();
    genres[0].syncCategoriesId([categories[0].category_id]);
    genres[1].syncCategoriesId([categories[1].category_id]);
    await genreRepo.bulkInsert(genres);
    const genresId = genres.map((c) => c.genre_id.id);

    const castMembers = CastMember.fake().theCastMembers(2).build();
    await castMemberRepo.bulkInsert(castMembers);
    const castMembersId = castMembers.map((c) => c.cast_member_id.id);

    const output = await new CreateVideoUseCase(
      uow,
      repository,
      categoriesIdsValidator,
      genresIdsValidator,
      castMembersIdsValidator,
    ).execute({
      title: 'test video',
      description: 'test description',
      year_launched: 2021,
      duration: 90,
      rating: RatingValues.R10,
      is_opened: true,
      categories_id: categoriesId,
      genres_id: genresId,
      cast_members_id: castMembersId,
    });

    await useCase.execute({
      id: output.id,
    });

    await expect(
      repository.findById(new VideoId(output.id)),
    ).resolves.toBeNull();
  });
});
