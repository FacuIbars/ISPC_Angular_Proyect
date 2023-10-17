import { Pipe, PipeTransform } from '@angular/core';


@Pipe({
  name: 'translateGen'
})
export class TranslatePipe implements PipeTransform {
  transform(value: string): string {
    const translations: { [key: string]: string } = {
      Agender: 'Agénero',
      Bigender: 'Bigénero',
      Female: 'Femenino',
      Genderfluid: 'Género fluido',
      Genderqueer: 'Género no binario',
      Male: 'Masculino',
      'Non-binary': 'No binario',
      Polygender: 'Poligénero'
    };

    return translations[value] || value;

}}
