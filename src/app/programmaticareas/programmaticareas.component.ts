import { Component, OnInit,Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator,MatDialog, MatDialogRef, MatSort , MatTableDataSource, MAT_DIALOG_DATA, PageEvent,MatSnackBar } from '@angular/material';
import { ProgrammaticAreasService } from "./shared/programmaticareas.service";
import { ProgrammaticArea } from "./shared/programmaticarea";
import {ExcelService} from '../resources/shared/excel.service';
import * as alasql from 'alasql';
import { TranslateService } from 'ng2-translate';

import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-programmaticareas',
  templateUrl: './programmaticareas.component.html',
  styleUrls: ['./programmaticareas.component.css']
})

/** 
* @author Damasceno Lopes <damascenolopess@gmail.com>
*/
export class ProgrammaticAreasComponent implements OnInit {
  public programmaticarea: ProgrammaticArea = new ProgrammaticArea();
  public isHidden: string;
  public programmaticareas;programmaticareas1: any[]=[];
  public ROLE_HIS;
  public form: FormGroup;
  public name: string;
  public code: string;
  public total: number;

  
  
  @ViewChild(MatPaginator,{static: false}) paginator: MatPaginator;
  @ViewChild(MatSort,{static: false}) sort: MatSort;

  public pageEvent: PageEvent;
  public displayedColumns: string[] = ['code','name','description','actions'];
     
  constructor(
    public excelService:ExcelService,
    public datepipe: DatePipe,
    public programmaticareasService: ProgrammaticAreasService,
    public formBuilder: FormBuilder,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    public translate: TranslateService) {
    this.form = formBuilder.group({
      name: [],
      code: [],
      description: []
    });

    this.programmaticareasService.invokeEvent.subscribe(value => {
      if (value === 'someVal') {
        this.getPage();
      }
    });
  }
  public icon= 'chevron_left';
  public changeIcon(){
    if(this.icon=='chevron_left')
    this.icon='chevron_right';
    else
    this.icon='chevron_left';
  }
  ngOnInit() {
    
    this.name = "";
    this.code = "";

  }

  getPage() {
    this.programmaticareas = [];
    this.programmaticareas1 = [];
    this.isHidden = "";
    this.programmaticareasService.findProgrammaticAreas(this.code, this.name)
      .subscribe(data => {
         
          if(data&&!data.programmaticArea.length){
            this.programmaticareas1.push(data.programmaticArea);
            this.programmaticareas = new MatTableDataSource(this.programmaticareas1);
            
          }
          else if(data&&data.programmaticArea.length){
            this.programmaticareas1=data.programmaticArea;
            this.programmaticareas = new MatTableDataSource(this.programmaticareas1);
            this.programmaticareas.sort = this.sort;
            this.programmaticareas.paginator = this.paginator;
          }
          
          else{
            this.isHidden = "hide";
            this.programmaticareas = [];
            this.programmaticareas1 = [];
          } 
      },
        error => {
          this.isHidden = "hide";
          this.programmaticareas = [];
          this.programmaticareas1 = [];
        },
        () => {
          this.total=this.programmaticareas1.length;
          this.isHidden = "hide";
        }
      );
  }


  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 4000,
    });
  }

  clearNameField(){
    this.name="";
  }

  clearCodeField(){
    this.code="";
  }

 

  search() {
    var userValue = this.form.value
    if (userValue.name) {
      this.name = userValue.name;
    }
    else {
      this.name = "";
    }

    if (userValue.code) {
      this.code = userValue.code;
    }
    else {
      this.code = "";
    }
   
    this.getPage();
  }

  setQuestionEdit(uuid) {
    this.programmaticarea = this.programmaticareas1.find(item => item.uuid == uuid);
    this.openDialogEdit();
    
  }

  setQuestionClone(uuid) {
    this.programmaticarea = this.programmaticareas1.find(item => item.uuid == uuid);
    this.programmaticarea.id=null;
    this.programmaticarea.uuid=null;
    this.openDialogClone();
    
  }

  printListExcel() {
          var report = alasql("SELECT code AS [Codigo],name AS [Nome],description AS [Descrição],createdAt AS [Criado em] FROM ?", [this.programmaticareas1]);
          this.excelService.exportAsExcelFile(report, 'Sistema de Tutoria, Lista de Aréas Prográmaticas ' + this.datepipe.transform(new Date(), 'dd-MM-yyyy HHmm'));
  }

  openDialogEdit(): void {
    const dialogRef = this.dialog.open(DialogEdit, {
      disableClose:true,
      width: '1200px',
      height: '750px',
      data: this.programmaticarea
    });  
  }

  openDialogClone(): void {
    window.sessionStorage.removeItem("programmaticareas");
    window.sessionStorage.setItem("programmaticareas",JSON.stringify(this.programmaticareas1));

    const dialogRef = this.dialog.open(DialogEdit, {
      disableClose:true,
      width: '1200px',
      height: '750px',
      data: this.programmaticarea
    }); 
  }

  openDialogNew(): void {
    window.sessionStorage.removeItem("programmaticareas");
    window.sessionStorage.setItem("programmaticareas",JSON.stringify(this.programmaticareas1));

    const dialogRef = this.dialog.open(DialogAdd, {
      disableClose:true,
      width: '1200px',
      height: '750px',
      data: new ProgrammaticArea()
    }); 
  }
}


