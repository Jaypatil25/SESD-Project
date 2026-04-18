export class Hostel {
  private hostelId: number;
  private name: string;
  private location: string;

  constructor(hostelId: number, name: string, location: string) {
    this.hostelId = hostelId;
    this.name = name;
    this.location = location;
  }

  public getHostelId(): number {
    return this.hostelId;
  }

  public getName(): string {
    return this.name;
  }

  public setName(name: string): void {
    this.name = name;
  }

  public getLocation(): string {
    return this.location;
  }

  public setLocation(location: string): void {
    this.location = location;
  }
}
