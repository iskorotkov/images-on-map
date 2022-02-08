import { Column } from 'typeorm/browser'

export class Coords {
  @Column()
  latitude!: number

  @Column()
  longitude!: number
}
