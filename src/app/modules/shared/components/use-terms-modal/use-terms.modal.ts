import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-use-terms',
  templateUrl: './use-terms.modal.html'
})
export class UseTermsModal {

  constructor(
    private modalController: ModalController
  ) { }

  cancel(): void {
    this.modalController.dismiss();
  }

}
