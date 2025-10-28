import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyModule } from './company/company.module';
import { ProductModule } from './product/product.module';
import { PlatoonModule } from './platoon/platoon.module';
import { RecipeModule } from './recipe/recipe.module';
import { RawMaterialModule } from './raw-material/raw-material.module';
import { SupplierModule } from './supplier/supplier.module';
import { InvetoryModule } from './invetory/invetory.module';
import { RecipeProductModule } from './recipe-product/recipe-product.module';
import { TagModule } from './tag/tag.module';
import { CreateProductModule } from './create-product/create-product.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';
import config from './config/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [config] }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      autoLoadEntities: true,
      synchronize: false, // 🔴 ביטול סנכרון אוטומטי
      migrationsRun: true, // ✅ תריץ מיגרציות אוטומטית בעת עליית השרת
      migrations: ['dist/migrations/*.js'], // או ts אם אתה מריץ TS ישירות
      ssl: true,
      extra: {
        ssl: {
          rejectUnauthorized: false,
        },
      },
    }),
    CompanyModule,
    ProductModule,
    PlatoonModule,
    RecipeModule,
    RawMaterialModule,
    SupplierModule,
    InvetoryModule,
    RecipeProductModule,
    TagModule,
    CreateProductModule,
    SubscriptionModule,
  ],
  controllers: [AppController, AuthController],
  providers: [AppService, AuthService],
})
export class AppModule {}
