import { Component, OnInit,Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator,MatDialog, MatDialogRef, MatSort , MatTableDataSource, MAT_DIALOG_DATA, PageEvent,MatSnackBar } from '@angular/material';
import { TutoredsService } from "./shared/tutored.service";
import { Tutored } from "./shared/tutored";
import {ExcelService} from '../resources/shared/excel.service';
import * as alasql from 'alasql';
import { TranslateService } from 'ng2-translate';

import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-tutoreds',
  templateUrl: './tutoreds.component.html',
  styleUrls: ['./tutoreds.component.css']
})

/** 
* @author Damasceno Lopes <damascenolopess@gmail.com>
*/
export class TutoredsComponent implements OnInit {
  public tutored: Tutored = new Tutored();
  public isHidden: string;
  public tutoreds;tutoreds1: any[]=[];
  public ROLE_HIS;
  public form: FormGroup;
  public name: string;
  public code: string;
  public surname: string;
  public phone: string;
  public total: number;
  
  @ViewChild(MatPaginator,{static: false}) paginator: MatPaginator;
  @ViewChild(MatSort,{static: false}) sort: MatSort;

  public pageEvent: PageEvent;
  public displayedColumns: string[] = ['code','name','surname','position','phone','actions'];
     
  constructor(
    public excelService:ExcelService,
    public datepipe: DatePipe,
    public tutoredsService: TutoredsService,
    public formBuilder: FormBuilder,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    public translate: TranslateService) {
    this.form = formBuilder.group({
      name: [],
      surname: [],
      phone: [],
      code: []
    });

    this.tutoredsService.invokeEvent.subscribe(value => {
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
    this.phone = "";
    this.surname = "";

  }

  getPage() {
    this.tutoreds = [];
    this.tutoreds1 = [];
    this.isHidden = "";
    this.tutoredsService.findTutoreds(this.code, this.name, this.surname, this.phone)
      .subscribe(data => {
         
          if(data&&!data.tutored.length){
            this.tutoreds1.push(data.tutored);
            this.tutoreds = new MatTableDataSource(this.tutoreds1);
            
          }
          else if(data&&data.tutored.length){
            this.tutoreds1=data.tutored;
            this.tutoreds = new MatTableDataSource(this.tutoreds1);
            this.tutoreds.sort = this.sort;
            this.tutoreds.paginator = this.paginator;
          }
          
          else{
            this.isHidden = "hide";
            this.tutoreds = [];
            this.tutoreds1 = [];
          } 
      },
        error => {
          this.isHidden = "hide";
          this.tutoreds = [];
          this.tutoreds1 = [];
        },
        () => {
          this.total=this.tutoreds1.length;
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

  clearSurnameField(){
    this.surname="";
  }

  clearPhoneField(){
    this.phone="";
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
    this.tutored = this.tutoreds1.find(item => item.uuid == uuid);
    this.openDialogEdit();
    
  }

  setQuestionClone(uuid) {
    this.tutored = this.tutoreds1.find(item => item.uuid == uuid);
    this.tutored.id=null;
    this.tutored.uuid=null;
    this.openDialogClone();
    
  }

  printListExcel() {
          var report = alasql("SELECT code AS [Codigo],CONCAT(name,' ',surname) AS [Nome do Tutorado],career->position AS [Posição],phoneNumber AS [Telefone],createdAt AS [Criado em] FROM ?", [this.tutoreds1]);
          this.excelService.exportAsExcelFile(report, 'Sistema de Tutoria, Lista de Tutorados ' + this.datepipe.transform(new Date(), 'dd-MM-yyyy HHmm'));
  }

  openDialogEdit(): void {
    const dialogRef = this.dialog.open(DialogEdit, {
      disableClose:true,
      width: '1200px',
      height: '750px',
      data: this.tutored
    });  
  }

  openDialogClone(): void {
    window.sessionStorage.removeItem("tutoreds");
    window.sessionStorage.setItem("tutoreds",JSON.stringify(this.tutoreds1));

    const dialogRef = this.dialog.open(DialogEdit, {
      disableClose:true,
      width: '1200px',
      height: '750px',
      data: this.tutored
    }); 
  }

  
}


@Component({
  selector: 'tutoreds-edit-dialog',
  templateUrl: 'tutoreds-edit-dialog.html',
})
export class DialogEdit implements OnInit{

  public form: FormGroup;
  public isHidden: string;
  public isDisabled;isAdded: boolean;
  public user;tutoreds: any[];
  public allcareers;careers;careerPositions;tutored;
  public i:number=0;
  
  constructor(
    public tutoredsService: TutoredsService,
    public dialogRef: MatDialogRef<DialogEdit>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public formBuilder: FormBuilder,
    public snackBar: MatSnackBar,
    public translate: TranslateService) {

      this.tutored=data;

      this.form = formBuilder.group({
        name: ['', [
          Validators.required]],
        surname: ['', [
          Validators.required]],
        career: ['', [
            Validators.required]],
        position: ['', [
            Validators.required]],
        phoneNumber: ['', [
            Validators.required]]
      });

    }

  ngOnInit() {
    this.isAdded=false;
    this.isDisabled=false;
    this.user = JSON.parse(window.sessionStorage.getItem('user'));
    this.tutoreds = JSON.parse(window.sessionStorage.getItem('tutoreds'));

    this.tutoredsService.findCareers()
    .subscribe(data => {
      this.isHidden = ""
      this.allcareers=data.career;
      this.careers = alasql("SELECT careerType FROM ? GROUP BY careerType", [this.allcareers]);
      this.careerPositions = alasql("SELECT * FROM ?allcareers WHERE careerType='"+this.tutored.career.careerType+"'", [this.allcareers]);
 },
      error => {
        this.careers = [];
        this.careerPositions = [];
      },
      () => {
        this.careerPositions = alasql("SELECT * FROM ?allcareers WHERE careerType='"+this.tutored.career.careerType+"'", [this.allcareers]);
      }
    ); 
   
  }

  onChange(value) {
    this.i++;
    if(this.i>1){ 
    this.careerPositions = alasql("SELECT * FROM ?allcareers WHERE careerType='"+value.careerType+"'", [this.allcareers]);
  }
  }

  compareObjects(o1: any, o2: any) {
    if(o1.careerType == o2.careerType )
    return true;
    else return false
  }

  compareObjects2(o1: any, o2: any) {
    if(o1.uuid == o2.uuid && o1.id == o2.id )
    return true;
    else return false
  }

  onNoClick(data): void {
    this.dialogRef.close();
    
      if(this.isAdded==true){
        this.tutoredsService.callMethodUpdateOfComponent();
      }
      else{
  
      }

  }

  onSaveClick(data): void {

    if(!data.career.position){

      this.openSnackBar("Seleccione a posição", "OK");

    }else{
    this.isDisabled=true;
    

    var payLoad: any={
      tutored:data,
      userContext: this.user
    };

    
      this.tutoredsService.update(payLoad).subscribe(data => {
      },error=>{
        this.isDisabled=false;
      },
      ()=>{
        
        this.isAdded=true;
        this.openSnackBar("O Tutorado com o código "+data.code+" foi actualizada com sucesso!", "OK");
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