import { Component, TemplateRef, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { ModalComponent } from 'src/app/components/modal/modal.component';
import { TABLE_ACTION } from 'src/app/enums/table-action-enum';
import { TableAction } from 'src/app/interface/ITable-action';
import { TableColumn } from 'src/app/interface/ITable-colum';
import { TableConfig } from 'src/app/interface/ITable-config';
import { IUniversity } from 'src/app/interface/IUniversity';
import { ModalService } from 'src/app/service/modal.service';
import { StudiesService } from 'src/app/service/studies.service';

@Component({
  selector: 'app-universities-view',
  templateUrl: './universities-view.component.html',
  styleUrls: ['./universities-view.component.scss']
})
export class UniversitiesViewComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('vistaInfo', {static: true}) vistaInfo!: TemplateRef<any>  
  dataSource: Array<IUniversity> = [];;
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
  university!: IUniversity;


  constructor(
    private studiesService: StudiesService,
    private modalService: ModalService) { }

  
  ngOnInit(): void {
    this.setTableColumns();
    this.studiesService.getUniversity().subscribe((university) => {
      console.log('esto es el mock: ', university);
      // Configura los datos en la fuente de datos MatTableDataSource
      this.dataSource = university;
      
       
    });

  }

  setTableColumns() {
    this.tableColumns = [            
      { label: 'Universidad', def: 'nombre', dataKey: 'nombre' },
     
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

  onSee(university: IUniversity, template: TemplateRef<any>) {
    this.university = university ;
    this.openModalTemplate(template);
    console.log('Ver ', university);
  }

  onEdit(university: IUniversity) {
    console.log('Edit', university);
  }
  onDelete(university: IUniversity) {
    console.log('Delete', university);
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
