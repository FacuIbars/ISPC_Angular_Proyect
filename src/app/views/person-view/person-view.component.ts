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
import { IPersonTitulaciones } from 'src/app/interface/IPersonTitulaciones';
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
@Component({
  selector: 'app-person-view',
  templateUrl: './person-view.component.html',
  styleUrls: ['./person-view.component.scss'],

})
export class PersonViewComponent implements OnInit {
 
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('vistaInfo', {static: true}) vistaInfo!: TemplateRef<any>;
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
  form: FormGroup;
  firstFormGroup!: FormGroup;
  secondFormGroup!: FormGroup; 
  loading:boolean = false;
  loadingProgressBar:boolean = true;
  alumnos! : IPersonTitulaciones[];
  profesores! : IPersonTitulaciones[];
  operation:string = ' Alumno';
  tipoPersona:string = '';
  idPersona?:number ;
  idLugar?:number ;
  // ------- Select--------------------------
  listGenders: IGenders[] = [];
  myControlGenders = new FormControl;
  filteredGenders!: Observable<IGenders[]>;
  listCountry: ICountry[] = [];
  myControlCountry = new FormControl;
  filteredCountry!: Observable<ICountry[]>
  listProvince: IProvince[] = [];
  myControlProvince = new FormControl;
  filteredProvince!: Observable<IProvince[]>;
  listCity: ICity[] = [];
  myControlCity = new FormControl;
  filteredCity!: Observable<ICity[]>;
  listNeighborhood: INeighborhood[] = [];  
  myControlNeighborhood = new FormControl;
  filteredNeighborhood!: Observable<INeighborhood[]>; 
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

       
      }     

  ngOnInit(): void {
    this.setTableColumns();
    this.getPersons();
    this.getPersonsTitulaciones();
    
   
    
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
    },
    (error) => {
      console.error('Error al obtener Pais:', error);              
    });
  }

  getProvince(){
    this.lugarService.getProvince().subscribe((province) => {      
      this.listProvince = province;
      this.filteredProvince = this.setupControlChanges(this.myControlProvince, this.listProvince);
    },
    (error) => {
      console.error('Error al obtener provincias:', error);              
    });          
    
  }

  getCity(){
    this.lugarService.getCity().subscribe((city) => {      
      this.listCity = city; 
      this.filteredCity = this.setupControlChanges(this.myControlCity, this.listCity);
    },
    (error) => {
      console.error('Error al obtener ciudades:', error);              
    }); 
  }

  getNeighborhood(){
    this.lugarService.getNeighborhoody().subscribe((neighborhood) => {      
      this.listNeighborhood = neighborhood; 
      this.filteredNeighborhood = this.setupControlChanges(this.myControlNeighborhood, this.listNeighborhood);
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
    },
    (error) => {
      console.error('Error al obtener Generos:', error);              
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
        this.onSeePTitulaciones(tableAction.row, this.AddEditPersonaTitulaciones);
        break;

      case TABLE_ACTION.ADD:
        this.onAddonSeePTitulaciones(this.AddEditPersonaTitulaciones);
        break;

      case TABLE_ACTION.EDIT:
        this.onEditonSeePTitulaciones(tableAction.row, this.AddEditPersonaTitulaciones);
        break;

      case TABLE_ACTION.DELETE:
        this.onDeleteonSeePTitulaciones(tableAction.row);
        break;

      default:
        break;
    }
  }

  onSeePTitulaciones(person: IPerson, template: TemplateRef<any>) {
    this.person = person;
    this.openModalTemplate(template);
    console.log('Ver ', person);
  }

  onAddonSeePTitulaciones(template: TemplateRef<any>){
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

  onEditonSeePTitulaciones(person: IPerson, template: TemplateRef<any>) {
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

  onDeleteonSeePTitulaciones(person: IPerson) {
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
  
  private isValidValue(value: any): boolean {
    // Verifica que el valor no sea null ni string
    return value !== null && typeof value !== 'string';
  }

  

 
}

