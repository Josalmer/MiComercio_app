import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { TutorialPage } from './pages/tutorial/tutorial.page';

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild([
      {
        path: '',
        component: TutorialPage
      }
    ])
  ],
  declarations: [
    TutorialPage
  ]
})
export class TutorialModule {}
