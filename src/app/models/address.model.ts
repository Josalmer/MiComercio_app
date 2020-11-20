export class Address {
  id: string;
  cp: number;
  town: string;
  province: string;
  country: string;
  direction: string;
  latitude: number;
  longitude: number;

  constructor(direction) {
    Object.assign(this, direction);
  }

  fullDirection(): string {
    return this.direction + ', ' + this.town + ', ' + this.province + ' (' + this.cp + ')';
  }

  shortDirection(): string {
    return this.direction + ', ' + this.town;
  }
}
