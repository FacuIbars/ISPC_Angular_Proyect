import { Injectable } from '@angular/core';
import { Observable, catchError, map } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { ILogin } from '../interface/ILogin';
import { ISignUp } from '../interface/ISignUp';
import { ITest_token } from '../interface/ITest_token';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  redirectUrl: string | null = null;
  private backendUrl = 'http://127.0.0.1:8000/app/'; 
  constructor(private http: HttpClient) { }

  /*------------------------------Login------------------------------------*/

  login(username: string, password: string): Observable<any> {
    const url = `${this.backendUrl}login`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });

    const body = {
      username: username,
      password: password,
    };

    return this.http.post(url, body, { headers: headers }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('Error en la solicitud:', error);
    throw error;
  }

  logout(): void {
    localStorage.removeItem('token');
    
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

 

   /*------------------------------signup ------------------------------------*/
  postSignUp(newSignUp: ISignUp): Observable<ISignUp> {
    const url = `${this.backendUrl}signup`;
    return this.http.post<ISignUp>(url, newSignUp)
    
}
  

  /*------------------------------test_token------------------------------------*/
  getTest_token(): Observable<ITest_token>{
    const url = `${this.backendUrl}test_token`;
    return this.http.get<ITest_token>(url);
  }

}  
