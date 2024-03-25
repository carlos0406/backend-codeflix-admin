import { CastMemberType } from '@core/cast-member/domain/cast-member-type-enum';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsString,
  validateSync,
} from 'class-validator';

export type CastMemberInputConstructorProps = {
  id: string;
  name: string;
  type: CastMemberType;
};

export class UpdateCastMemberInput {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsBoolean()
  @IsNotEmpty()
  @IsEnum(CastMemberType)
  type: CastMemberType;

  constructor(props: CastMemberInputConstructorProps) {
    if (!props) return;
    this.name = props.name;
    this.type = props.type;
    this.id = props.id;
  }
}

export class ValidateUpdateCastMemberInput {
  static validate(input: UpdateCastMemberInput) {
    return validateSync(input);
  }
}
