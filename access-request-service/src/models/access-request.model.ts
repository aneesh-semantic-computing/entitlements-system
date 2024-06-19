import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({
  tableName: 'access_requests',
  timestamps: true,
})
export class AccessRequest extends Model<AccessRequest> {
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
    type: DataType.STRING,
    allowNull: false,
  })
  status!: string;
}
