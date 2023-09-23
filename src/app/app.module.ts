import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeViewComponent } from './views/home-view/home-view.component';
import { MaterialModule } from './shared/material/material.module';
import { TablePersonsComponent } from './components/table-persons/table-persons.component';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { LoginComponent } from './login/login.component';
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
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MaterialModule,
    HttpClientModule,
    BrowserAnimationsModule,

    FormsModule,
    FontAwesomeModule, 
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
