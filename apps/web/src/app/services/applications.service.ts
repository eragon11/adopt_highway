/* eslint-disable prettier/prettier */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Application } from 'src/app/models/application.model';

@Injectable({
  providedIn: 'root',
})
export class ApplicationsService {
  constructor(private http: HttpClient) {}

  saveApplication(application) {
    return this.http.post(environment.apiUrl + '/applications', application);
  }

  updateApplication(application, applicationId) {
    return this.http.patch(
      environment.apiUrl + '/applications/' + applicationId,
      application,
      { withCredentials: true },
    );
  }

  updateApplicationByTokens(
    application,
    applicationToken: string,
    accessToken: string,
  ) {
    return this.http.patch(
      `${environment.apiUrl}/applications/${applicationToken}/${accessToken}`,
      application,
    );
  }

  getApplicationByTokens(applicationToken: string, accessToken: string) {
    return this.http.get<Application>(
      `${environment.apiUrl}/applications/${applicationToken}/${accessToken}`,
    );
  }

  getApplicationByApplicationId(applicationId: string) {
    return this.http.get<Application>(
      `${environment.apiUrl}/applications/${applicationId}`,
      { withCredentials: true },
    );
  }

  deleteApplication(applicationToken: string, accessToken: string) {
    return this.http.delete<Application>(
      `${environment.apiUrl}/applications/${applicationToken}/${accessToken}`,
    );
  }

  deleteApplicationByApplicationId(applicationId: string) {
    return this.http.delete<Application>(
      `${environment.apiUrl}/applications/${applicationId}`,
      { withCredentials: true },
    );
  }

  confirmApplicationByToken(
    application,
    applicationToken: string,
    accessToken: string,
  ) {
    return this.http.patch<Application>(
      `${environment.apiUrl}/applications/confirm/${applicationToken}/${accessToken}`,
      application,
    );
  }

  confirmApplicationById(application, applicationId: string) {
    return this.http.patch<Application>(
      `${environment.apiUrl}/applications/confirm/${applicationId}`,
      application,
      { withCredentials: true },
    );
  }

  getSegmentById(aahSegmentId: string) {
    return this.http.get<Application>(
      `${environment.apiUrl}/segments/available/${aahSegmentId}`,
      { withCredentials: true },
    );
  }

  approveSignInRequest(applicationId: string) {
    return this.http.patch<Application>(
      `${environment.apiUrl}/applications/approveSign/${applicationId}`,
      { withCredentials: true },
    );
  }

  rejectSignInRequest(applicationId: string, rejectComments) {
    return this.http.patch<Application>(
      `${environment.apiUrl}/applications/rejectSign/${applicationId}`,
      rejectComments,
      { withCredentials: true },
    );
  }

  requestSignApprovalById(applicationId: string, description: string) {
    return this.http.patch<any>(
      `${environment.apiUrl}/applications/requestSignApproval/${applicationId}`,
      description,
      { withCredentials: true },
    );
  }

  createSigningRequest(applicationId: string) {
    return this.http.post(
      `${environment.apiUrl}/applications/create-signing-document/${applicationId}`,
      { withCredentials: true },
    );
  }
}
