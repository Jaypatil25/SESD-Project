export class Room {
  private roomId: number;
  private roomNumber: string;
  private capacity: number;
  private isAvailable: boolean;
  private hostelId: number;

  constructor(
    roomId: number,
    roomNumber: string,
    capacity: number,
    isAvailable: boolean,
    hostelId: number
  ) {
    this.roomId = roomId;
    this.roomNumber = roomNumber;
    this.capacity = capacity;
    this.isAvailable = isAvailable;
    this.hostelId = hostelId;
  }

  public getRoomId(): number {
    return this.roomId;
  }

  public getRoomNumber(): string {
    return this.roomNumber;
  }

  public getCapacity(): number {
    return this.capacity;
  }

  public getIsAvailable(): boolean {
    return this.isAvailable;
  }

  public setIsAvailable(available: boolean): void {
    this.isAvailable = available;
  }

  public getHostelId(): number {
    return this.hostelId;
  }

  public allocate(): void {
    this.isAvailable = false;
  }

  public deallocate(): void {
    this.isAvailable = true;
  }
}
