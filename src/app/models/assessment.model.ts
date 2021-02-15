export class Assessment {
  id: string;
  companyId: string;
  companyName: string;
  userId: string;
  filledAt: Date;
  text: string;
  averagePuntuation: number;
  puntuality: number;
  attention: number;
  satisfaction: number;

  constructor(assessment) {
    Object.assign(this, assessment);
  }
}
