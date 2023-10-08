import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon'; 
import {MatButtonModule} from '@angular/material/button'; 
import { FlexLayoutModule } from '@angular/flex-layout';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatToolbarModule} from '@angular/material/toolbar';
import { MatDialogModule } from '@angular/material/dialog';
import {MatSnackBarModule} from '@angular/material/snack-bar'; 

const components = [
  MatTableModule,
  MatFormFieldModule, 
  MatInputModule,
  MatTabsModule,
  MatFormFieldModule,
  MatPaginatorModule,
  MatIconModule,
  MatButtonModule,
  FlexLayoutModule,
  MatTooltipModule,
  MatToolbarModule,
  MatDialogModule,
  MatSnackBarModule
];
@NgModule({
  declarations: [],
  imports: [CommonModule, components],
  exports: [components],
})
export class MaterialModule {}
