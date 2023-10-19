import { AfterViewInit, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators,  } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import {MatTabsModule} from '@angular/material/tabs';
import { Observable, catchError, map, of, startWith, switchMap } from 'rxjs';
import { ModalComponent } from 'src/app/components/modal/modal.component';
import { TABLE_ACTION } from 'src/app/enums/table-action-enum';
import { IPerson, IPersonAddEdit } from 'src/app/interface/IPerson';
import { IPersonTitulaciones, IPersonTitulacionesAddEdit } from 'src/app/interface/IPersonTitulaciones';
import { TableAction } from 'src/app/interface/ITable-action';
import { TableColumn } from 'src/app/interface/ITable-colum';
import { TableConfig } from 'src/app/interface/ITable-config';
import { ModalService } from 'src/app/service/modal.service';
import { PersonsService } from 'src/app/service/persons.service';
import {MatDividerModule} from '@angular/material/divider';
import {MatListModule} from '@angular/material/list';
import { IGenders } from 'src/app/interface/IGenders';
import { GendersService } from 'src/app/service/genders.service';
import { ICountry } from 'src/app/interface/ICountry';
import { IProvince } from 'src/app/interface/IProvince';
import { ICity } from 'src/app/interface/ICity';
import { INeighborhood } from 'src/app/interface/INeighborhood';
import { LugarService } from 'src/app/service/lugar.service';
import { IPlace } from 'src/app/interface/IPlace';
import { formatDate } from '@angular/common';
import { ICampus } from 'src/app/interface/ICampus';
import { IFaculty } from 'src/app/interface/IFaculty';
import { IUniversity } from 'src/app/interface/IUniversity';
import { IProgram } from 'src/app/interface/IProgram';
import { StudiesService } from 'src/app/service/studies.service';
import { IOption } from 'src/app/interface/IOptions';
@Component({
  selector: 'app-person-view',
  templateUrl: './person-view.component.html',
  styleUrls: ['./person-view.component.scss'],

})
export class PersonViewComponent implements OnInit {
 
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('vistaInfo', {static: true}) vistaInfo!: TemplateRef<any>;
  @ViewChild('vistaInfoPT', {static: true}) vistaInfoPT!: TemplateRef<any>;
  @ViewChild('AddEditPersona', {static: true}) AddEditPersona!: TemplateRef<any>; 
  @ViewChild('AddEditPersonaTitulaciones', {static: true}) AddEditPersonaTitulaciones!: TemplateRef<any>;

  dataSource: Array<IPerson> = [];
  dataSourceAlumnos: Array<IPersonTitulaciones> = [];
  dataSourceProfesores: Array<IPersonTitulaciones> = [];
  
  tableColumns: TableColumn[] = [];
  tableColumnsAlumnos: TableColumn[] = [];
  tableColumnsProfesores: TableColumn[] = [];
  tableConfig: TableConfig = {
    isPaginable: true,
    showFilter: true,
    showAddButton: true,
    showActions: true,
    showSeeButton: true,
    showEditButton: true,
    showDeleteButton: true,
  };
  tableConfigAlumnos: TableConfig = {
    isPaginable: true,
    showFilter: true,
    showAddButton: true,
    showActions: true,
    showSeeButton: true,
    showEditButton: true,
    showDeleteButton: true,
  };
  tableConfigProfesores: TableConfig = {
    isPaginable: true,
    showFilter: true,
    showAddButton: true,
    showActions: true,
    showSeeButton: true,
    showEditButton: true,
    showDeleteButton: true,
  };
  private matDialogRef!: MatDialogRef<ModalComponent>;
  person!: IPerson
  personaTitulacion!:IPersonTitulaciones 
  form: FormGroup;
  firstFormGroup!: FormGroup;
  secondFormGroup!: FormGroup; 
  loading:boolean = false;
  loadingProgressBar:boolean = true;
  alumnos! : IPersonTitulaciones[];
  profesores! : IPersonTitulaciones[];
  operation:string = ' Alumno';  
  idPersona?:number ;
  idLugar?:number ;
  idTitulacion?:number;
  idPersonaTitulacion?:number;
  tipoPT?:number;
  selectTipo:boolean = true;
  nombreTipoPT: string = ''


