import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './module/auth/auth.module';
import { UserModule } from './module/user/user.module';
import { CategoryModule } from './module/category/category.module';
import { CompanyInfoModule } from './module/companyinfo/companyinfo.module';
import { FooterModule } from './module/footer/footer.module';
import { BannerModule } from './module/banner/banner.module';
import { ClientModule } from './module/client/client.module';
import { envConfig } from './config/env.config';

@Module({
  imports: [
    ConfigModule.forRoot({ load: [envConfig] }),
    DatabaseModule,
    AuthModule,
    UserModule,
    CategoryModule,
    CompanyInfoModule,
    FooterModule,
    BannerModule,
    ClientModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
