export interface IPerson {
  id?: number;
  genero: string;
  lugar: {
    pais: string;
    ciudad: string;
    barrio: string;
    provincia: string;
  }
  nombre: string;
  apellido: string;
  email: string;
  birthdate: string;
  personal_id: string;

}
