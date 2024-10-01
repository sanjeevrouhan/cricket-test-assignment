import { PartialType } from '@nestjs/mapped-types';
import { CreateMatchDto } from './create-match.dto';

export class UpdateMatchDto extends PartialType(CreateMatchDto) {
  // Additional fields specific to updating a match can be added here
}
