import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { CompanyManagementPage } from './pages/company-management/company-management.page';
import { CompanyFormComponent } from './components/company-form/company-form.component';
import { EditCompanyComponent } from './components/edit-company/edit-company.component';
import { CompanyGestionComponent } from './components/company-gestion/company-gestion.component';
import { ScheduleModal } from './components/schedule-modal/schedule.modal';
import { SpecialSchedulesComponent } from './components/special-schedules/special-schedules.component';
import { WeekDayComponent } from './components/week-day/week-day.component';
import { BoostCompanySliderComponent } from './components/boost-company-slider/boost-company-slider.component';

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
    EditCompanyComponent,
    CompanyGestionComponent,
    ScheduleModal,
    SpecialSchedulesComponent,
    WeekDayComponent,
    BoostCompanySliderComponent
  ],
  entryComponents: [
  ]
})
export class CompanyManagementModule {}
