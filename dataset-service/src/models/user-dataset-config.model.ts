import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({
  tableName: 'user_dataset_config',
  timestamps: true,
})
export class UserDataConfig extends Model<UserDataConfig> {
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    primaryKey: true,
  })
  userId!: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    primaryKey: true,
  })
  symbol!: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  hourly!: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  daily!: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  monthly!: boolean;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  periodFrom!: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  periodTo!: Date;
}
