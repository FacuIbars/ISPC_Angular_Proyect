import { AfterViewInit, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import {MatTabsModule} from '@angular/material/tabs';
import { Observable, catchError, map, of, startWith } from 'rxjs';
import { ModalComponent } from 'src/app/components/modal/modal.component';
import { TABLE_ACTION } from 'src/app/enums/table-action-enum';
import { IPerson } from 'src/app/interface/IPerson';
import { IPersonTitulaciones } from 'src/app/interface/IPersonTitulaciones';
import { TableAction } from 'src/app/interface/ITable-action';
import { TableColumn } from 'src/app/interface/ITable-colum';
import { TableConfig } from 'src/app/interface/ITable-config';
import { ModalService } from 'src/app/service/modal.service';
import { PersonsService } from 'src/app/service/persons.service';
import {MatDividerModule} from '@angular/material/divider';
import {MatListModule} from '@angular/material/list';
import { IGenders } from 'src/app/interface/IGenders';
@Component({
  selector: 'app-person-view',
  templateUrl: './person-view.component.html',
  styleUrls: ['./person-view.component.scss'],
 
})
export class PersonViewComponent implements  OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('vistaInfo', {static: true}) vistaInfo!: TemplateRef<any>
  @ViewChild('AddEditPersona', {static: true}) AddEditPersona!: TemplateRef<any>  
  dataSource: Array<IPerson> = [];;
  tableColumns: TableColumn[] = [];  
  tableConfig: TableConfig = {
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
  loading:boolean = false;
  loadingProgressBar:boolean = true;
  alumnos! : IPersonTitulaciones[];
  profesores! : IPersonTitulaciones[];
  operation:string = '';
  idPersona?:number ;
  // ------- Select--------------------------
  listGenders: IGenders[] = [];
  myControlGenders = new FormControl;
  filteredGenders!: Observable<IGenders[]>;

  date = new FormControl(new Date());
  serializedDate = new FormControl(new Date().toISOString());

    constructor(
      private personsService: PersonsService,
      private modalService: ModalService,
      private fb : FormBuilder,) {
        this.form= this.fb.group({        
          nombre:['',[Validators.required,Validators.minLength(5),Validators.maxLength(100)]],
          apellido:['',[Validators.required,Validators.minLength(5),Validators.maxLength(100)]],
          sobre_mi:['',[Validators.required,Validators.minLength(10),Validators.maxLength(2500)]],
          correo:['',[Validators.required,Validators.email ,Validators.minLength(4),Validators.maxLength(100)]],
          documento:['',[Validators.required,Validators.pattern("^[0-9]*$"),Validators.minLength(11),Validators.maxLength(11)]],
          linkedin:['',[Validators.required,Validators.minLength(5),]],
          github:['',[Validators.required,Validators.minLength(5),Validators.maxLength(200)]]
        }) 

        this.filteredGenders = this.myControlGenders.valueChanges.pipe(
          startWith(''),
          map((value) => this._filter(value, this.listGenders))
        );
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

  getPersonsTitulaciones(){
    this.personsService.getPersonTitulaciones().subscribe((persons) => {
      console.log('personas titulaciones: ', persons);
      this.loadingProgressBar = false;
      //this.dataSource = persons;
      
    });
  }

  setTableColumns() {
    this.tableColumns = [
      
      { label: 'Nombre', def: 'nombre', dataKey: 'nombre' },
      { label: 'Apellido', def: 'apellido', dataKey: 'apellido' },     
      { label: 'Correo', def: 'email', dataKey: 'email' },
      //{ label: 'Edad', def: 'birthdate', dataKey: 'birthdate' },
      { label: 'Género', def: 'genero', dataKey: 'genero' },
      { label: 'DNI', def: 'personal_id', dataKey: 'personal_id' },
      
    ];
  }

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
    this.person = person ;
    this.openModalTemplate(template);
    console.log('Ver ', person);
  }

  onAdd(template: TemplateRef<any>){
    this.operation = 'Agregar nueva '
    this.openModalTemplate(template);       
    this.idPersona = undefined;
      
  } 

  onEdit(person: IPerson, template: TemplateRef<any>) {
    this.idPersona = person.id;  
    this.operation = 'Editar '; 
    this.openModalTemplate(template);
    this.form.patchValue({
      id:person.id,      
      genero: person.genero,
      lugar: person.lugar,
      nombre: person.id,
      apellido: person.apellido,
      email: person.email,
      birthdate: person.birthdate,
      personal_id: person.personal_id
    });
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
    const person:IPerson  = {
      id:this.idPersona,      
      genero: this.form.get('nombre')?.value,
      lugar: this.form.get('nombre')?.value,
      nombre: this.form.get('nombre')?.value,
      apellido: this.form.get('apellido')?.value,
      email: this.form.get('correo')?.value,
      birthdate: this.form.get('nombre')?.value,
      personal_id: this.form.get('nombre')?.value,      
    };
    
    
    this.loading = true;

    if(person.id == undefined){      
      //Es agregar
      this.personsService.postPersons(person).subscribe(()=>{  
        this.modalService.mensaje('Nueva Persona agregada con Exito !', 2);       
      })
    }else {
      // es Editar
      this.personsService.updatePerson(this.idPersona, person).subscribe(data => {        
        this.modalService.mensaje('Universidad editada con Exito !', 2);
      })
    }
    this.loading = false;
    this.matDialogRef.close(true);    

  }

  openModalTemplate(template: TemplateRef<any>) {
    this.matDialogRef = this.modalService.openModal({template, width:'900px'} );

    this.matDialogRef.afterClosed().subscribe((res) => {
      setTimeout(() => {window.location.reload();}, 4000)
      this.form.reset();
    });
  }

  validateInput(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    inputElement.value = inputElement.value.replace(/[^0-9]/g, ''); // Elimina caracteres no numéricos
  }

   // Función para filtrar la lista de elementos basándose en la entrada del usuario
   private _filter(value: string, items: any[]): any[] {
    const filterValue = value.toLowerCase();       
  
    return  items.filter((item) => item.nombre && item.nombre.toLowerCase().includes(filterValue));;
  }

}

