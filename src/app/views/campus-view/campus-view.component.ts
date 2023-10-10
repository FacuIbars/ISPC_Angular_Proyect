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
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
@Component({
  selector: 'app-campus-view',
  templateUrl: './campus-view.component.html',
  styleUrls: ['./campus-view.component.scss']
})
export class CampusViewComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('AddEditCampus', { static: true }) AddEditCampus!: TemplateRef<any>
  dataSource: Array<ICampus> = [];;
  tableColumns: TableColumn[] = [];
  tableConfig: TableConfig = {
    isPaginable: true,
    showFilter: true,
    showAddButton: true,
    showActions: true,
    showSeeButton: false,
    showEditButton: true,
    showDeleteButton: true,
  };
  private matDialogRef!: MatDialogRef<ModalComponent>;
  campus!: ICampus;
  form: FormGroup;
  loading: boolean = false;
  operation: string = '';
  idCampus?: number;

  constructor(
    private studiesService: StudiesService,
    private modalService: ModalService,
    private fb: FormBuilder,) {
    this.form = this.fb.group({
      campus: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
    })

  }

  ngOnInit(): void {
    this.setTableColumns();
    this.getCampus();

  }

  getCampus() {
    this.studiesService.getCampus().subscribe((campus) => {
      console.log('esto es el mock: ',campus);
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

      case TABLE_ACTION.ADD:
        this.onAdd(this.AddEditCampus);
        break;

      case TABLE_ACTION.EDIT:
        this.onEdit(tableAction.row, this.AddEditCampus);
        break;

      case TABLE_ACTION.DELETE:
        this.onDelete(tableAction.row);
        break;

      default:
        break;
    }
  }

  onAdd(template: TemplateRef<any>){
    this.operation = 'Agregar nueva '
    this.openModalTemplate(template);       
    this.idCampus = undefined;
      
  } 

  onEdit(campus: ICampus, template: TemplateRef<any>) {  
    this.idCampus = campus.id;  
    this.operation = 'Editar ' 
    this.openModalTemplate(template);
    this.form.patchValue({
      id:campus.id,
      campus:campus.nombre,      
    });     
  }
  onDelete(campus: ICampus) {
    this.studiesService.deleteCampus(campus.id)
    .pipe(
      catchError((error) => {        
        console.error('Error al eliminar el campus:', error);
        this.modalService.mensaje('No se puede eliminar el campus debido a restricciones de clave foránea.', 3);
        // Retorna un observable vacío para que la suscripción no falle
        return of();
      })
    )   
    .subscribe(()=> {      
      this.modalService.mensaje('Campus eliminado con Exito!', 2);
      setTimeout(() => {window.location.reload();}, 4000)
    });
  }

  addEditCampus() { 
    console.log('id campus',this.idCampus)
    const campus:ICampus  = {
      id:this.idCampus,
      nombre: this.form.get('campus')?.value,      
    };
    console.log('id campus',campus)
    
    this.loading = true;

    if(campus.id == undefined){      
      //Es agregar
      this.studiesService.postCampus(campus).subscribe(()=>{  
        this.modalService.mensaje('Nuevo Campus agregado con Exito !', 2);       
      })
    }else {
      // es Editar
      this.studiesService.updateCampus(this.idCampus, campus).subscribe(data => {        
        this.modalService.mensaje('Campus editado con Exito !', 2);
      })
    }
    this.loading = false;
    this.matDialogRef.close(true);
    this.getCampus();

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