  // ------- Select--------------------------
  tipoPersona: IOption[] = [
    {id: 2, nombre: 'Alumno'},
    {id: 1, nombre: 'Profesor'},    
  ];

  listGenders: IGenders[] = [];
  myControlGenders = new FormControl;  
  myControlGendersPT = new FormControl;
  myControlTipo = new FormControl;
  filteredGenders!: Observable<IGenders[]>;
  filteredGendersPT!: Observable<IGenders[]>;
  listCountry: ICountry[] = [];
  myControlCountry = new FormControl;
  myControlCountryPT = new FormControl;
  filteredCountry!: Observable<ICountry[]>
  filteredCountryPT!: Observable<ICountry[]>
  listProvince: IProvince[] = [];
  myControlProvince = new FormControl;
  myControlProvincePT = new FormControl;
  filteredProvince!: Observable<IProvince[]>;
  filteredProvincePT!: Observable<IProvince[]>;
  listCity: ICity[] = [];
  myControlCity = new FormControl;
  myControlCityPT = new FormControl;
  filteredCity!: Observable<ICity[]>;
  filteredCityPT!: Observable<ICity[]>;
  listNeighborhood: INeighborhood[] = [];  
  myControlNeighborhood = new FormControl;
  myControlNeighborhoodPT = new FormControl;
  filteredNeighborhood!: Observable<INeighborhood[]>; 
  filteredNeighborhoodPT!: Observable<INeighborhood[]>; 
  listCampus: ICampus[] = [];
  listFaculty: IFaculty[] = [];
  listUniversity: IUniversity[] = [];
  listProgram: IProgram[] = [];
  myControlUniversityPT = new FormControl;
  myControlFacultyPT = new FormControl;
  myControlProgramPT = new FormControl;
  myControlCampusPT = new FormControl;
  filteredUniversity!: Observable<IUniversity[]>;
  filteredFaculty!: Observable<IFaculty[]>;
  filteredProgram!: Observable<IProgram[]>;
  filteredCampus!: Observable<ICampus[]>;

  date = new FormControl(new Date());
  serializedDate = new FormControl(new Date().toISOString());

    constructor(
      private studiesService: StudiesService,
      private personsService: PersonsService,
      private modalService: ModalService,
      private genderService: GendersService,
      private lugarService: LugarService,
      private fb : FormBuilder,) {
        this.form= this.fb.group({        
          nombre:['',[Validators.required,]],
          apellido:['',[Validators.required,]],
          correo:['',[Validators.required,Validators.email]],
          documento:['',[Validators.required]],
          birthdate:['', [Validators.required]]
        })
        this.firstFormGroup = this.fb.group({
          // Definir los controles del primer paso
          nombre:['',[Validators.required,]],
          apellido:['',[Validators.required,]],
          correo:['',[Validators.required,Validators.email]],
          documento:['',[Validators.required]],
          birthdate:['', [Validators.required]]
        });
        this.secondFormGroup = this.fb.group({
          // Definir los controles del segundo paso
        });     
        
        
        this.getGender();
        this.getCountry();
        this.getProvince();
        this.getCity();
        this.getNeighborhood();
        this.getUniversity();
        this.getFaculty();
        this.getProgram();
        this.getCampus();

       
      }     

  ngOnInit(): void {
    this.setTableColumns();
    this.getPersons();
    this.getPersonsTitulaciones();
    
   
    
  }

  IsAlumno (tipo: string): number {
    if (tipo === 'alumno'){
      this.tipoPT = 2;
      this.nombreTipoPT = 'Alumno';
    }else {
      this.tipoPT = 1;
      this.nombreTipoPT = 'Profesor';
    }
    return this.tipoPT;

  }
  
  getPersons(){
    this.personsService.getPersons().subscribe((persons) => {
      console.log('esto es el mock: ', persons);
      this.loadingProgressBar = false;      
      this.dataSource = persons;
    });
  }

  getCountry(){
    this.lugarService.getCountry().subscribe((country) => {      
      this.listCountry = country;   
      this.filteredCountry =  this.setupControlChanges(this.myControlCountry, this.listCountry); 
      this.filteredCountryPT =  this.setupControlChanges(this.myControlCountryPT, this.listCountry); 
    },
    (error) => {
      console.error('Error al obtener Pais:', error);              
    });
  }

