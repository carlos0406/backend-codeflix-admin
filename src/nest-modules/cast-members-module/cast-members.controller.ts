import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CreateCastMemberDto } from './dto/create-cast-member.dto';
import { UpdateCastMemberDto } from './dto/update-cast-member.dto';

@Controller('cast-members')
export class CastMembersController {
  @Post()
  create(@Body() createCastMemberDto: CreateCastMemberDto) {}

  @Get()
  findAll() {}

  @Get(':id')
  findOne(@Param('id') id: string) {}

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCastMemberDto: UpdateCastMemberDto,
  ) {}

  @Delete(':id')
  remove(@Param('id') id: string) {}
}
