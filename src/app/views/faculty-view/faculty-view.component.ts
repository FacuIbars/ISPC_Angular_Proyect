import { Component, TemplateRef, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { ModalComponent } from 'src/app/components/modal/modal.component';
import { TABLE_ACTION } from 'src/app/enums/table-action-enum';
import { IFaculty } from 'src/app/interface/IFaculty';
import { TableAction } from 'src/app/interface/ITable-action';
import { TableColumn } from 'src/app/interface/ITable-colum';
import { TableConfig } from 'src/app/interface/ITable-config';
import { ModalService } from 'src/app/service/modal.service';
import { StudiesService } from 'src/app/service/studies.service';

@Component({
  selector: 'app-faculty-view',
  templateUrl: './faculty-view.component.html',
  styleUrls: ['./faculty-view.component.scss']
})
export class FacultyViewComponent  {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('vistaInfo', { static: true }) vistaInfo!: TemplateRef<any>
  dataSource: Array<IFaculty> = [];;
  tableColumns: TableColumn[] = [];
  tableConfig: TableConfig = {
    isPaginable: true,
    showFilter: true,
    showActions: true,
    showSeeButton: false,
    showEditButton: true,
    showDeleteButton: true,
  };
  private matDialogRef!: MatDialogRef<ModalComponent>;
  faculty!: IFaculty;


  constructor(
    private studiesService: StudiesService,
    private modalService: ModalService) { }


  ngOnInit(): void {
    this.setTableColumns();
    this.studiesService.getFaculty().subscribe((faculty) => { 
      console.log('esto es el mock: ', faculty);
      // Configura los datos en la fuente de datos MatTableDataSource
      this.dataSource = faculty;


    });

  }

  setTableColumns() {
    this.tableColumns = [
      { label: 'Facultad', def: 'nombre', dataKey: 'nombre' },

    ];
  }

  onTableAction(tableAction: TableAction) {
    switch (tableAction.action) {

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

  onEdit(faculty: IFaculty) { 
    console.log('Edit', faculty);
  }
  onDelete(faculty: IFaculty) { 
    console.log('Delete', faculty);
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
