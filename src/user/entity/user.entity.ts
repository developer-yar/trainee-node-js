import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 30 })
  firstName: string;

  @Column('varchar', { length: 30 })
  lastName: string;

  @Column('varchar', { length: 40, unique: true })
  email: string;

  @Column('varchar', { length: 30 })
  password: string;

  @Column('varchar', { nullable: true })
  image: string;

  @Column('bytea', { nullable: true })
  pdf: Buffer;
}
