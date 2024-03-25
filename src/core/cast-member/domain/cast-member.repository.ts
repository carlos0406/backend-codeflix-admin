import { ISearchableRepository } from '../../shared/domain/repository/repository-interface';
import {
  SearchParams,
  SearchParamsConstructorProps,
} from '../../shared/domain/repository/search-param';
import { SearchResult } from '../../shared/domain/repository/search-result';
import { CastMemberType } from './cast-member-type-enum';
import { CastMember, CastMemberId } from './cast-member.entity';

export type CastMemberFilter = {
  name?: string | null;
  type?: CastMemberType | null;
};

export class CastMemberSearchParams extends SearchParams<CastMemberFilter> {
  constructor(props: SearchParamsConstructorProps<CastMemberFilter> = {}) {
    super(props);
  }

  get filter(): CastMemberFilter | null {
    return this._filter;
  }

  set filter(value: CastMemberFilter | null) {
    this._filter = value;
  }
}

export class CastMemberSearchResult extends SearchResult<CastMember> {}

export interface ICastMemberRepository
  extends ISearchableRepository<
    CastMember,
    CastMemberId,
    CastMemberFilter,
    CastMemberSearchParams,
    CastMemberSearchResult
  > {}
