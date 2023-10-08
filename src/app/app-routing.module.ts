import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeViewComponent } from './views/home-view/home-view.component';
import { PersonViewComponent } from './views/person-view/person-view.component';
import { CareersViewComponent } from './views/careers-view/careers-view.component';
import { FacultyViewComponent } from './views/faculty-view/faculty-view.component';
import { UniversitiesViewComponent } from './views/universities-view/universities-view.component';
import { CampusViewComponent } from './views/campus-view/campus-view.component';
import { ProgramViewComponent } from './views/program-view/program-view.component';

const routes: Routes = [
  { path: '', component: PersonViewComponent,  },
  { path: 'careers', component: CareersViewComponent,  },
  { path: 'faculty', component: FacultyViewComponent,  },
  { path: 'universities', component: UniversitiesViewComponent,  },
  { path: 'campus', component: CampusViewComponent,  },
  { path: 'program', component: ProgramViewComponent,  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
