import { Component, ElementRef, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { Observable, catchError, map, of, startWith } from 'rxjs';
import { ModalComponent } from 'src/app/components/modal/modal.component';
import { TABLE_ACTION } from 'src/app/enums/table-action-enum';
import { TableAction } from 'src/app/interface/ITable-action';
import { TableColumn } from 'src/app/interface/ITable-colum';
import { TableConfig } from 'src/app/interface/ITable-config';
import { ICareers } from 'src/app/interface/ICareers';
import { ModalService } from 'src/app/service/modal.service';
import { StudiesService } from 'src/app/service/studies.service';
import { IUniversity } from 'src/app/interface/IUniversity';
import { IFaculty } from 'src/app/interface/IFaculty';
import { ICampus } from 'src/app/interface/ICampus';
import { IProgram } from 'src/app/interface/IProgram';
import { NgZone } from '@angular/core';

@Component({
  selector: 'app-careers-view',
  templateUrl: './careers-view.component.html',
  styleUrls: ['./careers-view.component.scss']
})
export class CareersViewComponent {  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('AddEditCarrera', {static: true}) AddEditCarrera!: TemplateRef<any>  
  dataSource: Array<ICareers> = [];;
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
  university!: ICareers;
  form: FormGroup;
  loading:boolean = false;
  loadingProgressBar:boolean = true;
  operation:string = '';
  idCareers?:number ;
  
  listCampus: ICampus[] = [];
  listFaculty: IFaculty[] = [];
  listUniversity: IUniversity[] = [];
  listProgram: IProgram[] = [];
  myControlUniversity = new FormControl;
  myControlFaculty = new FormControl;
  myControlProgram = new FormControl;
  myControlCampus = new FormControl;
  filteredUniversity!: Observable<IUniversity[]>;
  filteredFaculty!: Observable<IFaculty[]>;
  filteredProgram!: Observable<IProgram[]>;
  filteredCampus!: Observable<ICampus[]>;
  modalOpen = false;

  
  


  constructor(
    private studiesService: StudiesService,
    private modalService: ModalService, 
    private ngZone: NgZone,   
    private fb : FormBuilder,) {      
      this.form= this.fb.group({        
        myControlUniversity:[Validators.required],
        facultad:[Validators.required],
        program:[Validators.required],
        campus:[Validators.required]
      }) 
      this.filteredUniversity = this.myControlUniversity.valueChanges.pipe(
        startWith(''),
        map((value) => this._filter(value, this.listUniversity))
      );
  
      this.filteredFaculty = this.myControlFaculty.valueChanges.pipe(
        startWith(''),
        map((value) => this._filter(value, this.listFaculty))
      );
  
      this.filteredProgram = this.myControlProgram.valueChanges.pipe(
        startWith(''),
        map((value) => this._filter(value, this.listProgram))
      );
  
      this.filteredCampus = this.myControlCampus.valueChanges.pipe(
        startWith(''),
        map((value) => this._filter(value, this.listCampus))
      );    
      
     }

  
  ngOnInit(): void {
    this.setTableColumns();
    this.getCareers();
    this.getUniversity()
    this.getCampus();
    this.getProgram();
    this.getFaculty();
    console.log('Formulario:', this.form.value);
    
    

  }

  getCareers(){
    this.studiesService.getCareers().subscribe((carereras) => {
      this.loadingProgressBar = false;
      this.dataSource = carereras;
      
    });
  }
  getUniversity(){
    this.studiesService.getUniversity().subscribe((university) => {      
      this.listUniversity = university;          
    });
  }

  getFaculty(){
    this.studiesService.getFaculty().subscribe((faculty) => {      
      this.listFaculty = faculty;        
    });
  }

  getProgram(){
    this.studiesService.getProgram().subscribe((program) => {      
      this.listProgram = program;          
    });
  }

  getCampus(){
    this.studiesService.getCampus().subscribe((campus) => {      
      this.listCampus = campus;         
    });
  }

  setTableColumns() {
    this.tableColumns = [       
      { label: 'Programa', def: 'facultad', dataKey: 'facultad' },
      { label: 'Facultad', def: 'carrera', dataKey: 'carrera' },
      { label: 'Universidad', def: 'universidad', dataKey: 'universidad' },
      { label: 'Campus', def: 'campus', dataKey: 'campus' },
     
    ];
  }

  onTableAction(tableAction: TableAction) {
    switch (tableAction.action) {

      case TABLE_ACTION.ADD:
        this.onAdd(this.AddEditCarrera);
        break;     

      case TABLE_ACTION.EDIT:
        this.onEdit(tableAction.row, this.AddEditCarrera);
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
    this.idCareers = undefined;
      
  } 

  onEdit(carrera: ICareers, template: TemplateRef<any>) {  
    this.idCareers = carrera.id;  
    this.operation = 'Editar ' 
    this.openModalTemplate(template);
    this.form.patchValue({
      id: carrera.id, 
      myControlUniversity: carrera.universidad,        
      myControlProgram: carrera.carrera ,
      myControlFaculty: carrera.facultad,
      myControlCampus: carrera.campus,
    });
  
    // Además, necesitas asegurarte de que los observables de filtro se activen con los valores preseleccionados
    this.myControlUniversity.setValue(carrera.universidad);
    this.myControlFaculty.setValue(carrera.facultad);
    this.myControlProgram.setValue(carrera.carrera);
    this.myControlCampus.setValue(carrera.campus);
  
    console.log('carrera', carrera)  
        
  }

  onDelete(carrera: ICareers) {
    this.studiesService.deleteCareer(carrera.id)
    .pipe(
      catchError((error) => {        
        console.error('Error al eliminar la Carrera:', error);
        this.modalService.mensaje('No se puede eliminar la Carrera debido a restricciones de clave foránea.', 3);
        // Retorna un observable vacío para que la suscripción no falle
        return of();
      })
    )   
    .subscribe(()=> {      
      this.modalService.mensaje('Carrera eliminada con Exito!', 2);
      setTimeout(() => {window.location.reload();}, 4000)
    });
  }
  addEditCarreras() { 
    console.log('id carrera',this.idCareers)

    // Buscar la item por el nombre en la lista
    const university = this.listUniversity.find(item => item.nombre === this.myControlUniversity.value);
    const faculty = this.listFaculty.find(item => item.nombre === this.myControlFaculty.value);
    const program = this.listProgram.find(item => item.nombre === this.myControlProgram.value);
    const campus = this.listCampus.find(item => item.nombre === this.myControlCampus.value);

    const carrera: any  = {
      id: this.idCareers,
      carrera: program?.id, 
      facultad: faculty?.id,
      universidad: university?.id,
      campus: campus?.id       
    };    
    
    this.loading = true;

    if(carrera.id == undefined){   
      console.log('mostrar carrera',carrera)
      //Es agregar
      this.studiesService.postCareers(carrera).subscribe(()=>{  
        this.modalService.mensaje('Nueva Carrera agregada con Exito !', 2);       
      })
    }else {
      // es Editar
      this.studiesService.updateCareer(this.idCareers, carrera).subscribe(data => {        
        this.modalService.mensaje('Carrera editada con Exito !', 2);
      })
    }
    this.loading = false;
    this.matDialogRef.close(true);
    

  }

  openModalTemplate(template: TemplateRef<any>) {
    this.matDialogRef = this.modalService.openModal({template, width:'800px'});
    this.matDialogRef.afterClosed().subscribe((res) => {
      setTimeout(() => {window.location.reload();}, 4000)
      this.form.reset();
    });
  }
  
  
  

   // Función para filtrar la lista de elementos basándose en la entrada del usuario
   private _filter(value: string, items: any[]): any[] {
    const filterValue = value.toLowerCase();
     
    
  
    return  items.filter((item) => item.nombre && item.nombre.toLowerCase().includes(filterValue));;
  }

  
  
}
  


