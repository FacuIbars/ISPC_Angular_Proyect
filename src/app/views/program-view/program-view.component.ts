import { Component, TemplateRef, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { ModalComponent } from 'src/app/components/modal/modal.component';
import { TABLE_ACTION } from 'src/app/enums/table-action-enum';
import { IProgram } from 'src/app/interface/IProgram';
import { TableAction } from 'src/app/interface/ITable-action';
import { TableColumn } from 'src/app/interface/ITable-colum';
import { TableConfig } from 'src/app/interface/ITable-config';
import { ModalService } from 'src/app/service/modal.service';
import { StudiesService } from 'src/app/service/studies.service';

@Component({
  selector: 'app-program-view',
  templateUrl: './program-view.component.html',
  styleUrls: ['./program-view.component.scss']
})
export class ProgramViewComponent  {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('vistaInfo', { static: true }) vistaInfo!: TemplateRef<any>
  dataSource: Array<IProgram> = [];;
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
  faculty!: IProgram;


  constructor(
    private studiesService: StudiesService,
    private modalService: ModalService) { }


  ngOnInit(): void {
    this.setTableColumns();
    this.studiesService.getProgram().subscribe((program) => { 
      console.log('esto es el mock: ', program);
      // Configura los datos en la fuente de datos MatTableDataSource
      this.dataSource = program;


    });

  }

  setTableColumns() {
    this.tableColumns = [
      { label: 'Programas', def: 'nombre', dataKey: 'nombre' },

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

  onEdit(program: IProgram) { 
    console.log('Edit', program);
  }
  onDelete(program: IProgram) { 
    console.log('Delete', program);
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
