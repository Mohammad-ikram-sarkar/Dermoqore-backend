import { Module } from '@nestjs/common';
import { CompanyInfoController } from './companyinfo.controller';
import { CompanyInfoService } from './companyinfo.service';
import { CompanyInfoRepository } from './companyinfo.repository';
import { CloudinaryModule } from '../../cloudinary/cloudinary.module';

@Module({
  imports: [CloudinaryModule],
  controllers: [CompanyInfoController],
  providers: [CompanyInfoService, CompanyInfoRepository],
})
export class CompanyInfoModule {}
