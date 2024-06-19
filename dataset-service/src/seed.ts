import { Sequelize } from 'sequelize-typescript';
import { PricingDataset } from './models/pricing-dataset.model';
import { ConfigService } from '@nestjs/config';
import { ConfigModule } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';
import { DatasetConfig } from './models/dataset-config.model';

// Configure the database connection
ConfigModule.forRoot({
  envFilePath: '.env',
});

const configService = new ConfigService();

const sequelize = new Sequelize({
  dialect: 'postgres',
  host: configService.get<string>('DB_HOST'),
  port: configService.get<number>('DB_PORT'),
  username: configService.get<string>('DB_USERNAME'),
  password: configService.get<string>('DB_PASSWORD'),
  database: configService.get<string>('DB_DATABASE'),
  models: [PricingDataset, DatasetConfig],
});

const seedData = async () => {
  await sequelize.sync({ force: true });

  const filePath = path.resolve(__dirname, 'data.json');
  const fileContents = fs.readFileSync(filePath, 'utf-8');
  const data = JSON.parse(fileContents);

  for (const item of data) {
    for (const record of item.data) {
      await PricingDataset.create({
        symbol: item.symbol,
        frequency: item.frequency,
        priceUsd: record.priceUsd,
        datetime: new Date(record.datetime),
      });
    }
  }

  await DatasetConfig.bulkCreate([
    {
      symbol: 'btc',
      name: 'bitcoin',
      frequencies: ['hourly', 'daily', 'monthly'],
    } as DatasetConfig,
    {
      symbol: 'eth',
      name: 'ethereum',
      frequencies: ['daily'],
    } as DatasetConfig,
    // Add more entries as needed
  ]);

  console.log('Seeding completed');
  await sequelize.close();
};

seedData().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
