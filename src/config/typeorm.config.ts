import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'db',
  port: 5432,
  username: 'app',
  password: 'app',
  database: 'task_manager',
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  synchronize: true,
};
