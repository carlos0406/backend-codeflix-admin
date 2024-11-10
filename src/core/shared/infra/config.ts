import { config as readEnv } from 'dotenv';
import { join } from 'path';

export class Config {
  static env: any = null;

  static db() {
    Config.readEnv();

    return {
      dialect: 'sqlite' as any,
      host: Config.env.DB_HOST,
      logging: Config.env.DB_LOGGING === 'true',
    };
  }

  static rabbitmqUri() {
    Config.readEnv();

    return Config.env.RABBITMQ_URI;
  }

  static googleCredentials() {
    Config.readEnv();
    console.log(Config.env);
    return JSON.parse(Config.env.GOOGLE_CLOUD_CREDENTIALS);
  }

  static bucketName() {
    Config.readEnv();

    return Config.env.GOOGLE_CLOUD_STORAGE_BUCKET_NAME;
  }

  static readEnv() {
    console.log('read here');
    if (Config.env) {
      return;
    }
    Config.env = readEnv({
      path: join(__dirname, `../../../../envs/.env.${process.env.NODE_ENV}`),
    }).parsed;
  }
}
