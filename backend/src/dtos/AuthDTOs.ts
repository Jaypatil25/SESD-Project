export class RegisterStudentDTO {
  constructor(
    public name: string,
    public email: string,
    public password: string,
    public department: string,
    public year: number
  ) {}
}

export class LoginDTO {
  constructor(
    public email: string,
    public password: string
  ) {}
}

export class StudentResponseDTO {
  constructor(
    public id: number,
    public studentId: number,
    public name: string,
    public email: string,
    public department: string,
    public year: number,
    public roomId?: number
  ) {}
}

export class AdminResponseDTO {
  constructor(
    public id: number,
    public adminId: number,
    public name: string,
    public email: string
  ) {}
}

export class AuthResponseDTO {
  constructor(
    public token: string,
    public userType: 'student' | 'admin',
    public user: StudentResponseDTO | AdminResponseDTO
  ) {}
}
