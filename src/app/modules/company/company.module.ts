import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { CompanyPage } from './pages/company/company.page';
import { CompanyDataComponent } from './components/company-data/company-data.component';
import { AssessmentFormModal } from './components/assessment-form/assessment-form.modal';

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild([
      {
        path: ':id',
        component: CompanyPage
      }
    ])
  ],
  declarations: [
    CompanyPage,
    CompanyDataComponent,
    AssessmentFormModal
  ]
})
export class CompanyModule {}
