import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { CompanyManagementPage } from './pages/company-management/company-management.page';
import { CompanyFormComponent } from './components/company-form/company-form.component';
import { EditCompanyComponent } from './components/edit-company/edit-company.component';

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild([
      {
        path: ':id',
        component: CompanyManagementPage
      }
    ])
  ],
  declarations: [
    CompanyManagementPage,
    CompanyFormComponent,
    EditCompanyComponent
  ],
  entryComponents: [
  ]
})
export class CompanyManagementModule {}
