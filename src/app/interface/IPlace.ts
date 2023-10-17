import { INeighborhood } from "./INeighborhood";
import { ICity } from "./ICity";
import { IProvince } from "./IProvince";
import { ICountry } from "./ICountry";

export interface IPlace {

  id?: number;
  pais: string;
  ciudad: string;
  barrio: string;
  provincia: string;
}



