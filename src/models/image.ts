import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm/browser'
import { Marker } from './marker'

@Entity()
export class Image {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column('varchar')
  uri!: string

  @Column('int')
  width!: number

  @Column('int')
  height!: number

  @ManyToOne(() => Marker, _ => _.images)
  marker?: Marker
}
