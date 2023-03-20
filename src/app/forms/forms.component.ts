import { Component, OnInit,Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator,MatDialog, MatDialogRef, MatSort , MatTableDataSource, MAT_DIALOG_DATA, PageEvent,MatSnackBar } from '@angular/material';
import { FormsService } from "./shared/form.service";
import { Form } from "./shared/form";
import {ExcelService} from '../resources/shared/excel.service';
import * as alasql from 'alasql';
import { TranslateService } from 'ng2-translate';
import { QuestionsService } from "../questions/shared/questions.service";

import { ProgrammaticAreasService } from "../programmaticareas/shared/programmaticareas.service";

import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-forms',
  templateUrl: './forms.component.html',
  styleUrls: ['./forms.component.css']
})

/**
* @author Damasceno Lopes <damascenolopess@gmail.com>
*/
export class FormsComponent implements OnInit {
  public form: Form = new Form();
  public isHidden: string;
  public forms;forms1: any[]=[];
  public ROLE_HIS;
  public formGroup: FormGroup;
  public name: string;
  public code: string;
  public programmaticarea: string;
  public total: number;
  public programmaticAreas;

  @ViewChild(MatPaginator,{static: false}) paginator: MatPaginator;
  @ViewChild(MatSort,{static: false}) sort: MatSort;

  public pageEvent: PageEvent;
  public displayedColumns: string[] = ['code','name','programmaticarea','actions'];

