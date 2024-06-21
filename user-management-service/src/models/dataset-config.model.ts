import { Table, Column, Model, DataType, PrimaryKey } from 'sequelize-typescript';

@Table({
  tableName: 'dataset_config',
  timestamps: false,
})
export class DatasetConfig extends Model<DatasetConfig> {
  @PrimaryKey
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  symbol!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name!: string;

  @Column({
    type: DataType.ARRAY(DataType.STRING),
    allowNull: false,
  })
  frequencies!: string[];
}
