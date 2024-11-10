import {
  PaginationOutputMapper,
  PaginationOutput,
} from '../../../../shared/application/pagination-output';
import { IUseCase } from '../../../../shared/application/use-case.interface';
import { SortDirection } from '../../../../shared/domain/repository/search-param';
import {
  ICastMemberRepository,
  CastMemberSearchParams,
  CastMemberSearchResult,
  CastMemberFilter,
} from '../../../domain/cast-member.repository';
import {
  CastMemberOutputMapper,
  CastMemberOutput,
} from '../common/cast-member-output';

export class ListCastMembersUseCase
  implements IUseCase<ListCastmembersInput, ListCastMemberOutput>
{
  constructor(private castMemberRepo: ICastMemberRepository) {}

  async execute(input: ListCastmembersInput): Promise<ListCastMemberOutput> {
    const params = new CastMemberSearchParams(input);
    const searchResult = await this.castMemberRepo.search(params);
    return this.toOutput(searchResult);
  }

  private toOutput(searchResult: CastMemberSearchResult): ListCastMemberOutput {
    const { items: _items } = searchResult;
    const items = _items.map((i) => {
      return CastMemberOutputMapper.toOutput(i);
    });
    return PaginationOutputMapper.toOutput(items, searchResult);
  }
}

export type ListCastmembersInput = {
  page?: number;
  per_page?: number;
  sort?: string | null;
  sort_dir?: SortDirection | null;
  filter?: CastMemberFilter | null;
};

export type ListCastMemberOutput = PaginationOutput<CastMemberOutput>;
