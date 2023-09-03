import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { IPerson } from 'src/app/interface/IPerson';
import { PersonsService } from 'src/app/service/persons.service';

@Component({
  selector: 'app-table-persons',
  templateUrl: './table-persons.component.html',
  styleUrls: ['./table-persons.component.scss'],
})
export class TablePersonsComponent implements OnInit {
  constructor(private personService: PersonsService) {}
  dataPersons: IPerson[] = [];
  displayedColumns: string[] = [
    'id',
    'fistName',
    'lastName',
    'email',
    'age',
    'sex',
    'actions',
  ];
  dataSource :any

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  ngOnInit(): void {
    this.personService.getPersons().subscribe((data) => {
      this.dataPersons = data;
      this.dataSource = new MatTableDataSource(this.dataPersons);
    });
    
  }
}
