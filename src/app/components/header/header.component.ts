import { Component, OnInit } from '@angular/core';
import { IRoutes } from 'src/app/interface/IRoutes';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit{
  selected!: string|null
  constructor(){}
  ngOnInit(): void {
    this.selected = localStorage.getItem('route')
  }
  routes: any[] = [
    {
      name: 'Personas',
      link: '',
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
      name: 'Facultades',
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
 select(name:string){
  localStorage.setItem('route', name)
  this.selected = localStorage.getItem('route')
  
 }
}
