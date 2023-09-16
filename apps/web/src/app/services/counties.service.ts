import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

export interface County {
  number: number;
  name: string;
}

@Injectable({
  providedIn: 'root',
})
export class CountiesService {
  constructor(private http: HttpClient) {}

  getAllCountiesNames() {
    return this.http.get<County[]>(environment.apiUrl + '/counties/names');
  }
}
