import { Injectable } from '@angular/core';
import { IPerson} from '../interface/IPerson';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { IPersonTitulaciones } from '../interface/IPersonTitulaciones';


@Injectable({
  providedIn: 'root'
})
export class PersonsService {
  private jsonUrl = 'assets/db/Persons.json';
  private backendUrl = 'http://127.0.0.1:8000/app/api/v1/'; 
  constructor(private http: HttpClient) { }


  getPersons(): Observable<IPerson[]>{
    const url = `${this.backendUrl}personas/`;
    return this.http.get<IPerson[]>(url);
  }

  postPersons(newPerson: IPerson): Observable<IPerson[]> {
    const url = `${this.backendUrl}personas/`;
    return this.http.post<IPerson[]>(url, newPerson);
  }

  getPersonById(id: number): Observable<IPerson> {
    const url = `${this.backendUrl}personas/${id}/`;
    return this.http.get<IPerson>(url);
  }
  
  updatePerson(id: number, updatedPerson: IPerson): Observable<IPerson> {
    const url = `${this.backendUrl}personas/${id}/`;
    return this.http.put<IPerson>(url, updatedPerson);
  }

  deletePerson(id: number): Observable<void> {
    const url = `${this.backendUrl}personas/${id}/`;
    return this.http.delete<void>(url);
  } 

/*------------------------------Persona Titulaciones------------------------------------*/

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