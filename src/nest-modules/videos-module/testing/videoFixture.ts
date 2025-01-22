import { CastMember } from '@core/cast-member/domain/cast-member.entity';
import { ICastMemberRepository } from '@core/cast-member/domain/cast-member.repository';
import { Category } from '@core/category/domain/category.aggregate';
import { ICategoryRepository } from '@core/category/domain/category.repository';
import { Genre } from '@core/genre/domain/genre.aggregate';
import { IGenreRepository } from '@core/genre/domain/genre.repository';
import { RatingValues } from '@core/video/domain/rating.vo';

export const getVideoInsertPayload = async (
  castMemberRepo: ICastMemberRepository,
  categoryRepo: ICategoryRepository,
  genreRepo: IGenreRepository,
  customName: string = 'test video',
) => {
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

  return {
    payload: {
      title: customName,
      description: 'test description',
      year_launched: 2021,
      duration: 90,
      rating: RatingValues.R10,
      is_opened: true,
      categories_id: categoriesId,
      genres_id: genresId,
      cast_members_id: castMembersId,
    },
  };
};

export const generateVideoPayloads = async (
  castMemberRepo: ICastMemberRepository,
  categoryRepo: ICategoryRepository,
  genreRepo: IGenreRepository,
) => {
  try {
    const createdCategories = Category.fake()
      .theCategories(5)
      .withNames(['Animação', 'Fantasia', 'Ação', 'Sci-Fi', 'Drama'])
      .build();
    await categoryRepo.bulkInsert(createdCategories);

    const createdGenres = Genre.fake()
      .theGenres(5)
      .withNames(['Aventura Épica', 'Anime', 'Robôs', 'Família', 'Magia'])
      .build();

    createdGenres[0].syncCategoriesId([
      createdCategories[1].category_id,
      createdCategories[2].category_id,
    ]);
    createdGenres[1].syncCategoriesId([
      createdCategories[0].category_id,
      createdCategories[1].category_id,
    ]);
    createdGenres[2].syncCategoriesId([
      createdCategories[2].category_id,
      createdCategories[3].category_id,
    ]);
    createdGenres[3].syncCategoriesId([
      createdCategories[0].category_id,
      createdCategories[4].category_id,
    ]);
    createdGenres[4].syncCategoriesId([
      createdCategories[1].category_id,
      createdCategories[4].category_id,
    ]);

    await genreRepo.bulkInsert(createdGenres);

    const createdCastMembers = CastMember.fake()
      .theCastMembers(5)
      .withNames([
        'Hayao Miyazaki',
        'Peter Jackson',
        'Michael Bay',
        'Daisuke Igarashi',
        'Yōji Matsuda',
      ])
      .withTypes([2, 2, 2, 1, 1])
      .build();
    await castMemberRepo.bulkInsert(createdCastMembers);

    const payloads = [
      {
        title: 'The Lord of the Rings',
        description: 'Uma jornada épica pela Terra-Média',
        year_launched: 2001,
        duration: 178,
        rating: RatingValues.R12,
        is_opened: true,
        categories_id: [
          createdCategories[1].category_id.id,
          createdCategories[2].category_id.id,
        ],
        genres_id: [createdGenres[0].genre_id.id],
        cast_members_id: [createdCastMembers[1].cast_member_id.id],
      },
      {
        title: 'Spirited Away',
        description: 'Uma menina em um mundo mágico',
        year_launched: 2001,
        duration: 125,
        rating: RatingValues.RL,
        is_opened: true,
        categories_id: [
          createdCategories[0].category_id.id,
          createdCategories[1].category_id.id,
        ],
        genres_id: [createdGenres[1].genre_id.id, createdGenres[4].genre_id.id],
        cast_members_id: [
          createdCastMembers[0].cast_member_id.id,
          createdCastMembers[3].cast_member_id.id,
        ],
      },
      {
        title: 'Transformers',
        description: 'Robôs alienígenas em guerra',
        year_launched: 2007,
        duration: 144,
        rating: RatingValues.R12,
        is_opened: true,
        categories_id: [
          createdCategories[2].category_id.id,
          createdCategories[3].category_id.id,
        ],
        genres_id: [createdGenres[2].genre_id.id],
        cast_members_id: [createdCastMembers[2].cast_member_id.id],
      },
      {
        title: 'Princess Mononoke',
        description: 'Conflito entre humanos e deuses da floresta',
        year_launched: 1997,
        duration: 134,
        rating: RatingValues.R12,
        is_opened: true,
        categories_id: [
          createdCategories[0].category_id.id,
          createdCategories[1].category_id.id,
          createdCategories[4].category_id.id,
        ],
        genres_id: [createdGenres[1].genre_id.id, createdGenres[4].genre_id.id],
        cast_members_id: [
          createdCastMembers[0].cast_member_id.id,
          createdCastMembers[4].cast_member_id.id,
        ],
      },
      {
        title: "Howl's Moving Castle",
        description: 'Uma jovem amaldiçoada em um castelo mágico',
        year_launched: 2004,
        duration: 119,
        rating: RatingValues.RL,
        is_opened: true,
        categories_id: [
          createdCategories[0].category_id.id,
          createdCategories[1].category_id.id,
        ],
        genres_id: [createdGenres[1].genre_id.id, createdGenres[4].genre_id.id],
        cast_members_id: [createdCastMembers[0].cast_member_id.id],
      },
      {
        title: "Kiki's Delivery Service",
        description: 'Uma jovem bruxa iniciando seu negócio',
        year_launched: 1989,
        duration: 103,
        rating: RatingValues.RL,
        is_opened: true,
        categories_id: [
          createdCategories[0].category_id.id,
          createdCategories[4].category_id.id,
        ],
        genres_id: [createdGenres[3].genre_id.id, createdGenres[4].genre_id.id],
        cast_members_id: [createdCastMembers[0].cast_member_id.id],
      },
      {
        title: 'My Neighbor Totoro',
        description: 'Duas irmãs e suas aventuras mágicas',
        year_launched: 1988,
        duration: 86,
        rating: RatingValues.RL,
        is_opened: true,
        categories_id: [
          createdCategories[0].category_id.id,
          createdCategories[4].category_id.id,
        ],
        genres_id: [createdGenres[3].genre_id.id],
        cast_members_id: [createdCastMembers[0].cast_member_id.id],
      },
      {
        title: 'Castle in the Sky',
        description: 'Aventura em busca de uma cidade flutuante',
        year_launched: 1986,
        duration: 124,
        rating: RatingValues.RL,
        is_opened: true,
        categories_id: [
          createdCategories[0].category_id.id,
          createdCategories[1].category_id.id,
        ],
        genres_id: [createdGenres[1].genre_id.id, createdGenres[4].genre_id.id],
        cast_members_id: [createdCastMembers[0].cast_member_id.id],
      },
      {
        title: 'Ponyo',
        description: 'Uma pequena sereia e sua amizade com um menino',
        year_launched: 2008,
        duration: 101,
        rating: RatingValues.RL,
        is_opened: true,
        categories_id: [
          createdCategories[0].category_id.id,
          createdCategories[4].category_id.id,
        ],
        genres_id: [createdGenres[3].genre_id.id],
        cast_members_id: [createdCastMembers[0].cast_member_id.id],
      },
      {
        title: 'The Wind Rises',
        description: 'A história de um projetista de aviões',
        year_launched: 2013,
        duration: 126,
        rating: RatingValues.R12,
        is_opened: true,
        categories_id: [
          createdCategories[0].category_id.id,
          createdCategories[4].category_id.id,
        ],
        genres_id: [createdGenres[1].genre_id.id],
        cast_members_id: [createdCastMembers[0].cast_member_id.id],
      },
    ];

    return {
      payloads,
      categories: createdCategories,
      genres: createdGenres,
      castMembers: createdCastMembers,
    };
  } catch (e) {
    console.log(e);
  }
};
