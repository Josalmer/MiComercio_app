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

@NgModule({
  declarations: [
    HeaderComponent,
    PageLayoutComponent,
    UserFormComponent,
    SearchBarComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
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
    SearchBarComponent
  ],
  providers: [
    TranslationService
  ],
  entryComponents: [
  ],
})
export class SharedModule { }