  getProvince(){
    this.lugarService.getProvince().subscribe((province) => {      
      this.listProvince = province;
      this.filteredProvince = this.setupControlChanges(this.myControlProvince, this.listProvince);
      this.filteredProvincePT = this.setupControlChanges(this.myControlProvincePT, this.listProvince);
    },
    (error) => {
      console.error('Error al obtener provincias:', error);              
    });          
    
  }

  getCity(){
    this.lugarService.getCity().subscribe((city) => {      
      this.listCity = city; 
      this.filteredCity = this.setupControlChanges(this.myControlCity, this.listCity);
      this.filteredCityPT = this.setupControlChanges(this.myControlCityPT, this.listCity);
    },
    (error) => {
      console.error('Error al obtener ciudades:', error);              
    }); 
  }

  getNeighborhood(){
    this.lugarService.getNeighborhoody().subscribe((neighborhood) => {      
      this.listNeighborhood = neighborhood; 
      this.filteredNeighborhood = this.setupControlChanges(this.myControlNeighborhood, this.listNeighborhood);
      this.filteredNeighborhoodPT = this.setupControlChanges(this.myControlNeighborhoodPT, this.listNeighborhood);
    },
    (error) => {
      console.error('Error al obtener barrios:', error);              
    });          
    
  }

  getGender(){
    this.genderService.getGenders().subscribe((gender) => {  
      console.log(gender)    
      this.listGenders = gender;
      this.filteredGenders = this.setupControlChanges(this.myControlGenders, this.listGenders);
      this.filteredGendersPT = this.setupControlChanges(this.myControlGendersPT, this.listGenders);
    },
    (error) => {
      console.error('Error al obtener Generos:', error);              
    });           
    
  }

  getUniversity(){
    this.studiesService.getUniversity().subscribe((university) => {      
      this.listUniversity = university;
      this.filteredUniversity = this.setupControlChanges(this.myControlUniversityPT, this.listUniversity);
    },
    (error) => {
      console.error('Error al obtener universidades:', error);              
    });
  }

  getFaculty(){
    this.studiesService.getFaculty().subscribe((faculty) => {      
      this.listFaculty = faculty;
      this.filteredFaculty = this.setupControlChanges(this.myControlFacultyPT, this.listFaculty);
    },
    (error) => {
      console.error('Error al obtener facultades:', error);        
    });
  }

  getProgram(){
    this.studiesService.getProgram().subscribe((program) => {      
      this.listProgram = program;
      this.filteredProgram = this.setupControlChanges(this.myControlProgramPT, this.listProgram);
    },
    (error) => {
      console.error('Error al obtener programas:', error);          
    });
  }

  getCampus(){
    this.studiesService.getCampus().subscribe((campus) => {      
      this.listCampus = campus;
      this.filteredCampus = this.setupControlChanges(this.myControlCampusPT, this.listCampus);
    },
    (error) => {
      console.error('Error al obtener campus:', error);         
    });
  }

  getPersonsTitulaciones() {
    this.personsService.getPersonTitulaciones().subscribe((persons: IPersonTitulaciones[]) => {
      console.log('personas titulaciones: ', persons);
      this.loadingProgressBar = false;  
      this.dataSourceAlumnos = persons.filter(person => person.tipo === 'alumno');
      this.dataSourceProfesores = persons.filter(person => person.tipo === 'profesor');
      console.log('Alumnos ', this.dataSourceAlumnos);
      console.log('Profesores ', this.dataSourceProfesores);

    });
  }
  
  

