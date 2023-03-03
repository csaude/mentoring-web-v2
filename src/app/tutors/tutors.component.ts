import { Component, OnInit,Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator,MatDialog, MatDialogRef, MatSort , MatTableDataSource, MAT_DIALOG_DATA, PageEvent,MatSnackBar } from '@angular/material';
import { TutorsService } from "./shared/tutor.service";
import { Tutor } from "./shared/tutor";
import {ExcelService} from '../resources/shared/excel.service';
import * as alasql from 'alasql';
import { TranslateService } from 'ng2-translate';

import { ProgrammaticAreasService } from "../programmaticareas/shared/programmaticareas.service";

import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-tutors',
  templateUrl: './tutors.component.html',
  styleUrls: ['./tutors.component.css']
})

/** 
* @author Damasceno Lopes <damascenolopess@gmail.com>
*/
export class TutorsComponent implements OnInit {
  public tutor: Tutor = new Tutor();
  public isHidden: string;
  public tutors;tutors1: any[]=[];
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
    public tutorsService: TutorsService,
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

    this.tutorsService.invokeEvent.subscribe(value => {
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
    this.tutors = [];
    this.tutors1 = [];
    this.isHidden = "";
    this.tutorsService.findTutors(this.code, this.name, this.surname, this.phone)
      .subscribe(data => {
         
          if(data&&!data.tutor.length){
            this.tutors1.push(data.tutor);
            this.tutors = new MatTableDataSource(this.tutors1);
            
          }
          else if(data&&data.tutor.length){
            this.tutors1=data.tutor;
            this.tutors = new MatTableDataSource(this.tutors1);
            this.tutors.sort = this.sort;
            this.tutors.paginator = this.paginator;
          }
          
          else{
            this.isHidden = "hide";
            this.tutors = [];
            this.tutors1 = [];
          } 
      },
        error => {
          this.isHidden = "hide";
          this.tutors = [];
          this.tutors1 = [];
        },
        () => {
          this.total=this.tutors1.length;
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
    this.tutor = this.tutors1.find(item => item.uuid == uuid);
    this.openDialogEdit();
    
  }

  setPAEdit(uuid) {
    this.tutor = this.tutors1.find(item => item.uuid == uuid);
    this.openDialogPAEdit();
    
  }

  setQuestionClone(uuid) {
    this.tutor = this.tutors1.find(item => item.uuid == uuid);
    this.tutor.id=null;
    this.tutor.uuid=null;
    this.openDialogClone();
    
  }

  printListExcel() {
          var report = alasql("SELECT code AS [Codigo],CONCAT(name,' ',surname) AS [Nome do Tutorado],career->position AS [Posição],phoneNumber AS [Telefone],createdAt AS [Criado em] FROM ?", [this.tutors1]);
          this.excelService.exportAsExcelFile(report, 'Sistema de Tutoria, Lista de Tutores ' + this.datepipe.transform(new Date(), 'dd-MM-yyyy HHmm'));
  }

  openDialogEdit(): void {
    const dialogRef = this.dialog.open(DialogEdit, {
      disableClose:true,
      width: '1200px',
      height: '750px',
      data: this.tutor
    });  
  }

  openDialogPAEdit(): void {
    const dialogRef = this.dialog.open(DialogPAEdit, {
      disableClose:true,
      width: '1200px',
      height: '750px',
      data: this.tutor
    });  
  }

  openDialogClone(): void {
    window.sessionStorage.removeItem("tutors");
    window.sessionStorage.setItem("tutors",JSON.stringify(this.tutors1));

    const dialogRef = this.dialog.open(DialogEdit, {
      disableClose:true,
      width: '1200px',
      height: '750px',
      data: this.tutor
    }); 
  }

  openDialogNew(): void {
    window.sessionStorage.removeItem("tutors");
    window.sessionStorage.setItem("tutors",JSON.stringify(this.tutors1));

    const dialogRef = this.dialog.open(DialogAdd, {
      disableClose:true,
      width: '1200px',
      height: '750px',
      data: new Tutor()
    }); 
  }

  
}



@Component({
  selector: 'tutors-edit-dialog',
  templateUrl: 'tutors-edit-dialog.html',
})
export class DialogEdit implements OnInit{

  public form: FormGroup;
  public isHidden: string;
  public isDisabled;isAdded: boolean;
  public user;tutors: any[];
  public allcareers;careers;careerPositions;tutor;
  public i:number=0;

    //Partners
    public allpartners;
  
  constructor(
    public tutorsService: TutorsService,
    public dialogRef: MatDialogRef<DialogEdit>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public formBuilder: FormBuilder,
    public snackBar: MatSnackBar,
    public translate: TranslateService) {

      this.tutor=data;

      this.form = formBuilder.group({
        name: ['', [
          Validators.required]],
        surname: ['', [
          Validators.required]],
        career: ['', [
            Validators.required]],
        position: ['', [
            Validators.required]],
            partner: ['', [
              Validators.required]],
        phoneNumber: ['', [
            Validators.required]],
            email: ['', [Validators.required, Validators.email]]
      });

    }

  ngOnInit() {
    this.isAdded=false;
    this.isDisabled=false;
    this.user = JSON.parse(window.sessionStorage.getItem('user'));
    this.tutors = JSON.parse(window.sessionStorage.getItem('tutors'));

    this.tutorsService.findCareers()
    .subscribe(data => {
      this.isHidden = ""
      this.allcareers=data.career;
      this.careers = alasql("SELECT careerType FROM ? GROUP BY careerType", [this.allcareers]);
      this.careerPositions = alasql("SELECT * FROM ?allcareers WHERE careerType='"+this.tutor.career.careerType+"'", [this.allcareers]);
 },
      error => {
        this.careers = [];
        this.careerPositions = [];
      },
      () => {
        this.careerPositions = alasql("SELECT * FROM ?allcareers WHERE careerType='"+this.tutor.career.careerType+"'", [this.allcareers]);
      }
    ); 


    //Partners

    this.tutorsService.findPartners()
    .subscribe(data => {
      this.isHidden = ""
      this.allpartners=data.partner;
    
 },
      error => {
        this.allpartners = [];
 
      },
      () => {

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
        this.tutorsService.callMethodUpdateOfComponent();
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
      tutor:data,
      userContext: this.user
    };

    
      this.tutorsService.update(payLoad).subscribe(data => {
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



@Component({
  selector: 'tutors-new-dialog',
  templateUrl: 'tutors-new-dialog.html',
})
export class DialogAdd implements OnInit{

  public form: FormGroup;
  public isHidden: string;
  public isDisabled;isAdded: boolean;
  public user;tutors: any[];
  public allcareers;careers;careerPositions;tutor;
  public i:number=0;

  //Partners
  public allpartners;
  
  constructor(
    public tutorsService: TutorsService,
    public dialogRef: MatDialogRef<DialogAdd>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public formBuilder: FormBuilder,
    public snackBar: MatSnackBar,
    public translate: TranslateService) {

      this.tutor=data;

      this.form = formBuilder.group({
        name: ['', [
          Validators.required]],
        surname: ['', [
          Validators.required]],
        career: ['', [
            Validators.required]],
        position: ['', [
            Validators.required]],
        partner: ['', [
              Validators.required]],
        phoneNumber: ['', [
            Validators.required]],
            email: ['', [Validators.required, Validators.email]]
      });

    }

  ngOnInit() {
    this.isAdded=false;
    this.isDisabled=false;
    this.user = JSON.parse(window.sessionStorage.getItem('user'));
    this.tutors = JSON.parse(window.sessionStorage.getItem('tutors'));

    this.tutorsService.findCareers()
    .subscribe(data => {
      this.isHidden = ""
      this.allcareers=data.career;
      this.careers = alasql("SELECT careerType FROM ? GROUP BY careerType", [this.allcareers]);
      this.careerPositions = [];
 },
      error => {
        this.careers = [];
        this.careerPositions = [];
      },
      () => {
        this.careerPositions = [];
      }
    ); 

    //Partners

    this.tutorsService.findPartners()
    .subscribe(data => {
      this.isHidden = ""
      this.allpartners=data.partner;
    
 },
      error => {
        this.allpartners = [];
 
      },
      () => {

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
        this.tutorsService.callMethodUpdateOfComponent();
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
      tutor:data,
      userContext: this.user
    };

    
      this.tutorsService.create(payLoad).subscribe(data => {
      },error=>{
        this.isDisabled=false;
      },
      ()=>{
        this.isDisabled=false;
        this.isAdded=true;
        this.openSnackBar("O Tutor foi cadastrado com sucesso!", "OK");
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



@Component({
  selector: 'tutors-paedit-dialog',
  templateUrl: 'tutors-paedit-dialog.html',
})
export class DialogPAEdit implements OnInit{

  public form: FormGroup;
  public isHidden: string;
  public isDisabled;isAdded: boolean;
  public user;tutors: any[];
  public allcareers;careers;careerPositions;tutor;programmaticAreas;
  public i:number=0;
  
  constructor(
    public tutorsService: TutorsService,
    public dialogRef: MatDialogRef<DialogPAEdit>,
    public programmaticareasService: ProgrammaticAreasService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public formBuilder: FormBuilder,
    public snackBar: MatSnackBar,
    public translate: TranslateService) {

      this.tutor=data;

      this.form = formBuilder.group({
        programmatic_area: ['', [
          Validators.required]]
      });

    }

  ngOnInit() {
    this.isHidden = "hide"
    this.isAdded=false;
    this.isDisabled=false;
    this.user = JSON.parse(window.sessionStorage.getItem('user'));
    this.tutors = JSON.parse(window.sessionStorage.getItem('tutors'));

    this.programmaticareasService.findProgrammaticAreas("","")
    .subscribe(data => {
   
      this.programmaticAreas=data.programmaticArea;
 },
      error => {
        this.programmaticAreas = [];
      },
      () => {
        
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
        this.tutorsService.callMethodUpdateOfComponent();
      }
      else{
  
      }

  }

  onSaveClick(data): void {
    var result, userValue = this.form.value;

 this.isHidden="";
    this.isDisabled=true;

    var payLoad: any;

    if(data.isUser=="false"){

      payLoad={
        tutorProgramaticArea: {
          tutor:data,
          programmaticArea:userValue.programmatic_area,
          mapAsUser:true
        },
        userContext: this.user
      };


    } else{

      payLoad={
        tutorProgramaticArea: {
          tutor:data,
          programmaticArea:userValue.programmatic_area
        },
        userContext: this.user
      };


    }
    
      var message;
    
   
      this.tutorsService.createTutorProgrammaticArea(payLoad).subscribe(data => {
       message=data;
      },error=>{
        this.isDisabled=false;
        this.isHidden="hide";
        this.openSnackBar("Nao foi possivel associar o tutor a Aréa Programática!", "OK");
      },
      ()=>{
        this.isHidden="hide";
        this.isAdded=true;
        if(!message.message){
        this.openSnackBar("O Tutor foi associado com sucesso!", "OK");
      }else{
        this.openSnackBar("O Tutor já está associado a esta Área Programática!", "OK");
        this.isDisabled=false;
      }
      }
      
      );

     
    
    
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 4000,
    });

    
  }

}