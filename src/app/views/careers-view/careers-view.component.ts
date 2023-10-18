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
        myControlUniversity:['',Validators.required],
        myControlFaculty: ['', Validators.required],
        myControlProgram: ['',Validators.required],
        myControlCampus: ['',Validators.required],
        
      }) 
        this.getUniversity();
        this.getFaculty();
        this.getProgram();
        this.getCampus();
        
       
    }

  
  ngOnInit(): void {
    this.setTableColumns();
    this.getCareers();
    
  }

  getCareers(){
    this.studiesService.getCareers().subscribe((carereras) => {      
      this.dataSource = carereras;
      this.loadingProgressBar = false;
      
    });
  }
  getUniversity(){
    this.studiesService.getUniversity().subscribe((university) => {      
      this.listUniversity = university;
      this.filteredUniversity = this.setupControlChanges(this.myControlUniversity, this.listUniversity);
    },
    (error) => {
      console.error('Error al obtener universidades:', error);              
    });
  }

  getFaculty(){
    this.studiesService.getFaculty().subscribe((faculty) => {      
      this.listFaculty = faculty;
      this.filteredFaculty = this.setupControlChanges(this.myControlFaculty, this.listFaculty);
    },
    (error) => {
      console.error('Error al obtener facultades:', error);        
    });
  }

  getProgram(){
    this.studiesService.getProgram().subscribe((program) => {      
      this.listProgram = program;
      this.filteredProgram = this.setupControlChanges(this.myControlProgram, this.listProgram);
    },
    (error) => {
      console.error('Error al obtener programas:', error);          
    });
  }

  getCampus(){
    this.studiesService.getCampus().subscribe((campus) => {      
      this.listCampus = campus;
      this.filteredCampus = this.setupControlChanges(this.myControlCampus, this.listCampus);
    },
    (error) => {
      console.error('Error al obtener campus:', error);         
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
    this.myControlUniversity.reset();
    this.myControlCampus.reset();
    this.myControlFaculty.reset();
    this.myControlProgram.reset();
    this.openModalTemplate(template);       
    this.idCareers = undefined;
      
  } 

  onEdit(carrera: ICareers, template: TemplateRef<any>) {  
    this.idCareers = carrera.id;  
    this.operation = 'Editar '; 
    this.myControlUniversity.setValue(this.listUniversity.find(item => item.nombre === carrera.universidad));
    this.myControlCampus.setValue(this.listCampus.find(item => item.nombre === carrera.campus));
    this.myControlFaculty.setValue(this.listFaculty.find(item => item.nombre === carrera.facultad));
    this.myControlProgram.setValue(this.listProgram.find(item => item.nombre === carrera.carrera)); 
    this.openModalTemplate(template); 

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

    const carrera: any  = {
      id: this.idCareers,
      carrera: this.myControlProgram.value.id, 
      facultad: this.myControlFaculty.value.id,
      universidad: this.myControlUniversity.value.id,
      campus: this.myControlCampus.value.id       
    };    
    
    this.loading = true;

    if(carrera.id == undefined){         
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
    setTimeout(() => {window.location.reload();}, 4000)

  }

  openModalTemplate(template: TemplateRef<any>) {
    this.matDialogRef = this.modalService.openModal({template, width:'600px'});
    this.matDialogRef.afterClosed().subscribe((res) => {
      
    });
  }
  

  displayFn(option: any): string {
    return option && option.nombre ? option.nombre : '';
  }  
  
  

  private setupControlChanges(control: FormControl, options: any[]): Observable<any> {
    return control.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value, options))
    );
  }

  private _filter(value: string | { id: number; nombre: string } | null, options: any[]): any[] {    
    const filterValue = typeof value === 'string' ? value.toLowerCase() : '';

    return options.filter(option => {
      const optionName = option.nombre;
      return optionName && typeof optionName === 'string' && optionName.toLowerCase().includes(filterValue);
    });
  }

  isSelectionValid(): boolean {
    const universityValue = this.myControlUniversity.value;
    const facultyValue = this.myControlFaculty.value;
    const programValue = this.myControlProgram.value;
    const campusValue = this.myControlCampus.value;
  
    // Verifica que todos los valores sean diferentes de null y no sean strings
    return this.isValidValue(universityValue) &&
           this.isValidValue(facultyValue) &&
           this.isValidValue(programValue) &&
           this.isValidValue(campusValue);
  }
  
  private isValidValue(value: any): boolean {
    // Verifica que el valor no sea null ni string
    return value !== null && typeof value !== 'string';
  }

  

  
  
}
  


