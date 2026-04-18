export abstract class User {
  private id: number;
  protected name: string;
  protected email: string;
  private password: string; 

  constructor(
    id: number,
    name: string,
    email: string,
    password: string
  ) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
  }

  public getId(): number {
    return this.id;
  }

  public getName(): string {
    return this.name;
  }

  public getEmail(): string {
    return this.email;
  }

  protected getPassword(): string {
    return this.password;
  }

  public verifyPassword(password: string): boolean {
    return this.password === password;
  }

  abstract login(): Promise<boolean>;

  abstract logout(): Promise<boolean>;
}
