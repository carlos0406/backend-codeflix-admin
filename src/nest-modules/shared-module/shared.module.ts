import { GoogleCloudStorage } from '@core/shared/infra/storage/google-cloud.storage';
import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Storage as GoogleCloudStorageSdk } from '@google-cloud/storage';

@Global()
@Module({
  providers: [
    {
      provide: 'IStorage',
      useFactory: (configService: ConfigService) => {
        const credentials = configService.get('GOOGLE_CLOUD_CREDENTIALS');
        const bucket_name = configService.get(
          'GOOGLE_CLOUD_STORAGE_BUCKET_NAME',
        );
        const storage = new GoogleCloudStorageSdk({
          credentials,
        });
        return new GoogleCloudStorage(storage, bucket_name);
      },
      inject: [ConfigService],
    },
  ],
  exports: ['IStorage'],
})
export class SharedModule {}
