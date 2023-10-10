import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from './shared/material/material.module';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


import { HomeViewComponent } from './views/home-view/home-view.component';
import { TablePersonsComponent } from './components/table-persons/table-persons.component';
import { TableComponent } from './components/table/table.component';
import { PersonViewComponent } from './views/person-view/person-view.component';
import { ColumnValuePipe } from 'src/app/pipe/column-value.pipe';
import { HeaderComponent } from './components/header/header.component';
import { ModalComponent } from './components/modal/modal.component';
import { UniversitiesViewComponent } from './views/universities-view/universities-view.component';
import { FacultyViewComponent } from './views/faculty-view/faculty-view.component';
import { CampusViewComponent } from './views/campus-view/campus-view.component';
import { ProgramViewComponent } from './views/program-view/program-view.component';
import { CareersViewComponent } from './views/careers-view/careers-view.component';

import { LoginComponent } from './views/login/login.component';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons'; 


library.add(fas); // Agrega los iconos sólidos a la biblioteca
@NgModule({
  declarations: [
    AppComponent,
    HomeViewComponent,
    TablePersonsComponent,
    LoginComponent,
    TableComponent,
    PersonViewComponent,
    ColumnValuePipe,
    HeaderComponent,    
    ModalComponent, 
    UniversitiesViewComponent, 
    FacultyViewComponent, 
    CampusViewComponent, 
    ProgramViewComponent, 
    CareersViewComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MaterialModule,
    HttpClientModule,
    BrowserAnimationsModule,

    FormsModule,
    FontAwesomeModule, 
    ReactiveFormsModule
    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
