import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeViewComponent } from './views/home-view/home-view.component';
import { LoginComponent } from './views/login/login.component';

import { PersonViewComponent } from './views/person-view/person-view.component';
import { CareersViewComponent } from './views/careers-view/careers-view.component';
import { FacultyViewComponent } from './views/faculty-view/faculty-view.component';
import { UniversitiesViewComponent } from './views/universities-view/universities-view.component';
import { CampusViewComponent } from './views/campus-view/campus-view.component';
import { ProgramViewComponent } from './views/program-view/program-view.component';
import { AuthGuard } from './guard/auth.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', component: PersonViewComponent, canActivate: [AuthGuard]  },
  { path: 'careers', component: CareersViewComponent, canActivate: [AuthGuard]  },
  { path: 'faculty', component: FacultyViewComponent, canActivate: [AuthGuard] },
  { path: 'universities', component: UniversitiesViewComponent, canActivate: [AuthGuard]  },
  { path: 'campus', component: CampusViewComponent, canActivate: [AuthGuard]  },
  { path: 'program', component: ProgramViewComponent, canActivate: [AuthGuard]  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