  constructor(
    public excelService:ExcelService,
    public datepipe: DatePipe,
    public formsService: FormsService,
    public formBuilder: FormBuilder,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    public programmaticAreasService:ProgrammaticAreasService,
    public translate: TranslateService) {
    this.formGroup = formBuilder.group({
      name: [],
      code: [],
      programmatic_area: []
    });

    this.formsService.invokeEvent.subscribe(value => {
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
    this.programmaticarea = "";

    this.programmaticAreasService.findProgrammaticAreas("","")
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

  getPage() {
    this.forms = [];
    this.forms1 = [];
    this.isHidden = "";
    this.formsService.findForms(this.code, this.name, this.programmaticarea)
      .subscribe(data => {

          if(data&&!data.form.length){
            this.forms1.push(data.form);
            this.forms = new MatTableDataSource(this.forms1);

          }
          else if(data&&data.form.length){
            this.forms1=data.form;
            this.forms = new MatTableDataSource(this.forms1);
            this.forms.sort = this.sort;
            this.forms.paginator = this.paginator;
          }

          else{
            this.isHidden = "hide";
            this.forms = [];
            this.forms1 = [];
          }
      },
        error => {
          this.isHidden = "hide";
          this.forms = [];
          this.forms1 = [];
        },
        () => {
          this.total=this.forms1.length;
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
    var userValue = this.formGroup.value
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

    if (userValue.programmatic_area) {
      this.programmaticarea = userValue.programmatic_area.code;
    }
    else {
      this.programmaticarea = "";
    }

    this.getPage();
  }

  setQuestionEdit(uuid) {
    this.form = this.forms1.find(item => item.uuid == uuid);
    this.openDialogEdit();

  }


  setQuestionClone(uuid) {
    this.form = this.forms1.find(item => item.uuid == uuid);
    this.form.id=null;
    this.form.uuid=null;
    this.openDialogClone();

  }

  printListExcel() {
          var report = alasql("SELECT code AS [Codigo],name AS [Nome do Formulario],programmaticArea->name AS [Área Programática],formType AS [Tipo de Formulário],targetPatient AS [Objectivo de Pacientes],targetFile AS [Objectivo de Processos],createdAt AS [Criado em] FROM ?", [this.forms1]);
          this.excelService.exportAsExcelFile(report, 'Sistema de Tutoria, Lista de Formulários ' + this.datepipe.transform(new Date(), 'dd-MM-yyyy HHmm'));
  }

  openDialogEdit(): void {
    const dialogRef = this.dialog.open(DialogEdit, {
      disableClose:true,
      width: '1200px',
      height: '750px',
      data: this.form
    });
  }


  openDialogClone(): void {
    window.sessionStorage.removeItem("forms");
    window.sessionStorage.setItem("forms",JSON.stringify(this.forms1));

    const dialogRef = this.dialog.open(DialogEdit, {
      disableClose:true,
      width: '1200px',
      height: '750px',
      data: this.form
    });
  }

  openDialogNew(): void {
    window.sessionStorage.removeItem("forms");
    window.sessionStorage.setItem("forms",JSON.stringify(this.forms1));

    const dialogRef = this.dialog.open(DialogAdd, {
      disableClose:true,
      width: '1200px',
      height: '750px',
      data: new Form()
    });
  }


}



@Component({
  selector: 'forms-edit-dialog',
  templateUrl: 'forms-edit-dialog.html',
  styleUrls: ['forms-edit-dialog.css']
})
export class DialogEdit implements OnInit{

  public formGroup: FormGroup;
  public isHidden;isHidden2: string;
  public isDisabled;isAdded: boolean;
  public user;forms: any[];
  public formtypes;programmaticAreas;form;formSearch;

  public formQuestions;formQuestions1: any[]=[];

  public i:number=0;

  public allpartners;

  isLinear = true;

  public displayedColumns: string[] = ['sequence','code','applicable','question','questionType','actions'];
  public displayedColumns2: string[] = ['code2','question2','type2','actions'];

  //Questions
  public questions;questions1: any[]=[];
  @ViewChild(MatPaginator,{static: false}) paginator: MatPaginator;
  @ViewChild(MatSort,{static: false}) sort: MatSort;
  public name: string;
  public code: string;
  public type: string;

  public opts = [
    { id: "true", name: 'yes' },
    { id: "false", name: 'no' }
  ];

  constructor(
    public formsService: FormsService,
    public programmaticAreasService:ProgrammaticAreasService,
    public dialogRef: MatDialogRef<DialogEdit>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public formBuilder: FormBuilder,
    public snackBar: MatSnackBar,
    public questionsService: QuestionsService,
    public translate: TranslateService) {

      this.form=data;

    }

  ngOnInit() {
    this.isHidden="";
    this.isAdded=false;
    this.isDisabled=false;
    this.user = JSON.parse(window.sessionStorage.getItem('user'));
    this.forms = JSON.parse(window.sessionStorage.getItem('forms'));

    this.formSearch = this.formBuilder.group({
      name: [],
      code: [],
      type: []
    });


    this.formGroup = this.formBuilder.group({
      name: ['', [
        Validators.required]],
      form_type: ['', [
        Validators.required]],
      programmatic_area: ['', [
          Validators.required]],
      target_patient: ['', [
          Validators.required]],
      target_file: ['', [
          Validators.required]],
      description: ['', [
              Validators.required]],
      partner: ['', [
              Validators.required]]
    });

    this.formsService.findFormTypes()
    .subscribe(data => {

      this.formtypes=data.formType;
 },
      error => {
        this.formtypes = [];

      },
      () => {
      }
    );

    this.programmaticAreasService.findProgrammaticAreas("","")
    .subscribe(data => {

      this.programmaticAreas=data.programmaticArea;
 },
      error => {
        this.programmaticAreas = [];
      },
      () => {

      }
    );

    this.formsService.findPartners().subscribe(data => {
      this.allpartners=data.partner;
    },
    error => {
      this.allpartners=[];
    },
    ()=> {

    });

    this.formsService.findFormQuestions(this.form.id)
    .subscribe(data => {

      if(data&&!data.formQuestion.length){
        this.formQuestions1.push(data.formQuestion);
        var newFQ=[];
        var  i=1;
        for( let f of this.formQuestions1){
          f.newSequence=i.toString();
          newFQ.push(f);
          i++;
        }
        this.formQuestions1=newFQ;
        this.formQuestions = new MatTableDataSource(this.formQuestions1);


      }
      else if(data&&data.formQuestion.length){
        this.formQuestions1=data.formQuestion;
        this.formQuestions1=alasql("SELECT * FROM ?formQuestions1 ORDER BY CAST(sequence AS NUMBER) ASC",[this.formQuestions1]);

        var newFQ=[];
        var  i=1;
        for( let f of this.formQuestions1){
          f.newSequence=i.toString();
          newFQ.push(f);
          i++;
        }
        this.formQuestions1=newFQ;
        this.formQuestions = new MatTableDataSource(this.formQuestions1);

      }

      else{
        this.isHidden = "hide";
        this.formQuestions = [];
        this.formQuestions1 = [];
      }
 },
      error => {
        this.formQuestions = [];
        this.formQuestions1=[];
      },
      () => {
        this.isHidden = "hide";
           }
    );

  }

  search() {
    var userValue = this.formSearch.value
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

    if (userValue.type) {
      this.type = userValue.type;
    } else {
      this.type = "";
    }

    this.getPage();
  }

  getPage() {
    this.questions = [];
    this.questions1 = [];
    this.isHidden2 = "";
    this.questionsService.findQuestions(this.code, this.name, this.type)
      .subscribe(data => {

          if(data&&!data.question.length){
            this.questions1.push(data.question);
            this.questions = new MatTableDataSource(this.questions1);

          }
          else if(data&&data.question.length){
            this.questions1=data.question;
            this.questions = new MatTableDataSource(this.questions1);
            this.questions.sort = this.sort;
            this.questions.paginator = this.paginator;
          }

          else{
            this.isHidden2 = "hide";
            this.questions = [];
            this.questions1 = [];
          }
      },
        error => {
          this.isHidden2 = "hide";
          this.questions = [];
          this.questions1 = [];
        },
        () => {
          this.isHidden2 = "hide";
        }
      );
  }


  compareObjects1(o1: any, o2: any) {
    if(o1==o2 )
    return true;
    else return false
  }

  generateArray():any{
    return Array.from({length: this.formQuestions1.length}, (v, k) => k+1).map(String);
  }

  compareObjects2(o1: any, o2: any) {
    if(o1.uuid == o2.uuid && o1.id == o2.id )
    return true;
    else return false
  }

  onNoClick(data): void {
    this.dialogRef.close();

      if(this.isAdded==true){
        this.formsService.callMethodUpdateOfComponent();
      }
      else{

      }

  }

  addQuestion(data): void {

if(this.formQuestions1.find(item => item.question.uuid==data.uuid)){
  this.openSnackBar("ATENÇÃO: esta questão ja foi adicionada!", "OK");
}else{
  var datan: any={
    sequence:(this.formQuestions1.length+1).toString(),
    newSequence:(this.formQuestions1.length+1).toString(),
    applicable: "false",
    question:data
  };

  this.formQuestions1.push(datan);
  this.formQuestions = new MatTableDataSource(this.formQuestions1);
  this.openSnackBar("Questão adicionada com sucesso!", "OK");
}
  }

  onDeleteClick(data): void {
    this.isHidden = "";
     this.formQuestions1=this.formQuestions1.filter(item => item.uuid !=data.uuid);
    var newFQ=[];
    var  i=1;
    for( let f of this.formQuestions1){
      f.sequence=i.toString();
      f.newSequence=i.toString();
      newFQ.push(f);
      i++;
    }
    this.formQuestions1=newFQ;
    this.formQuestions = new MatTableDataSource(this.formQuestions1);
    this.isHidden = "hide";
  }

  onChangeSequence(data):void{

    var toReplace=this.formQuestions1.find(item =>item.sequence==data.sequence && item.newSequence==data.sequence);
    toReplace.sequence=data.newSequence;
    toReplace.newSequence=data.newSequence;

    var newObjSequence=data;
    newObjSequence.newSequence=data.sequence;

    this.formQuestions1=this.formQuestions1.filter(item=>item.uuid!=toReplace.uuid);
    this.formQuestions1=this.formQuestions1.filter(item=>item.uuid!=newObjSequence.uuid)

    this.formQuestions1.push(toReplace);
    this.formQuestions1.push(newObjSequence);
    this.formQuestions1=alasql("SELECT * FROM ?formQuestions1 ORDER BY CAST(sequence AS NUMBER) ASC",[this.formQuestions1]);

    this.formQuestions = new MatTableDataSource(this.formQuestions1);

  }

  onChangeApplicable(data):void{

  }

  onSaveClick(data): void {
    this.isDisabled=true;
    if(this.formQuestions1.length==0){
      this.openSnackBar("É preciso adicionar questões ao formulário.", "OK");
      this.isDisabled=false;
    }else{

      var payLoad: any={
        userContext: this.user,
        form:data,
        formQuestions: this.formQuestions1
      };

      this.formsService.update(payLoad).subscribe(data => {
      },error=>{
        this.isDisabled=false;
      },
      ()=>{
        this.dialogRef.close();
        this.formsService.callMethodUpdateOfComponent();
        this.openSnackBar("O Formulário com o código "+data.code+" foi actualizado com sucesso!", "OK");
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
  selector: 'forms-add-dialog',
  templateUrl: 'forms-add-dialog.html',
  styleUrls: ['forms-edit-dialog.css']
})
export class DialogAdd implements OnInit{

  public formGroup: FormGroup;
  public isHidden;isHidden2: string;
  public isDisabled;isAdded: boolean;
  public user;forms: any[];
  public formtypes;programmaticAreas;form;formSearch;

  public formQuestions;formQuestions1: any[]=[];

  public i:number=0;

  public allpartners;

  isLinear = true;

  public displayedColumns: string[] = ['sequence','code','applicable','question','questionType','actions'];
  public displayedColumns2: string[] = ['code2','question2','type2','actions'];

  //Questions
  public questions;questions1: any[]=[];
  @ViewChild(MatPaginator,{static: false}) paginator: MatPaginator;
  @ViewChild(MatSort,{static: false}) sort: MatSort;
  public name: string;
  public code: string;
  public type: string;

  public opts = [
    { id: "true", name: 'yes' },
    { id: "false", name: 'no' }
  ];

  constructor(
    public formsService: FormsService,
    public programmaticAreasService:ProgrammaticAreasService,
    public dialogRef: MatDialogRef<DialogAdd>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public formBuilder: FormBuilder,
    public snackBar: MatSnackBar,
    public questionsService: QuestionsService,
    public translate: TranslateService) {

      this.form=data;

    }

  ngOnInit() {
    this.isHidden="hide";
    this.isAdded=false;
    this.isDisabled=false;
    this.user = JSON.parse(window.sessionStorage.getItem('user'));
    this.forms = JSON.parse(window.sessionStorage.getItem('forms'));

    this.formSearch = this.formBuilder.group({
      name: [],
      code: [],
      type: []
    });


    this.formGroup = this.formBuilder.group({
      name: ['', [
        Validators.required]],
      form_type: ['', [
        Validators.required]],
      programmatic_area: ['', [
          Validators.required]],
      target_patient: ['', [
          Validators.required]],
      target_file: ['', [
          Validators.required]],
      description: ['', [
              Validators.required]],
      partner: ['', [
                Validators.required]]
    });

    this.formsService.findFormTypes()
    .subscribe(data => {

      this.formtypes=data.formType;
 },
      error => {
        this.formtypes = [];

      },
      () => {
      }
    );

    this.programmaticAreasService.findProgrammaticAreas("","")
    .subscribe(data => {

      this.programmaticAreas=data.programmaticArea;
 },
      error => {
        this.programmaticAreas = [];
      },
      () => {

      }
    );

    this.formsService.findPartners()
        .subscribe(data => {

          this.allpartners=data.partner;

     },
          error => {
            this.allpartners = [];

          },
          () => {

          }
        );


    this.formQuestions = [];

  }

  search() {
    var userValue = this.formSearch.value
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

    if (userValue.type) {
      this.type = userValue.type;
    } else {
      this.type = "";
    }

    this.getPage();
  }

  getPage() {
    this.questions = [];
    this.questions1 = [];
    this.isHidden2 = "";
    this.questionsService.findQuestions(this.code, this.name, this.type)
      .subscribe(data => {

          if(data&&!data.question.length){
            this.questions1.push(data.question);
            this.questions = new MatTableDataSource(this.questions1);

          }
          else if(data&&data.question.length){
            this.questions1=data.question;
            this.questions = new MatTableDataSource(this.questions1);
            this.questions.sort = this.sort;
            this.questions.paginator = this.paginator;
          }

          else{
            this.isHidden2 = "hide";
            this.questions = [];
            this.questions1 = [];
          }
      },
        error => {
          this.isHidden2 = "hide";
          this.questions = [];
          this.questions1 = [];
        },
        () => {
          this.isHidden2 = "hide";
        }
      );
  }

  generateArray():any{
    return Array.from({length: this.formQuestions1.length}, (v, k) => k+1).map(String);
  }

  onNoClick(data): void {
    this.dialogRef.close();

      if(this.isAdded==true){
        this.formsService.callMethodUpdateOfComponent();
      }
      else{

      }

  }

  addQuestion(data): void {

if(this.formQuestions1.find(item => item.question.uuid==data.uuid)){
  this.openSnackBar("ATENÇÃO: esta questão ja foi adicionada!", "OK");
}else{
  var datan: any={
    sequence:(this.formQuestions1.length+1).toString(),
    newSequence:(this.formQuestions1.length+1).toString(),
    applicable: "false",
    question:data
  };

  this.formQuestions1.push(datan);
  this.formQuestions = new MatTableDataSource(this.formQuestions1);
  this.openSnackBar("Questão adicionada com sucesso!", "OK");
}
  }

  onDeleteClick(data): void {
    this.isHidden = "";
     this.formQuestions1=this.formQuestions1.filter(item => item.question.uuid !=data.question.uuid);
    var newFQ=[];
    var  i=1;
    for( let f of this.formQuestions1){
      f.sequence=i.toString();
      f.newSequence=i.toString();
      newFQ.push(f);
      i++;
    }
    this.formQuestions1=newFQ;
    this.formQuestions = new MatTableDataSource(this.formQuestions1);
    this.isHidden = "hide";
  }

  onChangeSequence(data):void{

    var toReplace=this.formQuestions1.find(item =>item.sequence==data.sequence && item.newSequence==data.sequence);
    toReplace.sequence=data.newSequence;
    toReplace.newSequence=data.newSequence;

    var newObjSequence=data;
    newObjSequence.newSequence=data.sequence;

    this.formQuestions1=this.formQuestions1.filter(item=>item.question.uuid!=toReplace.question.uuid);
    this.formQuestions1=this.formQuestions1.filter(item=>item.question.uuid!=newObjSequence.question.uuid)

    this.formQuestions1.push(toReplace);
    this.formQuestions1.push(newObjSequence);
    this.formQuestions1=alasql("SELECT * FROM ?formQuestions1 ORDER BY CAST(sequence AS NUMBER) ASC",[this.formQuestions1]);

    this.formQuestions = new MatTableDataSource(this.formQuestions1);

  }

  onChangeApplicable(data):void{

  }

  onSaveClick(data): void {
    this.isDisabled=true;
    if(this.formQuestions1.length==0){
      this.openSnackBar("É preciso adicionar questões ao formulário.", "OK");
      this.isDisabled=false;
    }else{

      var payLoad: any={
        userContext: this.user,
        form:data,
        formQuestions: this.formQuestions1
      };

      this.formsService.create(payLoad).subscribe(data => {
      },error=>{
        this.isDisabled=false;
      },
      ()=>{
        this.dialogRef.close();
        this.formsService.callMethodUpdateOfComponent();
        this.openSnackBar("O Formulário foi criado com sucesso!", "OK");
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



