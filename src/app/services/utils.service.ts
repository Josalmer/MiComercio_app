import { Injectable } from '@angular/core';
import { Address } from '../models/address.model';
import { DatePipe } from '@angular/common';

@Injectable({
    providedIn: 'root'
})
export class UtilsService {

  datePipe = new DatePipe('en-EN');

  printFullDirection(direction: Address): string {
    return direction.direction + ', ' + direction.town + ', ' + direction.province + ' (' + direction.cp + ')';
  }

  printShortDirection(direction: Address): string {
    return direction.direction + ', ' + direction.town;
  }
}