@Component({
  selector: 'programmaticareas-edit-dialog',
  templateUrl: 'programmaticareas-edit-dialog.html',
})
export class DialogEdit implements OnInit{

  public form: FormGroup;
  public isHidden: string;
  public isDisabled;isAdded: boolean;
  public user;programmaticareas: any[];
 
  constructor(
    public programmaticareasService: ProgrammaticAreasService,
    public dialogRef: MatDialogRef<DialogEdit>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public formBuilder: FormBuilder,
    public snackBar: MatSnackBar,
    public translate: TranslateService) {

      this.form = formBuilder.group({
        name: ['', [
          Validators.required]],
        description: ['', [
          Validators.required]]
      });

    }

  ngOnInit() {
    this.isAdded=false;
    this.user = JSON.parse(window.sessionStorage.getItem('user'));
    this.programmaticareas = JSON.parse(window.sessionStorage.getItem('programmaticareas'));
   
  }

  onNoClick(data): void {
    this.dialogRef.close();
    
      if(this.isAdded==true){
        this.programmaticareasService.callMethodUpdateOfComponent();
      }
      else{
  
      }

  }

  onSaveClick(data): void {
    

    var payLoad: any={
      programmaticArea:data,
      userContext: this.user
    };

    
      this.programmaticareasService.update(payLoad).subscribe(data => {
      },error=>{
      },
      ()=>{
        this.isAdded=true;
        this.openSnackBar("A Área Programática com o código "+data.code+" foi actualizada com sucesso!", "OK");
      }
      
      );

    
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 4000,
    });
  }

  addLocation(data): void {
 
  }
}



@Component({
  selector: 'programmaticareas-new-dialog',
  templateUrl: 'programmaticareas-new-dialog.html',
})
export class DialogAdd implements OnInit{

  public form: FormGroup;
  public isHidden: string;
  public isDisabled;isAdded: boolean;
  public user;programmaticareas: any[];
  
  constructor(
    public programmaticareasService: ProgrammaticAreasService,
    public dialogRef: MatDialogRef<DialogAdd>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public formBuilder: FormBuilder,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    public translate: TranslateService) {

      this.form = formBuilder.group({
        name: ['', [
          Validators.required]],
        description: ['', [
          Validators.required]]
      });

    }

  ngOnInit() {
    this.isAdded=false;
    this.user = JSON.parse(window.sessionStorage.getItem('user'));
    this.programmaticareas = JSON.parse(window.sessionStorage.getItem('programmaticareas'));
  }

  onNoClick(data): void {
    this.dialogRef.close();
    if(this.isAdded==true){
      this.programmaticareasService.callMethodUpdateOfComponent();
    }
    else{

    }
   
  }

  onSaveClick(data): void {
    var payLoad: any={
      programmaticArea:data,
      userContext: this.user
    };

      if(this.programmaticareas.find(item=>item.name==data.name&&item.description==data.description))
      {
        this.openSnackBar("Esta Área Programática ja esta registada! Contacte o Administrador.", "OK");
    }
    else{
      this.programmaticareasService.create(payLoad).subscribe(data => {
      },error=>{
        console.log(error)
      },
      ()=>{
        this.isAdded=true;
        this.openSnackBar("A Área Programática foi adicionada com sucesso!", "OK");
      }
      );
    } 
  }


  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 4000,
    });
  }



}
