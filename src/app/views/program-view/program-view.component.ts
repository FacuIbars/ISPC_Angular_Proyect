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
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
@Component({
  selector: 'app-program-view',
  templateUrl: './program-view.component.html',
  styleUrls: ['./program-view.component.scss']
})
export class ProgramViewComponent  {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('AddEditPrograma', { static: true }) AddEditPrograma!: TemplateRef<any>
  dataSource: Array<IProgram> = [];;
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
  program!: IProgram;
  form: FormGroup;
  loading:boolean = false;
  operation:string = '';
  idPrograma?:number ;

  constructor(
    private studiesService: StudiesService,
    private modalService: ModalService,
    private fb : FormBuilder,) {
      this.form= this.fb.group({        
        programa:['',[Validators.required,Validators.minLength(3),Validators.maxLength(100)]],
      })      
      
     }

  
     ngOnInit(): void {
      this.setTableColumns();
      this.getProgram();
      
  
    }

    getProgram(){
      this.studiesService.getProgram().subscribe((program) => {
        console.log('esto es el mock: ', program);
        // Configura los datos en la fuente de datos MatTableDataSource
        this.dataSource = program;
        
      });
    }
  setTableColumns() {
    this.tableColumns = [
      { label: 'Programa', def: 'nombre', dataKey: 'nombre' },

    ];
  }

  onTableAction(tableAction: TableAction) {
    switch (tableAction.action) {

      case TABLE_ACTION.ADD:
        this.onAdd(this.AddEditPrograma);
        break;  

      case TABLE_ACTION.EDIT:
        this.onEdit(tableAction.row, this.AddEditPrograma);
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
    this.idPrograma = undefined;
      
  } 

  onEdit(program: IProgram, template: TemplateRef<any>) {  
    this.idPrograma = program.id;  
    this.operation = 'Editar ' 
    this.openModalTemplate(template);
    this.form.patchValue({
      id:program.id,
      programa:program.nombre,      
    });     
  }
  onDelete(program: IProgram) {
    this.studiesService.deleteProgram(program.id)
    .pipe(
      catchError((error) => {        
        console.error('Error al eliminar el programa:', error);
        this.modalService.mensaje('No se puede eliminar el programa debido a restricciones de clave foránea.', 3);
        // Retorna un observable vacío para que la suscripción no falle
        return of();
      })
    )   
    .subscribe(()=> {      
      this.modalService.mensaje('Programa eliminado con Exito!', 2);
      setTimeout(() => {window.location.reload();}, 4000)
    });
  }

  addEditProgram() { 
    console.log('id programa',this.idPrograma)
    const programa:IProgram  = {
      id:this.idPrograma,
      nombre: this.form.get('programa')?.value,      
    };
    console.log('id programa',programa)
    
    this.loading = true;

    if(programa.id == undefined){      
      //Es agregar
      this.studiesService.postProgram(programa).subscribe(()=>{  
        this.modalService.mensaje('Nuevo Programa agregado con Exito !', 2);       
      })
    }else {
      // es Editar
      this.studiesService.updateProgram(this.idPrograma, programa).subscribe(data => {        
        this.modalService.mensaje('Programa editado con Exito !', 2);
      })
    }
    this.loading = false;
    this.matDialogRef.close(true);
    this.getProgram();

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
