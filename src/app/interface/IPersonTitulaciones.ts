import { IPerson } from "./IPerson";

export interface IPersonTitulaciones {
  id:number;
  persona: number;
  titulacion: number;
  tipo: 'alumno' | 'profesor';
}
