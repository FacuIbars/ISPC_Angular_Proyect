import { ICareers } from "./ICareers";
import { IPerson } from "./IPerson";

export interface IPersonTitulaciones {
  id?:number;
  persona: IPerson;
  titulacion: ICareers;
  tipo: string;
}

export interface IPersonTitulacionesAddEdit {
  id?:number;
  persona?: number;
  titulacion?: number;
  tipo: number;
}
