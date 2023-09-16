import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DistrictCoordinatorsService {
  constructor(private http: HttpClient) {}

  getDistrictCoordinators(segmentId) {
    return this.http.get<any[]>(
      environment.apiUrl + `/users/districtCoordinators/${segmentId}`,
    );
  }
}
