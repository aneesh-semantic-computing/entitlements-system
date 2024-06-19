import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({
  tableName: 'users',
  timestamps: true,
})
export class User extends Model<User> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  userId!: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  apiKey!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  role!: string;
}
