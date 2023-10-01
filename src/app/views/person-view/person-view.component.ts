import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import {MatTabsModule} from '@angular/material/tabs';
import { TABLE_ACTION } from 'src/app/enums/table-action-enum';
import { IPerson } from 'src/app/interface/IPerson';
import { TableAction } from 'src/app/interface/ITable-action';
import { TableColumn } from 'src/app/interface/ITable-colum';
import { TableConfig } from 'src/app/interface/ITable-config';
import { PersonsService } from 'src/app/service/persons.service';

@Component({
  selector: 'app-person-view',
  templateUrl: './person-view.component.html',
  styleUrls: ['./person-view.component.scss']
})
export class PersonViewComponent implements  OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;  
  dataSource: Array<IPerson> = [];;
  tableColumns: TableColumn[] = [];  
  tableConfig: TableConfig = {
    isPaginable: true,
    showActions: true,
  };

    constructor(private personsService: PersonsService) { }

  ngOnInit(): void {
    this.setTableColumns();
    this.personsService.getPersons().subscribe((persons) => {
      console.log('esto es el mock: ', persons);
      // Configura los datos en la fuente de datos MatTableDataSource
      this.dataSource = persons;
      
       
    });

    
  }

  setTableColumns() {
    this.tableColumns = [
      
      { label: 'Nombre', def: 'nombre', dataKey: 'nombre' },
      { label: 'Apellido', def: 'apellido', dataKey: 'apellido' },     
      { label: 'Correo', def: 'email', dataKey: 'email' },
      { label: 'Edad', def: 'birthdate', dataKey: 'birthdate' },
      { label: 'Género', def: 'genero', dataKey: 'genero' },
      { label: 'DNI', def: 'personal_id', dataKey: 'personal_id' },
      
    ];
  }

  onTableAction(tableAction: TableAction) {
    switch (tableAction.action) {

      case TABLE_ACTION.SEE:
        this.onSee(tableAction.row);
        break;

      case TABLE_ACTION.EDIT:
        this.onEdit(tableAction.row);
        break;

      case TABLE_ACTION.DELETE:
        this.onDelete(tableAction.row);
        break;

      default:
        break;
    }
  }

  onSee(person: IPerson) {
    console.log('Ver ', person);
  }

  onEdit(person: IPerson) {
    console.log('Edit', person);
  }
  onDelete(person: IPerson) {
    console.log('Delete', person);
  }
}