  setTableColumns() { 
    this.tableColumns = [

      { label: 'Nombre', def: 'nombre', dataKey: 'nombre' },
      { label: 'Apellido', def: 'apellido', dataKey: 'apellido' },
      { label: 'Correo electronico', def: 'email', dataKey: 'email' },
      { label: 'DNI', def: 'personal_id', dataKey: 'personal_id' },
      
    ];

    this.tableColumnsAlumnos = [

      { label: 'Nombre', def: 'persona.nombre', dataKey: 'persona.nombre', dataType:'object' },
      { label: 'Apellido', def: 'apellido', dataKey: 'persona.apellido', dataType:'object' },
      { label: 'Correo electronico', def: 'email', dataKey: 'persona.email', dataType:'object' },
      { label: 'DNI', def: 'personal_id', dataKey: 'persona.personal_id', dataType:'object' },
      { label: 'Tipo', def: 'tipo', dataKey: 'tipo' }
      
    ];

    this.tableColumnsProfesores = [

      { label: 'Nombre', def: 'persona.nombre', dataKey: 'persona.nombre', dataType:'object' },
      { label: 'Apellido', def: 'apellido', dataKey: 'persona.apellido', dataType:'object' },
      { label: 'Correo electronico', def: 'email', dataKey: 'persona.email', dataType:'object' },
      { label: 'DNI', def: 'personal_id', dataKey: 'persona.personal_id', dataType:'object' },
      { label: 'Tipo', def: 'tipo', dataKey: 'tipo' }
      
    ];
  }
 
  // Acciones en Botones de Persona 
 
  onTableAction(tableAction: TableAction) {
    switch (tableAction.action) {

      case TABLE_ACTION.SEE:
        this.onSee(tableAction.row, this.vistaInfo);
        break;

      case TABLE_ACTION.ADD:
        this.onAdd(this.AddEditPersona);
        break;

      case TABLE_ACTION.EDIT:
        this.onEdit(tableAction.row, this.AddEditPersona);
        break;

      case TABLE_ACTION.DELETE:
        this.onDelete(tableAction.row);
        break;

      default:
        break;
    }
  }  

  onSee(person: IPerson, template: TemplateRef<any>) {
    this.person = person;
    this.openModalTemplate(template);
    console.log('Ver ', person);
  }

  onAdd(template: TemplateRef<any>){
    this.operation = 'Agregar nueva '
    this.myControlCity.reset();
    this.myControlCountry.reset();
    this.myControlProvince.reset();
    this.myControlNeighborhood.reset();
    this.myControlGenders.reset();
    this.openModalTemplate(template);       
    this.idPersona = undefined;
    this.idLugar = undefined;
      
  } 

  onEdit(person: IPerson, template: TemplateRef<any>) {
    console.log(person)
    this.idPersona = person.id;
    this.idLugar = person.lugar.id;  
    this.operation = 'Editar ';     
    this.myControlCity.setValue(this.listCity.find(item => item.nombre === person.lugar.ciudad));
    this.myControlCountry.setValue(this.listCountry.find(item => item.nombre === person.lugar.pais));
    this.myControlProvince.setValue(this.listProvince.find(item => item.nombre === person.lugar.provincia));
    this.myControlNeighborhood.setValue(this.listNeighborhood.find(item => item.nombre === person.lugar.barrio));
    this.myControlGenders.setValue(this.listGenders.find(item => item.nombre === person.genero)); 
    this.form.patchValue({
      id:person.id,        
      nombre: person.nombre,
      apellido: person.apellido,
      correo: person.email,
      birthdate: person.birthdate,
      documento: person.personal_id
    });
    this.openModalTemplate(template);
  }

  onDelete(person: IPerson) {
    this.personsService.deletePerson(person.id)
    .pipe(
      catchError((error) => {  
        this.modalService.mensaje('No se puede eliminar la persona debido a restricciones de clave foránea.', 3);
        
        return of();
      })
    )   
    .subscribe(()=> {      
      this.modalService.mensaje('Persona eliminada con Exito!', 2);
      setTimeout(() => {window.location.reload();}, 4000)
    });
  }

