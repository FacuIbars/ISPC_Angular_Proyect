import { Injectable } from '@angular/core';
import { IGenders} from '../interface/IGenders';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class PersonsService {
  private jsonUrl = 'assets/db/Persons.json';
  private backendUrl = 'http://127.0.0.1:8000/app/api/v1/'; 
  constructor(private http: HttpClient) { }


  getGenders(): Observable<IGenders[]>{
    const url = `${this.backendUrl}generos/`;
    return this.http.get<IGenders[]>(url);
  }

  postGenders(newGenders: IGenders): Observable<IGenders[]> {
    const url = `${this.backendUrl}generos/`;
    return this.http.post<IGenders[]>(url, newGenders);
  }

  getGendersById(id: number): Observable<IGenders> {
    const url = `${this.backendUrl}generos/${id}/`;
    return this.http.get<IGenders>(url);
  }
  
  updateGenders(id: number, updatedPerson: IGenders): Observable<IGenders> {
    const url = `${this.backendUrl}generos/${id}/`;
    return this.http.put<IGenders>(url, updatedPerson);
  }

  deleteGenders(id: number): Observable<void> {
    const url = `${this.backendUrl}generos/${id}/`;
    return this.http.delete<void>(url);
  } 
}