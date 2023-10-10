import { Component, TemplateRef, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { ModalComponent } from 'src/app/components/modal/modal.component';
import { TABLE_ACTION } from 'src/app/enums/table-action-enum';
import { TableAction } from 'src/app/interface/ITable-action';
import { TableColumn } from 'src/app/interface/ITable-colum';
import { TableConfig } from 'src/app/interface/ITable-config';
import { IFaculty } from 'src/app/interface/IFaculty';
import { ModalService } from 'src/app/service/modal.service';
import { StudiesService } from 'src/app/service/studies.service';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-faculty-view',
  templateUrl: './faculty-view.component.html',
  styleUrls: ['./faculty-view.component.scss']
})
export class FacultyViewComponent  {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('AddEditFacultad', { static: true }) AddEditFacultad!: TemplateRef<any>
  dataSource: Array<IFaculty> = [];;
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
  faculty!: IFaculty;
  form: FormGroup;
  loading:boolean = false;
  operation:string = '';
  idFacultad?:number ;
  loadingProgressBar:boolean = true;

  constructor(
    private studiesService: StudiesService,
    private modalService: ModalService, 
    private fb : FormBuilder,) {
      this.form= this.fb.group({        
        facultad:['',[Validators.required,Validators.minLength(3),Validators.maxLength(100)]],
      })      
      
     }

  ngOnInit(): void {
    this.setTableColumns();
    this.getFaculty();

  }

  getFaculty(){
    this.studiesService.getFaculty().subscribe((faculty) => {
      this.loadingProgressBar = false;
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

      case TABLE_ACTION.ADD:
        this.onAdd(this.AddEditFacultad);
        break;

      case TABLE_ACTION.EDIT:
        this.onEdit(tableAction.row, this.AddEditFacultad);
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
    this.idFacultad = undefined;
      
  } 

  onEdit(faculty: IFaculty, template: TemplateRef<any>) {  
    this.idFacultad = faculty.id;  
    this.operation = 'Editar ' 
    this.openModalTemplate(template);
    this.form.patchValue({
      id:faculty.id,
      facultad:faculty.nombre,      
    });     
  }

   onDelete(faculty: IFaculty) {
    this.studiesService.deleteFaculty(faculty.id)
    .pipe(
      catchError((error) => {        
        console.error('Error al eliminar la facultad:', error);
        this.modalService.mensaje('No se puede eliminar la facultad debido a restricciones de clave foránea.', 3);
        // Retorna un observable vacío para que la suscripción no falle
        return of();
      })
    )   
    .subscribe(()=> {      
      this.modalService.mensaje('Facultad eliminada con Exito!', 2);
      setTimeout(() => {window.location.reload();}, 4000)
    });
  }
  addEditFaculty() { 
    console.log('id facultad',this.idFacultad)
    const facultad:IFaculty  = {
      id:this.idFacultad,
      nombre: this.form.get('facultad')?.value,      
    };
    console.log('id facultad',facultad)
    
    this.loading = true;

    if(facultad.id == undefined){      
      //Es agregar
      this.studiesService.postFaculty(facultad).subscribe(()=>{  
        this.modalService.mensaje('Nueva Facultad agregada con Exito !', 2);       
      })
    }else {
      // es Editar
      this.studiesService.updateFaculty(this.idFacultad, facultad).subscribe(data => {        
        this.modalService.mensaje('Facultad editada con Exito !', 2);
      })
    }
    this.loading = false;
    this.matDialogRef.close(true);
  
  }

  openModalTemplate(template: TemplateRef<any>) {
    this.matDialogRef = this.modalService.openModal({template, width:'600px'} );

    this.matDialogRef.afterClosed().subscribe((res) => {
      console.log('Dialog With Template Close', res);
      this.form.reset();
    });
  }

}
