import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({
  tableName: 'pricing_dataset',
  timestamps: true,
})
export class PricingDataset extends Model<PricingDataset> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  symbol!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  frequency!: string;

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
  })
  priceUsd!: number;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  datetime!: Date;
}
