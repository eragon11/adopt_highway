import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClientFilterService {

  private filterState: boolean = false;
  public showClientsideFilter = new BehaviorSubject<boolean>(this.filterState);

  constructor() { }

  toggleClientFilter() {
    this.filterState = !this.filterState;
    this.showClientsideFilter.next(this.filterState)
  }

  getFilterSubj (): BehaviorSubject<boolean> {
    return this.showClientsideFilter
  }
}
