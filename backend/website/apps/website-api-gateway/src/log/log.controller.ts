import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UsePipes,
  UseFilters,
  UseGuards,
  Query,
} from '@nestjs/common';
import { LogService } from './log.service';
import { LogReq } from '@app/contracts/shared-dto/log/request/log.req.dto';
import { Payload } from '@nestjs/microservices';
import { AdminGuard } from '@app/common/guard/admin/admin.guard';
import { RpcTranslateFilter } from '@app/common/filters/rpc-translate/rpc-translate.filter';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('log')
@UseFilters(RpcTranslateFilter)
export class LogController {
  constructor(private readonly logService: LogService) {}

  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @Get('date')
  findByDate(@Query('date') date: string) {
    return this.logService.findDate(date);
  }
  @Post(':id')
  create(@Param('id', ParseIntPipe) id: number, @Body() dto: LogReq) {
    return this.logService.create(id, dto);
  }

  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @Get()
  findAll() {
    return this.logService.findAll();
  }

  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.logService.findOne(id);
  }

  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @Delete('before')
  removeBefore(@Query('date') date: string) {
    return this.logService.removeBefore(date);
  }
}
