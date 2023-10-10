import { ICampus } from "./ICampus";
import { IFaculty } from "./IFaculty";
import { IProgram } from "./IProgram";
import { IUniversity } from "./IUniversity";

export interface ICareers {
     
    id?: number;    
    universidad: IUniversity;
    facultad: IFaculty;
    campus: ICampus;
    carrera: IProgram;    
}