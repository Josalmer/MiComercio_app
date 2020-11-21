import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { CalendarPage } from './pages/calendar/calendar.page';
import { NgCalendarModule } from 'ionic2-calendar';
import { CompanySelectorComponent } from './components/company-selector/company-selector.component';

@NgModule({
  imports: [
    SharedModule,
    NgCalendarModule,
    RouterModule.forChild([
      {
        path: '',
        component: CalendarPage
      }
    ])
  ],
  declarations: [
    CalendarPage,
    CompanySelectorComponent
  ]
})
export class CalendarModule {}
