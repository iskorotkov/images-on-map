import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm/browser'
import { Coords } from './coords'
import { Image } from './image'

@Entity()
export class Marker {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column()
  name!: string

  @Column(() => Coords)
  location!: Coords

  @OneToMany(() => Image, _ => _.marker, { cascade: true, onDelete: 'CASCADE' })
  images!: Image[]
}
