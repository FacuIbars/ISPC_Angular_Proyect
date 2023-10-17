import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { INeighborhood } from '../interface/INeighborhood';
import { IProvince } from '../interface/IProvince';
import { ICity } from '../interface/ICity';
import { ICountry } from '../interface/ICountry';
import { IPlace } from '../interface/IPlace';

@Injectable({
  providedIn: 'root'
})
export class LugarService {
  private backendUrl = 'http://127.0.0.1:8000/app/api/v1/';
  constructor(private http: HttpClient) { }

  /*------------------------------Barrios------------------------------------*/

  getNeighborhoody(): Observable<INeighborhood[]> {
    const url = `${this.backendUrl}barrios/`;
    return this.http.get<INeighborhood[]>(url);
  }

  postNeighborhood(newNeighborhood: INeighborhood): Observable<INeighborhood[]> {
    const url = `${this.backendUrl}barrios/`;
    return this.http.post<INeighborhood[]>(url, newNeighborhood);
  }

  getNeighborhoodId(id: number | undefined): Observable<INeighborhood> {
    const url = `${this.backendUrl}barrios/${id}/`;
    return this.http.get<INeighborhood>(url);
  }

  updateNeighborhoodId(id: number | undefined, updatedNeighborhoodId: INeighborhood): Observable<INeighborhood> {
    const url = `${this.backendUrl}barrios/${id}/`;
    return this.http.put<INeighborhood>(url, updatedNeighborhoodId);
  }

  deleteNeighborhoodId(id: number | undefined): Observable<void> {
    const url = `${this.backendUrl}barrios/${id}/`;
    return this.http.delete<void>(url);
  }

  /*------------------------------Ciudades------------------------------------*/

  getCity(): Observable<ICity[]> {
    const url = `${this.backendUrl}ciudades/`;
    return this.http.get<ICity[]>(url);
  }

  postCity(newCity: ICity): Observable<ICity[]> {
    const url = `${this.backendUrl}ciudades/`;
    return this.http.post<ICity[]>(url, newCity);
  }

  getCityId(id: number | undefined): Observable<ICity> {
    const url = `${this.backendUrl}ciudades/${id}/`;
    return this.http.get<ICity>(url);
  }

  updateCityId(id: number | undefined, updatedCityId: ICity): Observable<ICity> {
    const url = `${this.backendUrl}ciudades/${id}/`;
    return this.http.put<ICity>(url, updatedCityId);
  }

  deleteCityId(id: number | undefined): Observable<void> {
    const url = `${this.backendUrl}ciudades/${id}/`;
    return this.http.delete<void>(url);
  }

  /*------------------------------Provincias------------------------------------*/

  getProvince(): Observable<IProvince[]> {
    const url = `${this.backendUrl}provincias/`;
    return this.http.get<IProvince[]>(url);
  }

  postProvince(newProvince: IProvince): Observable<IProvince[]> {
    const url = `${this.backendUrl}provincias/`;
    return this.http.post<IProvince[]>(url, newProvince);
  }

  getProvinceId(id: number | undefined): Observable<IProvince> {
    const url = `${this.backendUrl}provincias/${id}/`;
    return this.http.get<IProvince>(url);
  }

  updateProvinceId(id: number | undefined, updatedProvinceId: IProvince): Observable<IProvince> {
    const url = `${this.backendUrl}provincias/${id}/`;
    return this.http.put<IProvince>(url, updatedProvinceId);
  }

  deleteProvinceId(id: number | undefined): Observable<void> {
    const url = `${this.backendUrl}provincias/${id}/`;
    return this.http.delete<void>(url);
  }

  /*------------------------------Paises------------------------------------*/

  getCountry(): Observable<ICountry[]> {
    const url = `${this.backendUrl}paises/`;
    return this.http.get<ICountry[]>(url);
  }

  postCountry(newCountry: ICountry): Observable<ICountry[]> {
    const url = `${this.backendUrl}paises/`;
    return this.http.post<ICountry[]>(url, newCountry);
  }

  getCountryId(id: number | undefined): Observable<ICountry> {
    const url = `${this.backendUrl}paises/${id}/`;
    return this.http.get<ICountry>(url);
  }

  updateCountryId(id: number | undefined, updatedCountryId: ICountry): Observable<ICountry> {
    const url = `${this.backendUrl}paises/${id}/`;
    return this.http.put<ICountry>(url, updatedCountryId);
  }

  deleteCountryId(id: number | undefined): Observable<void> {
    const url = `${this.backendUrl}paises/${id}/`;
    return this.http.delete<void>(url);
  }

  /*------------------------------Lugares------------------------------------*/

  getPlace(): Observable<IPlace[]> {
    const url = `${this.backendUrl}lugares/`;
    return this.http.get<IPlace[]>(url);
  }

  postPlace(newPlace: IPlace): Observable<IPlace> {
    const url = `${this.backendUrl}lugares/`;
    return this.http.post<IPlace>(url, newPlace);
  }

  getPlaceId(id: number): Observable<IPlace> {
    const url = `${this.backendUrl}lugares/${id}/`;
    return this.http.get<IPlace>(url);
  }

  updatePlaceId(id: number | undefined, updatedPlaceId: IPlace): Observable<IPlace> {
    const url = `${this.backendUrl}lugares/${id}/`;
    return this.http.put<IPlace>(url, updatedPlaceId);
  }

  deletePlaceId(id: number | undefined): Observable<void> {
    const url = `${this.backendUrl}lugares/${id}/`;
    return this.http.delete<void>(url);
  }

}
