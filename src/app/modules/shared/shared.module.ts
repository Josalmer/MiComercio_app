import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent } from './components/header/header.component';
import { PageLayoutComponent } from './components/page-layout/page-layout.component';
import { TranslateModule } from '@ngx-translate/core';
import { UserFormComponent } from './components/user-form/user-form.component';
import { TranslationService } from 'src/app/services/translation.service';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { NgCalendarModule } from 'ionic2-calendar';
import { AppointmentCardComponent } from './components/appointment-card/appointment-card.component';
import { CalendarModal } from './components/calendar-modal/calendar.modal';
import { AssessmentCardComponent } from './components/assessment-card/assessment-card.component';
import { StarsComponent } from './components/stars/stars.component';
import { StarsInputComponent } from './components/stars-input/stars-input.component';
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';
import { CompanySelectorComponent } from './components/company-selector/company-selector.component';
import { OfferCardComponent } from './components/offer-card/offer-card.component';
import { UseTermsModal } from './components/use-terms-modal/use-terms.modal';

@NgModule({
  declarations: [
    HeaderComponent,
    PageLayoutComponent,
    UserFormComponent,
    SearchBarComponent,
    AppointmentCardComponent,
    CalendarModal,
    AssessmentCardComponent,
    StarsComponent,
    StarsInputComponent,
    LoadingSpinnerComponent,
    CompanySelectorComponent,
    OfferCardComponent,
    UseTermsModal
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgCalendarModule,
    ReactiveFormsModule,
    IonicModule,
    TranslateModule.forChild()
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    TranslateModule,
    HeaderComponent,
    PageLayoutComponent,
    UserFormComponent,
    SearchBarComponent,
    AppointmentCardComponent,
    AssessmentCardComponent,
    StarsComponent,
    StarsInputComponent,
    LoadingSpinnerComponent,
    CompanySelectorComponent,
    OfferCardComponent,
    UseTermsModal
  ],
  providers: [
    TranslationService
  ],
  entryComponents: [
    CalendarModal
  ],
})
export class SharedModule { }
