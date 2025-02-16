import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  private baseUrl = 'http://localhost:8080';
  // token: string = '';
  // private httpOptions = {
  //   headers: new HttpHeaders({
  //     'Content-Type': 'application/json',
  //     Authorization: this.token,
  //   }),
  // };

  constructor(private http: HttpClient) {}

  private getHttpOptions() {
    const token = sessionStorage.getItem('token');
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: token ? `Bearer ${token}` : '',
      }),
    };
  }

  // /**
  //  * GET: Retrieve data from the API.
  //  * @param endpoint - The API endpoint (relative to baseUrl)
  //  */
  get<T>(endpoint: string): Observable<T> {
    const url = `${this.baseUrl}/${endpoint}`;
    return this.http
      .get<T>(url, this.getHttpOptions())
      .pipe(catchError(this.handleError));
  }

  /**
   * POST: Send new data to the API.
   * @param endpoint - The API endpoint (relative to baseUrl)
   * @param data - The data to send in the request body
   */
  post<T>(endpoint: string, data: any): Observable<T> {
    const url = `${this.baseUrl}/${endpoint}`;
    return this.http
      .post<T>(url, data, this.getHttpOptions())
      .pipe(catchError(this.handleError));
  }

  /**
   * PUT: Update existing data on the API.
   * @param endpoint - The API endpoint (relative to baseUrl)
   * @param data - The data to update
   */
  put<T>(endpoint: string, data: any): Observable<T> {
    const url = `${this.baseUrl}/${endpoint}`;
    return this.http
      .put<T>(url, data, this.getHttpOptions())
      .pipe(catchError(this.handleError));
  }

  /**
   * DELETE: Remove data from the API.
   * @param endpoint - The API endpoint (relative to baseUrl)
   */
  delete<T>(endpoint: string): Observable<T> {
    const url = `${this.baseUrl}/${endpoint}`;
    return this.http
      .delete<T>(url, this.getHttpOptions())
      .pipe(catchError(this.handleError));
  }

  /**
   * Handles HTTP errors.
   * @param error
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    if (error.error instanceof ErrorEvent) {
      console.error('A client-side error occurred:', error.error.message);
    } else {
      console.error(
        `Backend returned code ${error.status}, ` +
          `body was: ${JSON.stringify(error.error)}`
      );
    }
    return throwError('Something went wrong; please try again later.');
  }
}
