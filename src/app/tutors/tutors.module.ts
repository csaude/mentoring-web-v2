import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TutorsComponent } from './tutors.component';
import { TutorsService } from './shared/tutor.service';
import { DatePipe } from '@angular/common';
import { TranslateModule } from "ng2-translate";

/* Angular Material */
import {MatTableModule} from '@angular/material/table';
import {MatSortModule} from '@angular/material/sort';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatDialogModule} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatMenuModule} from '@angular/material/menu';
import {MatIconModule} from '@angular/material/icon';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatListModule} from '@angular/material/list';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatCardModule} from '@angular/material/card';
import {MatSelectModule} from '@angular/material/select';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material';

/*Dialogs*/
import {DialogEdit } from './tutors.component';
import {DialogPAEdit } from './tutors.component';
import {DialogAdd } from './tutors.component';
import { DialogLocationEdit } from './tutors.component';

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    RouterModule,

    TranslateModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatDialogModule,
    MatButtonModule,
    MatCheckboxModule,
    MatMenuModule,
    MatIconModule,
    MatTooltipModule,
    MatSidenavModule,
    MatListModule,
    MatFormFieldModule,
    MatInputModule,
    MatGridListModule,
    MatSnackBarModule,
    MatCardModule,
    MatSelectModule,
    MatToolbarModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  declarations: [
    TutorsComponent,
    DialogEdit,
    DialogPAEdit,
    DialogAdd,
    DialogLocationEdit
  ],
  exports: [
    TutorsComponent
  ],
  providers: [
    TutorsService,
    DatePipe
  ],
  entryComponents:[
    DialogEdit,
    DialogPAEdit,
    DialogAdd,
    DialogLocationEdit
  ]
})

/**
* @author damasceno.lopes
*/
export class TutorsModule { }
