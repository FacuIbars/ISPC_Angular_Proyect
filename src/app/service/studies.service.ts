import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IUniversity } from '../interface/IUniversity';
import { IFaculty } from '../interface/IFaculty';
import { IProgram } from '../interface/IProgram';
import { ICampus } from '../interface/ICampus';
import { ICareers } from '../interface/ICareers';

@Injectable({
  providedIn: 'root'
})
export class StudiesService {
  private backendUrl = 'http://127.0.0.1:8000/app/api/v1/';
  constructor(private http: HttpClient) { }

  /*------------------------------Universidades------------------------------------*/

  getUniversity(): Observable<IUniversity[]>{
    const url = `${this.backendUrl}universidades/`;
    return this.http.get<IUniversity[]>(url);
  }

  postUniversity(newUniversity: IUniversity): Observable<IUniversity[]> {
    const url = `${this.backendUrl}universidades/`;
    return this.http.post<IUniversity[]>(url, newUniversity);
  }

  getUniversityId(id: number | undefined): Observable<IUniversity> {
    const url = `${this.backendUrl}universidades/${id}/`;
    return this.http.get<IUniversity>(url);
  }
  
  updateUniversity(id: number | undefined, updatedUniversity: IUniversity): Observable<IUniversity> {
    const url = `${this.backendUrl}universidades/${id}/`;
    return this.http.put<IUniversity>(url, updatedUniversity);
  }

  deleteUniversity(id: number | undefined): Observable<void> {
    const url = `${this.backendUrl}universidades/${id}/`;
    return this.http.delete<void>(url);
  } 

/*------------------------------Facultades------------------------------------*/

getFaculty(): Observable<IFaculty[]>{
  const url = `${this.backendUrl}facultades/`;
  return this.http.get<IFaculty[]>(url);
}

postFaculty(newFaculty: IFaculty): Observable<IFaculty[]> {
  const url = `${this.backendUrl}facultades/`;
  return this.http.post<IFaculty[]>(url, newFaculty);
}

getFacultyById(id: number): Observable<IFaculty> {
  const url = `${this.backendUrl}facultades/${id}/`;
  return this.http.get<IFaculty>(url);
}

updateFaculty(id: number, updatedFaculty: IFaculty): Observable<IFaculty> {
  const url = `${this.backendUrl}facultades/${id}/`;
  return this.http.put<IFaculty>(url, updatedFaculty);
}

deleteFaculty(id: number): Observable<void> {
  const url = `${this.backendUrl}facultades/${id}/`;
  return this.http.delete<void>(url);
} 

/*------------------------------Programas------------------------------------*/

getProgram(): Observable<IProgram[]>{
  const url = `${this.backendUrl}carreras/`;
  return this.http.get<IProgram[]>(url);
}

postProgram(newProgram: IProgram): Observable<IProgram[]> {
  const url = `${this.backendUrl}carreras/`;
  return this.http.post<IProgram[]>(url, newProgram);
}

getProgramById(id: number): Observable<IProgram> {
  const url = `${this.backendUrl}carreras/${id}/`;
  return this.http.get<IProgram>(url);
}

updateProgram(id: number, updatedProgram: IProgram): Observable<IProgram> {
  const url = `${this.backendUrl}carreras/${id}/`;
  return this.http.put<IProgram>(url, updatedProgram);
}

deleteProgram(id: number): Observable<void> {
  const url = `${this.backendUrl}carreras/${id}/`;
  return this.http.delete<void>(url);
} 

/*------------------------------Campus------------------------------------*/

getCampus(): Observable<ICampus[]>{
const url = `${this.backendUrl}campus/`;
return this.http.get<ICampus[]>(url);
}

postCampus(newCampus: ICampus): Observable<ICampus[]> {
const url = `${this.backendUrl}campus/`;
return this.http.post<ICampus[]>(url, newCampus);
}

getCampusById(id: number): Observable<ICampus> {
const url = `${this.backendUrl}campus/${id}/`;
return this.http.get<ICampus>(url);
}

updateCampus(id: number, updatedCampus: ICampus): Observable<ICampus> {
const url = `${this.backendUrl}campus/${id}/`;
return this.http.put<ICampus>(url, updatedCampus);
}

deleteCampus(id: number): Observable<void> {
const url = `${this.backendUrl}campus/${id}/`;
return this.http.delete<void>(url);
}

/*------------------------------Carreras------------------------------------*/

getCareers(): Observable<ICareers[]>{
  const url = `${this.backendUrl}titulaciones/`;
  return this.http.get<ICareers[]>(url);
}

postCareers(newCareer: ICareers): Observable<ICareers[]> {
  const url = `${this.backendUrl}titulaciones/`;
  return this.http.post<ICareers[]>(url, newCareer);
}

getCareerById(id: number): Observable<ICareers> {
  const url = `${this.backendUrl}titulaciones/${id}/`;
  return this.http.get<ICareers>(url);
}

updateCareer(id: number, updatedCareer: ICareers): Observable<ICareers> {
  const url = `${this.backendUrl}titulaciones/${id}/`;
  return this.http.put<ICareers>(url, updatedCareer);
}

deleteCareer(id: number): Observable<void> {
  const url = `${this.backendUrl}titulaciones/${id}/`;
  return this.http.delete<void>(url);
}

}
