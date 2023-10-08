import { Component, TemplateRef, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { ModalComponent } from 'src/app/components/modal/modal.component';
import { TABLE_ACTION } from 'src/app/enums/table-action-enum';
import { ICampus } from 'src/app/interface/ICampus';
import { TableAction } from 'src/app/interface/ITable-action';
import { TableColumn } from 'src/app/interface/ITable-colum';
import { TableConfig } from 'src/app/interface/ITable-config';
import { ModalService } from 'src/app/service/modal.service';
import { StudiesService } from 'src/app/service/studies.service';

@Component({
  selector: 'app-campus-view',
  templateUrl: './campus-view.component.html',
  styleUrls: ['./campus-view.component.scss']
})
export class CampusViewComponent  {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('vistaInfo', { static: true }) vistaInfo!: TemplateRef<any>
  dataSource: Array<ICampus> = [];;
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
  faculty!: ICampus;


  constructor(
    private studiesService: StudiesService,
    private modalService: ModalService) { }


  ngOnInit(): void {
    this.setTableColumns();
    this.studiesService.getCampus().subscribe((campus) => { 
      console.log('esto es el mock: ', campus);
      // Configura los datos en la fuente de datos MatTableDataSource
      this.dataSource = campus;


    });

  }

  setTableColumns() {
    this.tableColumns = [
      { label: 'Campus', def: 'nombre', dataKey: 'nombre' },

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

  /*onSee(campus: ICampus, template: TemplateRef<any>) {
    this.campus = campus;
    this.openModalTemplate(template);
    console.log('Ver ', campus);
  }*/

  onEdit(campus: ICampus) { 
    console.log('Edit', campus);
  }
  onDelete(campus: ICampus) { 
    console.log('Delete', campus);
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
