import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './module/auth/auth.module';
import { UserModule } from './module/user/user.module';
import { CategoryModule } from './module/category/category.module';
import { BlogModule } from './module/blog/blog.module';
import { CompanyInfoModule } from './module/companyinfo/companyinfo.module';
import { FooterModule } from './module/footer/footer.module';
import { BannerModule } from './module/banner/banner.module';
import { ClientModule } from './module/client/client.module';
import { BrandModule } from './module/brand/brand.module';
import { ProductModule } from './module/product/product.module';
import { DeliveryModule } from './module/delivery/delivery.module';
import { OrderModule } from './module/order/order.module';
import { envConfig } from './config/env.config';

@Module({
  imports: [
    ConfigModule.forRoot({ load: [envConfig] }),
    DatabaseModule,
    AuthModule,
    UserModule,
    CategoryModule,
    BlogModule,
    CompanyInfoModule,
    FooterModule,
    BannerModule,
    ClientModule,
    BrandModule,
    ProductModule,
    DeliveryModule,
    OrderModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
