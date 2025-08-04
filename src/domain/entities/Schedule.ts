import { v4 as uuidv4 } from 'uuid';

class Schedule {

  constructor(
    readonly scheduleId: string,
    readonly serviceId: string,
    readonly customerId: string,
    readonly businessId: string,
    readonly scheduleHour: string,
    readonly scheduleDate: Date,
    private status: string
  ) {
    if (serviceId === '') {
      throw new Error('O serviço é obrigatório');
    }
    if (scheduleHour === '') {
      throw new Error('A hora é obrigatória');
    }
  }

  static create(
    serviceId: string,
    customerId: string,
    businessId: string,
    scheduleHour: string,
    scheduleDate: Date
  ) {
    const scheduleId = uuidv4();
    const status = 'active';
    return new Schedule(
      scheduleId,
      serviceId,
      customerId,
      businessId,
      scheduleHour,
      scheduleDate,
      status
    );
  }

  cancell() {
    if (this.getStatus() === 'inactive') {
      throw new Error('O status já está cancelado');
    }
    this.status = 'inactive';
  }

  getStatus() {
    return this.status;
  }

}

export { Schedule }

