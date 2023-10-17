import { IGenders } from "./IGenders";
import { IPlace } from "./IPlace";

export interface IPerson {
  id?: number;
  genero:string;
  lugar: IPlace;
  nombre: string;
  apellido: string;
  email: string;
  birthdate: string;
  personal_id: string;

}

export interface IPersonAddEdit {
  id?: number;
  genero:number;
  lugar?: number;
  nombre: string;
  apellido: string;
  email: string;
  birthdate: string;
  personal_id: string;

}
