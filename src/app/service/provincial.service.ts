import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { IProvincialServies } from '../interface/IProvincialServices';

@Injectable({
  providedIn: 'root'
})
export class PersonsService {
 // private jsonUrl = 'assets/db/Person.json';
  private backendUrl = 'http://127.0.0.1:8000/app/api/v1/'; 
  constructor(private http: HttpClient) { }

  getProvincialServies(): Observable<IProvincialServies[]>{
    const url = `${this.backendUrl}provincias/`;
    return this.http.get<IProvincialServies[]>(url);
  }

  postProvincialServies(newProvincialServies: IProvincialServies): Observable<IProvincialServies[]> {
    const url = `${this.backendUrl}provincias/`;
    return this.http.post<IProvincialServies[]>(url, newProvincialServies);
  }

  getProvincialServiesById(id: number): Observable<IProvincialServies> {
    const url = `${this.backendUrl}provincias/${id}/`;
    return this.http.get<IProvincialServies>(url);
  }

  updateProvincialServies(id: number, updatedProvincialServies: IProvincialServies): Observable<IProvincialServies> {
    const url = `${this.backendUrl}provincias/${id}/`;
    return this.http.put<IProvincialServies>(url, updatedProvincialServies);
  }

  deleteProvincialServies(id: number): Observable<void> {
    const url = `${this.backendUrl}provincias/${id}/`;
    return this.http.delete<void>(url);
  }
  
}