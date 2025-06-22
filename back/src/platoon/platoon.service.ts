import { Injectable } from '@nestjs/common';
import { CreatePlatoonDto } from './dto/create-platoon.dto';
import { UpdatePlatoonDto } from './dto/update-platoon.dto';

@Injectable()
export class PlatoonService {
  create(createPlatoonDto: CreatePlatoonDto) {
    return 'This action adds a new platoon';
  }

  findAll() {
    return `This action returns all platoon`;
  }

  findOne(id: number) {
    return `This action returns a #${id} platoon`;
  }

  update(id: number, updatePlatoonDto: UpdatePlatoonDto) {
    return `This action updates a #${id} platoon`;
  }

  remove(id: number) {
    return `This action removes a #${id} platoon`;
  }
}
