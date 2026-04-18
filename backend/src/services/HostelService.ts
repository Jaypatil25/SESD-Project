import { Hostel } from '../models/Hostel';
import { HostelRepository } from '../repositories/HostelRepository';
import { validateNonEmptyString } from '../utils/validators';
import { NotFoundError } from '../utils/errors';

export class HostelService {
  constructor(private hostelRepository: HostelRepository) {}

  public async createHostel(name: string, location: string): Promise<Hostel> {
    
    validateNonEmptyString(name, 'name');
    validateNonEmptyString(location, 'location');

    const hostelId = this.hostelRepository.getNextId();
    const hostel = new Hostel(hostelId, name, location);

    return this.hostelRepository.create(hostel);
  }

  public async getHostelById(id: number): Promise<Hostel> {
    const hostel = await this.hostelRepository.findById(id);
    if (!hostel) {
      throw new NotFoundError(`Hostel with ID ${id} not found`);
    }
    return hostel;
  }

  public async getHostelByName(name: string): Promise<Hostel> {
    const hostel = await this.hostelRepository.findByName(name);
    if (!hostel) {
      throw new NotFoundError(`Hostel with name ${name} not found`);
    }
    return hostel;
  }

  public async getAllHostels(): Promise<Hostel[]> {
    return this.hostelRepository.findAll();
  }

  public async updateHostel(
    id: number,
    name: string,
    location: string
  ): Promise<Hostel> {
    await this.getHostelById(id);
    validateNonEmptyString(name, 'name');
    validateNonEmptyString(location, 'location');

    const hostel = new Hostel(id, name, location);
    return this.hostelRepository.update(id, hostel);
  }

  public async deleteHostel(id: number): Promise<boolean> {
    await this.getHostelById(id);
    return this.hostelRepository.delete(id);
  }
}
