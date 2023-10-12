import { AfterViewInit, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { ModalComponent } from 'src/app/components/modal/modal.component';
import { TABLE_ACTION } from 'src/app/enums/table-action-enum';
import { IPerson } from 'src/app/interface/IPerson';
import { TableAction } from 'src/app/interface/ITable-action';
import { TableColumn } from 'src/app/interface/ITable-colum';
import { TableConfig } from 'src/app/interface/ITable-config';
import { ModalService } from 'src/app/service/modal.service';
import { PersonsService } from 'src/app/service/persons.service';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-person-view',
  templateUrl: './person-view.component.html',
  styleUrls: ['./person-view.component.scss'],

})
export class PersonViewComponent implements OnInit {
  generoTraducciones: { [key: string]: string } = {
    Agender: 'Agénero',
    Bigender: 'Bigénero',
    Female: 'Femenino',
    Genderfluid: 'Género fluido',
    Genderqueer: 'Género no binario',
    Male: 'Masculino',
    'Non-binary': 'No binario',
    Polygender: 'Poligénero',
  };
  
  traducirGenero(generoOriginal: string): string {
    const generoTraducido = this.generoTraducciones[generoOriginal];
    return generoTraducido || generoOriginal;
  }
   
    
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('vistaInfo', { static: true }) vistaInfo!: TemplateRef<any>
  dataSource: Array<IPerson> = [];;
  tableColumns: TableColumn[] = [];
  tableConfig: TableConfig = {
    isPaginable: true,
    showFilter: true,
    showActions: true,
    showSeeButton: true,
    showEditButton: true,
    showDeleteButton: true,
  };
  private matDialogRef!: MatDialogRef<ModalComponent>;
  person!: IPerson
  loadingProgressBar: boolean = true;

  constructor(
    private personsService: PersonsService,
    private modalService: ModalService) { }

  ngOnInit(): void {
    this.setTableColumns();
    this.personsService.getPersons().subscribe((persons) => {
      console.log('esto es el mock: ', persons);
      this.loadingProgressBar = false;
      this.dataSource = persons;

    });

  }

  setTableColumns() { ///tabla de alumno o profesores
    this.tableColumns = [

      { label: 'Nombre', def: 'nombre', dataKey: 'nombre' },
      { label: 'Apellido', def: 'apellido', dataKey: 'apellido' },
      { label: 'Correo electronico', def: 'email', dataKey: 'email' },
      { label: 'DNI', def: 'personal_id', dataKey: 'personal_id' },
    ];
  }

  onTableAction(tableAction: TableAction) {
    switch (tableAction.action) {

      case TABLE_ACTION.SEE:
        this.onSee(tableAction.row, this.vistaInfo);
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

  onSee(person: IPerson, template: TemplateRef<any>) {
    this.person = person;
    this.openModalTemplate(template);
    console.log('Ver ', person);
  }

  onEdit(person: IPerson) {
    console.log('Edit', person);
  }
  onDelete(person: IPerson) {
    console.log('Delete', person);
  }

  openModalTemplate(template: TemplateRef<any>) {
    this.matDialogRef = this.modalService.openModal({
      template,
    });

    this.matDialogRef.afterClosed().subscribe((res) => {
      console.log('Dialog With Template Close', res);
      //this.formGroup.reset();
    });
  }

}

