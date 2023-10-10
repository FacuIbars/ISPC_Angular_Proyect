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
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-universities-view',
  templateUrl: './universities-view.component.html',
  styleUrls: ['./universities-view.component.scss']
})
export class UniversitiesViewComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('AddEditUniversidad', {static: true}) AddEditUniversidad!: TemplateRef<any>  
  dataSource: Array<IUniversity> = [];;
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
  university!: IUniversity;
  form: FormGroup;
  loading:boolean = false;
  operation:string = '';
  idUniversidad?:number ;
  
  


  constructor(
    private studiesService: StudiesService,
    private modalService: ModalService,    
    private fb : FormBuilder,) {
      this.form= this.fb.group({        
        universidad:['',[Validators.required,Validators.minLength(3),Validators.maxLength(100)]],
      })      
      
     }

  
  ngOnInit(): void {
    this.setTableColumns();
    this.getUniversity();
    

  }

  getUniversity(){
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

      case TABLE_ACTION.ADD:
        this.onAdd(this.AddEditUniversidad);
        break;     

      case TABLE_ACTION.EDIT:
        this.onEdit(tableAction.row, this.AddEditUniversidad);
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
    this.idUniversidad = undefined;
      
  } 

  onEdit(university: IUniversity, template: TemplateRef<any>) {  
    this.idUniversidad = university.id;  
    this.operation = 'Editar ' 
    this.openModalTemplate(template);
    this.form.patchValue({
      id:university.id,
      universidad:university.nombre,      
    });     
  }

  onDelete(university: IUniversity) {
    this.studiesService.deleteUniversity(university.id)
    .pipe(
      catchError((error) => {        
        console.error('Error al eliminar la universidad:', error);
        this.modalService.mensaje('No se puede eliminar la universidad debido a restricciones de clave foránea.', 3);
        // Retorna un observable vacío para que la suscripción no falle
        return of();
      })
    )   
    .subscribe(()=> {      
      this.modalService.mensaje('Universidad eliminada con Exito!', 2);
      setTimeout(() => {window.location.reload();}, 4000)
    });
  }
  
  addEditUniversity() { 
    console.log('id unversidad',this.idUniversidad)
    const universidad:IUniversity  = {
      id:this.idUniversidad,
      nombre: this.form.get('universidad')?.value,      
    };
    console.log('id unversidad',universidad)
    
    this.loading = true;

    if(universidad.id == undefined){      
      //Es agregar
      this.studiesService.postUniversity(universidad).subscribe(()=>{  
        this.modalService.mensaje('Nueva Universidad agregada con Exito !', 2);       
      })
    }else {
      // es Editar
      this.studiesService.updateUniversity(this.idUniversidad, universidad).subscribe(data => {        
        this.modalService.mensaje('Universidad editada con Exito !', 2);
      })
    }
    this.loading = false;
    this.matDialogRef.close(true);    

  }

  openModalTemplate(template: TemplateRef<any>) {
    this.matDialogRef = this.modalService.openModal({template, width:'600px'} );

    this.matDialogRef.afterClosed().subscribe((res) => {
      setTimeout(() => {window.location.reload();}, 4000)
      this.form.reset();
    });
  }

}
