import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { TableConfig } from 'src/app/interface/ITable-config';
import { TableColumn } from 'src/app/interface/ITable-colum';
import { TableAction } from 'src/app/interface/ITable-action';
import { TABLE_ACTION } from 'src/app/enums/table-action-enum';
import { PersonsService } from 'src/app/service/persons.service';
import { IPerson } from 'src/app/interface/IPerson';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements AfterViewInit, OnChanges {  
  dataSource: MatTableDataSource<Array<any>> = new MatTableDataSource();

  dataSourceAlumnos: MatTableDataSource<Array<any>> = new MatTableDataSource();
  dataSourceProfesores: MatTableDataSource<Array<any>> = new MatTableDataSource();

  tableConfig: TableConfig | undefined;
  tableDisplayColumns: string[] = [];
  tableColumns: any[] = [];
  personsService: any;  
  @Input() set data(data: Array<any>) {
    this.dataSource = new MatTableDataSource(data);

    this.dataSourceAlumnos = new MatTableDataSource(data);
    this.dataSourceProfesores = new MatTableDataSource(data);

    this.dataSource.paginator = this.paginator;
  }   
  @Input() set columns(columns: TableColumn[]) {
    this.tableColumns = columns;
    this.tableDisplayColumns = this.tableColumns.map((col) => col.def);  }
  @Input() set config(config: TableConfig) {
    this.setConfig(config);
  }
  @Input() item: string = "";
  @Input() loading: boolean = true;
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  @Output() action: EventEmitter<TableAction> = new EventEmitter();
  
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnChanges(changes: SimpleChanges) {
    if(this.data !== undefined){
      //this.loading = false
    }
    
  }
  
  setConfig(config: TableConfig) {
    this.tableConfig = config;  

    if (this.tableConfig.showActions) {
      this.tableDisplayColumns.push('actions');
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    this.dataSourceAlumnos.filter = filterValue.trim().toLowerCase();
    this.dataSourceProfesores.filter = filterValue.trim().toLowerCase();
   
  }
  
  addItem() {   
    this.action.emit({ action: TABLE_ACTION.ADD, row: null });
  }

  // Funciones para los botones de acción
  verItem(row: any) {
    this.action.emit({ action: TABLE_ACTION.SEE, row });
  }

  editarItem(row: any) {
    this.action.emit({ action: TABLE_ACTION.EDIT, row });
  }

  borrarItem(row: any) {
    this.action.emit({ action: TABLE_ACTION.DELETE, row });
  }

  verDetalle(row: any) {
    this.personsService.getPersonById(row.id).subscribe(
      (data: IPerson) => {
        // Aquí puedes manejar los datos de la persona recuperada, por ejemplo, mostrarlos en un modal o ventana emergente.
        console.log('Detalles de la persona:', data);
      },
      (error: any) => {
        console.error('Error al recuperar la persona:', error);
      }
    );
  }
}

