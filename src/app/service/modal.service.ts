import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { IModalTemplateData } from '../interface/IModalTemplate';
import { ModalComponent } from '../components/modal/modal.component';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  

  constructor(
    public modal: MatDialog,
    private _snackBar: MatSnackBar) { }  

  openModal(data: IModalTemplateData) {
    return this.modal.open(ModalComponent,{ data });    
  }

  mensaje(mensaje: string, segundos: number): void {
    this._snackBar.open(mensaje, '',{
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      duration: segundos * 1000
    });
  }
}
