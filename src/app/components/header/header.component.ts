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
      name: 'La nada misma',
      link: '',
    }
  ];
}
