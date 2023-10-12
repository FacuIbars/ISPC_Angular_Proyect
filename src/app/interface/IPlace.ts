import { INeighborhood } from "./INeighborhood";
import { ICity } from "./ICity";
import { IProvince } from "./IProvince";
import { ICountry } from "./ICountry";

export interface IPlace {

  id?: number;
  pais: ICountry;
  ciudad: ICity;
  barrio: INeighborhood;
  provincia: IProvince;
}



