import { Entity } from '../entity';
import { ValueObject } from '../value-object';
import { SearchParams } from './search-param';
import { SearchResult } from './search-result';

export interface IRepository<E extends Entity, EntityId extends ValueObject> {
  insert(entity: E): Promise<void>;
  bulkInsert(entities: E[]): Promise<void>;
  update(entity: E): Promise<void>;
  delete(entity_id: EntityId): Promise<void>;
  findById(entity_id: EntityId): Promise<E | null>;
  findAll(): Promise<E[]>;
  getEntity(): new (...args: any[]) => E;
  findByIds(ids: EntityId[]): Promise<E[]>;
  existsById(ids: EntityId[]): Promise<{
    exists: EntityId[];
    not_exists: EntityId[];
  }>;
}

export interface ISearchableRepository<
  E extends Entity,
  EntityId extends ValueObject,
  Filter = string,
  SearchInput = SearchParams<Filter>,
  SearchOutput = SearchResult,
> extends IRepository<E, EntityId> {
  sortableFields: string[];
  search(props: SearchInput): Promise<SearchOutput>;
}
