import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ILogin } from '../interface/ILogin';
import { ISignUp } from '../interface/ISignUp';
import { ITest_token } from '../interface/ITest_token';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  //private jsonUrl = 'assets/db/Persons.json';
  private backendUrl = 'http://127.0.0.1:8000/app/'; 
  constructor(private http: HttpClient) { }

  /*------------------------------Login------------------------------------*/

  login(username: string, password: string): Observable<any> {
    return this.http.post<ILogin>(`${this.backendUrl}/login`, { username, password })
      .pipe(
        map(response => {
          if (response && response.token) {
            localStorage.setItem('token', response.token);
          }
          return response;
        })
      );
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
