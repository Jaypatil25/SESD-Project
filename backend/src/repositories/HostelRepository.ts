import { Hostel } from '../models/Hostel';
import { NotFoundError, ConflictError } from '../utils/errors';

export class HostelRepository {
  
  private hostels: Map<number, Hostel> = new Map();
  private hostelCounter: number = 1;

  public async create(hostel: Hostel): Promise<Hostel> {
    
    for (const existingHostel of this.hostels.values()) {
      if (existingHostel.getName() === hostel.getName()) {
        throw new ConflictError(`Hostel with name "${hostel.getName()}" already exists`);
      }
    }
    this.hostels.set(hostel.getHostelId(), hostel);
    return hostel;
  }

  public async findById(id: number): Promise<Hostel | null> {
    return this.hostels.get(id) || null;
  }

  public async findByName(name: string): Promise<Hostel | null> {
    for (const hostel of this.hostels.values()) {
      if (hostel.getName() === name) {
        return hostel;
      }
    }
    return null;
  }

  public async findAll(): Promise<Hostel[]> {
    return Array.from(this.hostels.values());
  }

  public async update(id: number, hostel: Hostel): Promise<Hostel> {
    if (!this.hostels.has(id)) {
      throw new NotFoundError(`Hostel with ID ${id} not found`);
    }
    this.hostels.set(id, hostel);
    return hostel;
  }

  public async delete(id: number): Promise<boolean> {
    return this.hostels.delete(id);
  }

  public getNextId(): number {
    return this.hostelCounter++;
  }
}
