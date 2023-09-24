import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import {MatTabsModule} from '@angular/material/tabs';
import { IPerson } from 'src/app/interface/IPerson';
import { PersonsService } from 'src/app/service/persons.service';

@Component({
  selector: 'app-person-view',
  templateUrl: './person-view.component.html',
  styleUrls: ['./person-view.component.scss']
})
export class PersonViewComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  dataSource: MatTableDataSource<IPerson> = new MatTableDataSource<IPerson>([]);
  displayedColumns: string[] = ['firstName', 'lastName', 'email', 'age', 'sex']; 
  customColumnTitles = {
    firstName: 'Nombre',
    lastName: 'Apellido',
    email: 'Correo Electrónico',
    age: 'Edad',
    sex: 'Género'
  };
  
  
  

  constructor(private personsService: PersonsService) { }

  ngAfterViewInit() {
    this.personsService.getPersons().subscribe((persons) => {
      console.log('esto es el mock: ', persons);

      // Configura los datos en la fuente de datos MatTableDataSource
      this.dataSource = new MatTableDataSource<IPerson>(persons);
      this.dataSource.paginator = this.paginator;
      console.log('esto paginador: ', persons); // Asigna el paginador a la fuente de datos después de la vista inicializada
    });

  }
}

