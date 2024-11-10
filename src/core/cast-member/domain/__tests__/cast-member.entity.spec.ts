import { Uuid } from '../../../shared/domain/value-objects/uuid.vo';
import { CastMember } from '../cast-member.entity';
import { CastMemberType } from '../cast-member-type-enum';

describe('CastMember Without Validator Unit Tests', () => {
  beforeEach(() => {
    CastMember.prototype.validate = jest
      .fn()
      .mockImplementation(CastMember.prototype.validate);
  });
  test('constructor of castMember', () => {
    let castMember = new CastMember({
      name: 'Robson da vinci',
      type: CastMemberType.ACTOR,
    });
    expect(castMember.cast_member_id).toBeInstanceOf(Uuid);
    expect(castMember.name).toBe('Robson da vinci');
    expect(castMember.type).toBe(CastMemberType.ACTOR);
    expect(castMember.created_at).toBeInstanceOf(Date);

    const created_at = new Date();
    castMember = new CastMember({
      name: 'Robson da vinci2',
      type: CastMemberType.ACTOR,
      created_at,
    });
    expect(castMember.cast_member_id).toBeInstanceOf(Uuid);
    expect(castMember.name).toBe('Robson da vinci2');
    expect(castMember.type).toBe(CastMemberType.ACTOR);
    expect(castMember.created_at).toBe(created_at);

    castMember = new CastMember({
      name: 'Robson3',
      type: CastMemberType.DIRECTOR,
    });

    expect(castMember.cast_member_id).toBeInstanceOf(Uuid);
    expect(castMember.name).toBe('Robson3');
    expect(castMember.type).toBe(CastMemberType.DIRECTOR);
    expect(castMember.created_at).toBeInstanceOf(Date);
  });

  test('create castMember', () => {
    const castMember = CastMember.create({
      name: 'Robson da vinci',
      type: CastMemberType.ACTOR,
    });
    expect(castMember.cast_member_id).toBeInstanceOf(Uuid);
    expect(castMember.name).toBe('Robson da vinci');
    expect(castMember.type).toBe(CastMemberType.ACTOR);
    expect(castMember.created_at).toBeInstanceOf(Date);
  });

  test('changeName castMember', () => {
    const castMember = new CastMember({
      name: 'Robson da vinci',
      type: CastMemberType.ACTOR,
    });

    expect(castMember.cast_member_id).toBeInstanceOf(Uuid);
    expect(castMember.name).toBe('Robson da vinci');
    expect(castMember.type).toBe(CastMemberType.ACTOR);
    castMember.changeName('Robson da vinci2');
    expect(castMember.name).toBe('Robson da vinci2');
  });

  test('changeType castMember', () => {
    const castMember = new CastMember({
      name: 'Robson da vinci',
      type: CastMemberType.ACTOR,
    });

    expect(castMember.cast_member_id).toBeInstanceOf(Uuid);
    expect(castMember.name).toBe('Robson da vinci');
    expect(castMember.type).toBe(CastMemberType.ACTOR);
    castMember.changeType(CastMemberType.DIRECTOR);
    expect(castMember.type).toBe(CastMemberType.DIRECTOR);
  });
});

describe('Castmember Validator', () => {
  describe('create command', () => {
    test('should an invalid castmember with name property', () => {
      const castmember = CastMember.create({
        name: 't'.repeat(256),
        type: CastMemberType.ACTOR,
      });

      expect(castmember.notification.hasErrors()).toBe(true);
      expect(castmember.notification).notificationContainsErrorMessages([
        {
          name: ['name must be shorter than or equal to 255 characters'],
        },
      ]);
    });
  });

  describe('changeName method', () => {
    it('should a invalid category using name property', () => {
      const castmember = CastMember.create({
        name: 'Robson da vinci',
        type: CastMemberType.ACTOR,
      });
      castmember.changeName('t'.repeat(256));
      expect(castmember.notification.hasErrors()).toBe(true);
      expect(castmember.notification).notificationContainsErrorMessages([
        {
          name: ['name must be shorter than or equal to 255 characters'],
        },
      ]);
    });
  });

  describe('changeType method', () => {
    it('should a invalid category using type property', () => {
      const castmember = CastMember.create({
        name: 'Robson da vinci',
        type: CastMemberType.ACTOR,
      });

      castmember.changeType(3 as CastMemberType);
      expect(castmember.notification.hasErrors()).toBe(true);
      expect(castmember.notification).notificationContainsErrorMessages([
        {
          type: ['type must be one of the following values: 1, 2'],
        },
      ]);
    });
  });
});
