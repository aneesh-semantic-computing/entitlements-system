import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({
  tableName: 'notifications',
  timestamps: true,
})
export class Notification extends Model<Notification> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  type!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  message!: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  userId!: number;
}
