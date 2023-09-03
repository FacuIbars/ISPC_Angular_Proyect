import { Injectable } from '@angular/core';
import { IPerson } from '../interface/IPerson';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PersonsService {
  private jsonUrl = 'assets/db/Persons.json';
  constructor(private http: HttpClient) { }
  getPersons(): Observable<IPerson[]>{

    return this.http.get<IPerson[]>(this.jsonUrl);
  }
}