  addEditPerson() {  
    const lugar: IPlace = {  
      id: this.idLugar,    
      pais: this.myControlCountry.value.id,
      ciudad: this.myControlCity.value.id,
      barrio: this.myControlNeighborhood.value.id,
      provincia: this.myControlProvince.value.id
    };   
  
    const person: IPersonAddEdit  = {
      id: this.idPersona,      
      genero: this.myControlGenders.value.id,
      lugar: this.idLugar,
      nombre: this.form.get('nombre')?.value,
      apellido: this.form.get('apellido')?.value,
      email: this.form.get('correo')?.value,
      birthdate: formatDate(this.form.get('birthdate')?.value, 'yyyy-MM-dd', 'en-US'),
      personal_id: this.form.get('documento')?.value,      
    };    
      
    this.loading = true;
  
    if (person.id == undefined && lugar.id == undefined) {
      // Agregar lugar
      console.log('entro a agregar persona')
      this.lugarService.postPlace(lugar).pipe(
        switchMap((lugarnuevo) => {
          person.lugar = lugarnuevo.id;
          console.log('dsp de crear lugar',lugarnuevo)
          // Agregar Persona después de que el lugar se haya creado
          return this.personsService.postPersons(person);
          
        })
      ).subscribe(() => {        
        this.modalService.mensaje('Nueva Persona agregada con Exito !', 2);
        this.loading = false;
        this.matDialogRef.close(true); 
        setTimeout(() => {window.location.reload();}, 4000)
      }, error => {
        // Manejar errores aquí
        console.error(error);
        this.modalService.mensaje('No se puede crear persona revise consola para ver error.', 3);
        this.loading = false;
      });
    } else {
      // editar lugar
      console.log(' lugar id',this.idLugar)
      console.log(' lugar',lugar)
      this.lugarService.updatePlaceId(this.idLugar,lugar).pipe(
        switchMap((lugareditado) => {
          person.lugar = lugareditado.id;
          
           console.log('dsp de editar lugar',lugar)
          // Editar Persona después de que el lugar se haya editar
          return this.personsService.updatePerson(this.idPersona, person);
          
        })
      ).subscribe(() => {        
        this.modalService.mensaje('Persona editada con éxito !', 2);
        this.loading = false;
        this.matDialogRef.close(true);
        setTimeout(() => {window.location.reload();}, 4000) 
      }, error => {
        // Manejar errores aquí
        console.error(error);
        this.modalService.mensaje('No se puede editar persona revise consola para ver error.', 3);
        this.loading = false;
      }); 
    }
    
  }

  //-----------------------------------------------------------------------------

   // Acciones en Botones de Persona Titulaciones

  onTableActionTitulaciones(tableAction: TableAction) {
    switch (tableAction.action) {

      case TABLE_ACTION.SEE:
        this.onSeePTitulaciones(tableAction.row, this.vistaInfoPT);
        break;

      case TABLE_ACTION.ADD:
        this.onAddPTitulaciones(this.AddEditPersonaTitulaciones);
        break;

      case TABLE_ACTION.EDIT:
        this.onEditPTitulaciones(tableAction.row, this.AddEditPersonaTitulaciones);
        break;

      case TABLE_ACTION.DELETE:
        this.onDeletePTitulaciones(tableAction.row);
        break;

      default:
        break;
    }
  }

  
  onSeePTitulaciones(personaTitulacion: IPersonTitulaciones, template: TemplateRef<any>) {
    this.personaTitulacion = personaTitulacion;
    this.openModalTemplate(template);
    console.log('Ver ', personaTitulacion);
  }

  onAddPTitulaciones(template: TemplateRef<any>){
    
    this.operation = 'Agregar '
    this.myControlCityPT.reset();
    this.myControlCountryPT.reset();
    this.myControlProvincePT.reset();
    this.myControlNeighborhoodPT.reset();
    this.myControlGendersPT.reset();
    this.myControlUniversityPT.reset();
    this.myControlFacultyPT.reset();
    this.myControlCampusPT.reset();
    this.myControlProgramPT.reset();
    this.openModalTemplate(template);       
    this.idPersona = undefined;
    this.idLugar = undefined;
    this.idTitulacion = undefined;
    this.idPersonaTitulacion = undefined;
      
  } 

