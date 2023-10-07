import { Component } from '@angular/core';
import { IRoutes } from 'src/app/interface/IRoutes';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  routes: any[] = [
    {
      name: 'Personas',
      link: 'home',
    },
    {
      name: 'Carreras',
      link: 'careers',
    },
    {
      name: 'Universidades',
      link: 'universities',
    },
    {
      name: 'Facultad',
      link: 'faculty',
    },
    {
      name: 'Campus',
      link: 'campus',
    },
    {
      name: 'Programas',
      link: 'program',
    }
  ];

}
