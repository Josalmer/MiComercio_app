import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SelectorPage } from './pages/selector-page/selector.page';
import { SharedModule } from '../shared/shared.module';
import { CompaniesPage } from './pages/companies/companies.page';
import { CompaniesManagementPage } from './pages/companies-management/companies-management.page';
import { NewCompanyFormPage } from './pages/new-company-form/new-company-form.page';
import { OfferFormPage } from './pages/offer-form/offer-form.page';

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild([
      {
        path: '',
        component: SelectorPage
      },
      {
        path: 'offer',
        component: OfferFormPage
      },
      {
        path: 'create',
        component: NewCompanyFormPage
      }
    ])
  ],
  declarations: [
    SelectorPage,
    CompaniesPage,
    CompaniesManagementPage,
    NewCompanyFormPage,
    OfferFormPage
  ]
})
export class CompaniesModule {}
