import { Module } from '@nestjs/common';
import { FooterController } from './footer.controller';
import { FooterService } from './footer.service';
import { FooterRepository } from './footer.repository';
import { CloudinaryModule } from '../../cloudinary/cloudinary.module';

@Module({
  imports: [CloudinaryModule],
  controllers: [FooterController],
  providers: [FooterService, FooterRepository],
})
export class FooterModule {}
