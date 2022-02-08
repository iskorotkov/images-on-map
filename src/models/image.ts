import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm/browser'
import { Marker } from './marker'

@Entity()
export class Image {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column()
  uri!: string

  @Column()
  width!: number

  @Column()
  height!: number

  @ManyToOne(() => Marker, _ => _.images)
  marker?: Marker
}
