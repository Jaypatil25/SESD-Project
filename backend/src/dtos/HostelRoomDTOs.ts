export class CreateHostelDTO {
  constructor(
    public name: string,
    public location: string
  ) {}
}

export class HostelResponseDTO {
  constructor(
    public hostelId: number,
    public name: string,
    public location: string
  ) {}
}

export class CreateRoomDTO {
  constructor(
    public roomNumber: string,
    public capacity: number,
    public hostelId: number
  ) {}
}

export class RoomResponseDTO {
  constructor(
    public roomId: number,
    public roomNumber: string,
    public capacity: number,
    public isAvailable: boolean,
    public hostelId: number
  ) {}
}
