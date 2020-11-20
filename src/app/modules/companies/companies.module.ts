import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SelectorPage } from './pages/selector-page/selector.page';
import { SharedModule } from '../shared/shared.module';
import { CompaniesPage } from './pages/companies/companies.page';
import { CompaniesManagementPage } from './pages/companies-management/companies-management.page';
import { NewCompanyFormPage } from './pages/new-company-form/new-company-form.page';

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild([
      {
        path: '',
        component: SelectorPage
      }
    ])
  ],
  declarations: [
    SelectorPage,
    CompaniesPage,
    CompaniesManagementPage,
    NewCompanyFormPage
  ]
})
export class CompaniesModule {}
