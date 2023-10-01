import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { IPersonTitulaciones } from '../interface/IPersonTitulaciones';

@Injectable({
  providedIn: 'root'
})
export class PersonsService {
 // private jsonUrl = 'assets/db/Person.json';
  private backendUrl = 'http://127.0.0.1:8000/app/api/v1/'; 
  constructor(private http: HttpClient) { }

  getPersonTitulaciones(): Observable<IPersonTitulaciones[]>{
    const url = `${this.backendUrl}personasTitulaciones/`;
    return this.http.get<IPersonTitulaciones[]>(url);
  }

  postPersonTitulaciones(newPerson: IPersonTitulaciones): Observable<IPersonTitulaciones[]> {
    const url = `${this.backendUrl}personasTitulaciones/`;
    return this.http.post<IPersonTitulaciones[]>(url, newPerson);
  }

  getPersonTitulacionesById(id: number): Observable<IPersonTitulaciones> {
    const url = `${this.backendUrl}personasTitulaciones/${id}/`;
    return this.http.get<IPersonTitulaciones>(url);
  }

  updatePersonTitulaciones(id: number, updatedPersonTitulaciones: IPersonTitulaciones): Observable<IPersonTitulaciones> {
    const url = `${this.backendUrl}personasTitulaciones/${id}/`;
    return this.http.put<IPersonTitulaciones>(url, updatedPersonTitulaciones);
  }

  deletePersonTitulaciones(id: number): Observable<void> {
    const url = `${this.backendUrl}personasTitulaciones/${id}/`;
    return this.http.delete<void>(url);
  } 
  
}