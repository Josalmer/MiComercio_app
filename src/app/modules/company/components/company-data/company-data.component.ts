import { Component, Input } from '@angular/core';
import { Company } from 'src/app/models/company.model';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-company-data',
  templateUrl: './company-data.component.html'
})
export class CompanyDataComponent {
  @Input() company: Company;

  constructor(
    private utils: UtilsService
  ) { }


  printDirection(): string {
    return this.utils.printFullDirection(this.company.address);
  }
}
