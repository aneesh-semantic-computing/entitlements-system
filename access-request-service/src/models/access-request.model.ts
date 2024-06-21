import { Table, Column, Model, DataType, ForeignKey, PrimaryKey } from 'sequelize-typescript';
import { User } from './user.model';
import { DatasetConfig } from './dataset-config.model';

@Table({
  tableName: 'access_requests',
  timestamps: true,
})
export class AccessRequest extends Model<AccessRequest> {
  @PrimaryKey
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    autoIncrement: true
  })
  requestId: number | undefined;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  userId!: number;

  @ForeignKey(() => DatasetConfig)
  @Column({
    type: DataType.STRING,
    allowNull: false,
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
    type: DataType.STRING,
    allowNull: false,
  })
  status!: string;
}
