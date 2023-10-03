import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { IModalTemplateData } from '../interface/IModalTemplate';
import { ModalComponent } from '../components/modal/modal.component';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  constructor(public modal: MatDialog) { }  

  openModal(data: IModalTemplateData) {
    return this.modal.open(ModalComponent,{ data });    
  }
}