  onEditPTitulaciones(personT: IPersonTitulaciones, template: TemplateRef<any>) {
    
    this.IsAlumno(personT.tipo);
    this.idPersona = personT.persona.id;
    this.idLugar = personT.persona.lugar.id;
    if (personT.titulacion) {
      this.idTitulacion = personT.titulacion.id;
      this.myControlUniversityPT.setValue(this.listUniversity.find(item => item.nombre === personT.titulacion.universidad));
      this.myControlCampusPT.setValue(this.listCampus.find(item => item.nombre === personT.titulacion.campus));
      this.myControlFacultyPT.setValue(this.listFaculty.find(item => item.nombre === personT.titulacion.facultad));
      this.myControlProgramPT.setValue(this.listProgram.find(item => item.nombre === personT.titulacion.carrera)); 
    } else {
      this.idTitulacion = undefined;
    }    
    this.idPersonaTitulacion = personT.id;  
    this.operation = 'Editar ';     
    this.myControlCityPT.setValue(this.listCity.find(item => item.nombre === personT.persona.lugar.ciudad));
    this.myControlCountryPT.setValue(this.listCountry.find(item => item.nombre === personT.persona.lugar.pais));
    this.myControlProvincePT.setValue(this.listProvince.find(item => item.nombre === personT.persona.lugar.provincia));
    this.myControlNeighborhoodPT.setValue(this.listNeighborhood.find(item => item.nombre === personT.persona.lugar.barrio));
    this.myControlGendersPT.setValue(this.listGenders.find(item => item.nombre === personT.persona.genero)); 

    this.firstFormGroup.patchValue({
      id:personT.persona.id,        
      nombre: personT.persona.nombre,
      apellido: personT.persona.apellido,
      correo: personT.persona.email,
      birthdate: personT.persona.birthdate,
      documento: personT.persona.personal_id
    });
    this.openModalTemplate(template);
  }

  onDeletePTitulaciones(personaTitulacion: IPersonTitulaciones) {
    this.personsService.deletePersonTitulaciones(personaTitulacion.id)
    .pipe(
      catchError((error) => {  
        this.modalService.mensaje('No se puede eliminar la persona debido a restricciones de clave foránea.', 3);
        
        return of();
      })
    )   
    .subscribe(()=> {      
      this.modalService.mensaje('Persona eliminada con Exito!', 2);
      setTimeout(() => {window.location.reload();}, 4000)
    });
  }

  addEditPersonTitulacion() {    
    const lugar: IPlace = {  
      id: this.idLugar,    
      pais: this.myControlCountryPT.value.id,
      ciudad: this.myControlCityPT.value.id,
      barrio: this.myControlNeighborhoodPT.value.id,
      provincia: this.myControlProvincePT.value.id
    }; 
    
    const carrera: any  = {
      id: this.idTitulacion,
      carrera: this.myControlProgramPT.value.id, 
      facultad: this.myControlFacultyPT.value.id,
      universidad: this.myControlUniversityPT.value.id,
      campus: this.myControlCampusPT.value.id       
    };    
  
    const person: IPersonAddEdit  = {
      id: this.idPersona,      
      genero: this.myControlGendersPT.value.id,
      lugar: this.idLugar,
      nombre: this.firstFormGroup.get('nombre')?.value,
      apellido: this.firstFormGroup.get('apellido')?.value,
      email: this.firstFormGroup.get('correo')?.value,
      birthdate: formatDate(this.firstFormGroup.get('birthdate')?.value, 'yyyy-MM-dd', 'en-US'),
      personal_id: this.firstFormGroup.get('documento')?.value,      
    };  
    
    
    const personaTitulacion: any  = {
      id: this.idPersonaTitulacion,
      persona: person.id, 
      titulacion: carrera.id,
      tipo: this.tipoPT,
            
    };
      
    this.loading = true;
  
    if (personaTitulacion.id == undefined && person.id == undefined) {
      // Agregar lugar
    this.lugarService.postPlace(lugar).pipe(
      switchMap((lugarnuevo) => {
        person.lugar = lugarnuevo.id;
        // Agregar Persona después de que el lugar se haya creado
        return this.personsService.postPersons(person);
      }),
      switchMap((personNueva) => {
        // Agregar Carrera después de que la persona se haya creado
        console.log('persona nueva: ', personNueva)
        return this.studiesService.postCareers(carrera).pipe(
          switchMap((carreraNueva) => {
            personaTitulacion.persona = personNueva.id;
            personaTitulacion.titulacion = carreraNueva.id;
            // Agregar Titulación después de que la carrera se haya creado
            return this.personsService.postPersonTitulaciones(personaTitulacion);
          })
        );
      })
    ).subscribe(() => {        
      this.modalService.mensaje('Nueva Persona, Carrera y Titulación agregadas con Éxito!', 2);
      this.loading = false;
      this.matDialogRef.close(true); 
      setTimeout(() => {window.location.reload();}, 4000);
    }, error => {
      // Manejar errores aquí
      console.error(error);
      this.modalService.mensaje('No se puede crear persona, carrera o titulación, revise consola para ver error.', 3);
      this.loading = false;
    });
    } else {
      // editar lugar
      this.lugarService.updatePlaceId(this.idLugar, lugar).pipe(
        switchMap((lugareditado) => {
          person.lugar = lugareditado.id;
          // Editar persona después de que el lugar se haya editado
          return this.personsService.updatePerson(this.idPersona, person);
        }),
        switchMap((personeditada) => {
          if (carrera.id === null || carrera.id === undefined) {
            // El ID de carrera es nulo o indefinido, crea la carrera
            return this.studiesService.postCareers(carrera).pipe(
              switchMap((carreraNueva) => {
                personaTitulacion.titulacion = carreraNueva.id;
                // Edita persona titulación después de crear la carrera
                return this.personsService.updatePersonTitulaciones(this.idPersonaTitulacion, personaTitulacion);
              })
            );
          } else {
            // Edita carrera y persona titulación si la carrera existe
            return this.studiesService.updateCareer(this.idTitulacion, carrera).pipe(
              switchMap((carreraEditada) => {
                personaTitulacion.titulacion = carreraEditada.id;
                // Edita persona titulación después de editar la carrera
                return this.personsService.updatePersonTitulaciones(this.idPersonaTitulacion, personaTitulacion);
              })
            );
          }
        })
      ).subscribe(() => {
        this.modalService.mensaje('Persona, Carrera y Titulación editadas con Éxito!', 2);
        this.loading = false;
        this.matDialogRef.close(true);
        setTimeout(() => {
          window.location.reload();
        }, 4000);
      }, error => {
        console.error(error);
        this.modalService.mensaje('No se puede editar persona, carrera o titulación, revise la consola para ver el error.', 3);
        this.loading = false;
      });
    }  
    
  }

