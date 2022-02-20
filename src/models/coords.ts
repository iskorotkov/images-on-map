import { Column } from 'typeorm/browser'

export class Coords {
  @Column('double')
  latitude!: number

  @Column('double')
  longitude!: number
}
