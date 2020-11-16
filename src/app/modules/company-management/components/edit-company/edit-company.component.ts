import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Company } from 'src/app/models/company.model';

@Component({
  selector: 'app-edit-company',
  templateUrl: './edit-company.component.html'
})
export class EditCompanyComponent {
  @Input() company: Company;
  @Output() reloadCompany = new EventEmitter();
}