  //-----------------------------------------------------------------------------

  openModalTemplate(template: TemplateRef<any>) {
    this.matDialogRef = this.modalService.openModal({template, width:'900px'} );

    this.matDialogRef.afterClosed().subscribe((res) => {
     
      this.form.reset();
    });
  }

  validateInput(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    inputElement.value = inputElement.value.replace(/[^0-9]/g, ''); // Elimina caracteres no numéricos
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
    console.log('value :', value)   
    const filterValue = typeof value === 'string' ? value.toLowerCase() : '';

    return options.filter(option => {
      const optionName = option.nombre;
      return optionName && typeof optionName === 'string' && optionName.toLowerCase().includes(filterValue);
    });
  }

  isSelectionValid(): boolean {
    const cityValue = this.myControlCity.value;
    const countryValue = this.myControlCountry.value;
    const gendersValue = this.myControlGenders.value;
    const neighborhoodValue = this.myControlNeighborhood.value;
    const provinceValue = this.myControlProvince.value;
  
    // Verifica que todos los valores sean diferentes de null y no sean strings
    return this.isValidValue(cityValue) &&
           this.isValidValue(countryValue) &&
           this.isValidValue(gendersValue) &&
           this.isValidValue(neighborhoodValue) &&
           this.isValidValue(provinceValue);
  }

  isSelectionValidTitulacion(): boolean {
    const cityValue = this.myControlCityPT.value;
    const countryValue = this.myControlCountryPT.value;
    const gendersValue = this.myControlGendersPT.value;
    const neighborhoodValue = this.myControlNeighborhoodPT.value;
    const provinceValue = this.myControlProvincePT.value;
    const universityValue = this.myControlUniversityPT.value;
    const facultyValue = this.myControlFacultyPT.value;
    const programValue = this.myControlProgramPT.value;
    const campusValue = this.myControlCampusPT.value;
  
    // Verifica que todos los valores sean diferentes de null y no sean strings
    return this.isValidValue(cityValue) &&
           this.isValidValue(countryValue) &&
           this.isValidValue(gendersValue) &&
           this.isValidValue(neighborhoodValue) &&
           this.isValidValue(provinceValue) &&
           this.isValidValue(universityValue) &&
           this.isValidValue(facultyValue) &&
           this.isValidValue(programValue) &&
           this.isValidValue(campusValue);
  }
  
  private isValidValue(value: any): boolean {
    // Verifica que el valor no sea null ni string
    return value !== null && typeof value !== 'string';
  }

  

 
}

