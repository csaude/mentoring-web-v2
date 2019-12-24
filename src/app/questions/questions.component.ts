import { Component, OnInit,Inject, ViewChild, ComponentFactoryResolver } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator,MatDialog, MatDialogRef, MatSort , MatTableDataSource, MAT_DIALOG_DATA, PageEvent,MatSnackBar } from '@angular/material';
import { QuestionsService } from "./shared/questions.service";
import { Question } from "./shared/question";
import {ExcelService} from '../resources/shared/excel.service';
import { TranslateService } from 'ng2-translate';

import * as alasql from 'alasql';

import { DatePipe } from '@angular/common';
import { QuestionCategory } from './shared/questioncategory';

@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.css']
})

/** 
* @author Damasceno Lopes <damascenolopess@gmail.com>
*/
export class QuestionsComponent implements OnInit {
  public question: Question = new Question();
  public isHidden: string;
  public questions;questions1: any[]=[];
  public ROLE_HIS;
  public form: FormGroup;
  public name: string;
  public code: string;
  public type: string;
  
  @ViewChild(MatPaginator,{static: false}) paginator: MatPaginator;
  @ViewChild(MatSort,{static: false}) sort: MatSort;

  public pageEvent: PageEvent;
  public displayedColumns: string[] = ['code','question','type','category','actions'];
     
  constructor(
    public excelService:ExcelService,
    public datepipe: DatePipe,
    public questionsService: QuestionsService,
    public formBuilder: FormBuilder,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    public translate: TranslateService) {
    this.form = formBuilder.group({
      name: [],
      code: [],
      type: []
    });

    this.questionsService.invokeEvent.subscribe(value => {
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
    this.type="";

  }

  getPage() {
    this.questions = [];
    this.questions1 = [];
    this.isHidden = "";
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
            this.isHidden = "hide";
            this.questions = [];
            this.questions1 = [];
          } 
      },
        error => {
          this.isHidden = "hide";
          this.questions = [];
          this.questions1 = [];
        },
        () => {
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
   
    if (userValue.type) {
      this.type = userValue.type;
    } else {
      this.type = "";
    }
   
    this.getPage();
  }

  setQuestionEdit(uuid) {
    this.question = this.questions1.find(item => item.uuid == uuid);
    this.openDialogEdit();
    
  }

  setQuestionClone(uuid) {
    this.question = this.questions1.find(item => item.uuid == uuid);
    this.question.id=null;
    this.question.uuid=null;
    this.openDialogClone();
    
  }

  printListExcel() {
          var report = alasql("SELECT code AS [Codigo],question AS [Questão],CASE questionType WHEN 'TEXT' THEN 'Texto' WHEN 'BOOLEAN' THEN 'Booleana' WHEN 'NUMERIC' THEN 'Numérica' ELSE questionType END AS [Tipo de Questão],questionsCategory->category AS [Categoria],createdAt AS [Criado em] FROM ?", [this.questions1]);
          this.excelService.exportAsExcelFile(report, 'Sistema de Tutoria, Lista de Questões ' + this.datepipe.transform(new Date(), 'dd-MM-yyyy HHmm'));
  }

  openDialogEdit(): void {
    const dialogRef = this.dialog.open(DialogEdit, {
      disableClose:true,
      width: '1200px',
      height: '750px',
      data: this.question
    });  
  }

  openDialogClone(): void {
    window.sessionStorage.removeItem("questions");
    window.sessionStorage.setItem("questions",JSON.stringify(this.questions1));

    const dialogRef = this.dialog.open(DialogEdit, {
      disableClose:true,
      width: '1200px',
      height: '750px',
      data: this.question
    }); 
  }

  openDialogNew(): void {
    window.sessionStorage.removeItem("questions");
    window.sessionStorage.setItem("questions",JSON.stringify(this.questions1));

    const dialogRef = this.dialog.open(DialogAdd, {
      disableClose:true,
      width: '1200px',
      height: '750px',
      data: new Question()
    }); 
  }
}


@Component({
  selector: 'questions-edit-dialog',
  templateUrl: 'questions-edit-dialog.html',
})
export class DialogEdit implements OnInit{

  public form: FormGroup;
  public questionTypes;questionsCategory;
  public isHidden: string;
  public isDisabled;isAdded: boolean;
  public user;questions: any[];
  
  constructor(
    public questionsService: QuestionsService,
    public dialogRef: MatDialogRef<DialogEdit>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public formBuilder: FormBuilder,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    public translate: TranslateService) {

      this.form = formBuilder.group({
        question: ['', [
          Validators.required]],
        questionType: ['', [
          Validators.required]],
          questionsCategory: ['', [
          Validators.required]]
      });

      this.questionsService.invokeEvent.subscribe(value => {
        if (value === 'someValReload') {
          this.reloadQuestionsCategory();
        }
      });

    }

  ngOnInit() {
    this.isAdded=false;
    this.user = JSON.parse(window.sessionStorage.getItem('user'));
    this.questions = JSON.parse(window.sessionStorage.getItem('questions'));
    this.questionsService.findQuestionTypes()
      .subscribe(data => {
        this.isHidden = ""
        this.questionTypes = data.questionType;
   },
        error => {
          this.questionTypes = [];
        },
        () => {
         
        }
      );

      this.questionsService.findQuestionCategories()
          .subscribe(data => {
            this.isHidden = ""
            this.questionsCategory = alasql("select * from ? order by category ASC",[data.questionsCategory]);
        
       },
            error => {
             this.isHidden = "hide";
              this.questionsCategory = [];
            },
            () => {
             this.isHidden = "hide";
            }
          );
     
   
  }

  onNoClick(data): void {
    this.dialogRef.close();
    if(data.id){
      if(this.isAdded==true){
        this.questionsService.callMethodUpdateOfComponent();
      }
      else{
  
      }
    }else{
      if(this.isAdded==true){
        this.questionsService.callMethodUpdateOfComponent();
      }
      else{
  
      }
    }
  }

  onSaveClick(data): void {
    
    this.isDisabled=true; 
    var payLoad: any={
      question:data,
      userContext: this.user
    };

    if(data.id!=null){
      this.questionsService.updateQuestion(payLoad).subscribe(data => {
      },error=>{
      },
      ()=>{
        this.isAdded=true;
        this.openSnackBar("A Questão com o código "+data.code+" foi actulizada com sucesso!", "OK");
        this.isDisabled=false;
      }
      
      );

    }else{
     
      if(this.questions.find(item=>item.question==data.question&&item.questionType==data.questionType&&item.questionsCategory.uuid==data.questionsCategory.uuid))
      {
        this.openSnackBar("Esta Questão ja esta registada! Contacte o Administrador.", "OK");
        this.isDisabled=false;
    }
    else{
      this.questionsService.createQuestion(payLoad).subscribe(data => {
      },error=>{
      },
      ()=>{
        this.isAdded=true;
        this.openSnackBar("A Questão foi adicionada com sucesso!", "OK");
        this.isDisabled=false;
      }
      );
    } 
    }
    
  }

  compareObjects(o1: any, o2: any) {
    if(o1.uuid == o2.uuid && o1.id == o2.id )
    return true;
    else return false
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 4000,
    });
  }

  addQuestionsCategory(): void {
    window.sessionStorage.removeItem("questionsCategory");
    window.sessionStorage.setItem("questionsCategory",JSON.stringify(this.questionsCategory));

    const dialogRef = this.dialog.open(DialogQuestionsCategoryAdd, {
      disableClose:true,
      width: '800px',
      height: '300px',
      data: new QuestionCategory()
    }); 
  }

  reloadQuestionsCategory(){
    this.questionsCategory = [];
    this.questionsService.findQuestionCategories()
          .subscribe(data => {
            this.isHidden = ""
            this.questionsCategory = alasql("select * from ? order by category ASC",[data.questionsCategory]);
       },
            error => {
             this.isHidden = "hide";
              this.questionsCategory = [];
            },
            () => {
             this.isHidden = "hide";
            }
          );
  }

}



@Component({
  selector: 'questions-new-dialog',
  templateUrl: 'questions-new-dialog.html',
})
export class DialogAdd implements OnInit{

  public form: FormGroup;
  public questionTypes;questionsCategory;
  public isHidden: string;
  public isDisabled;isAdded: boolean;
  public user;questions: any[];
  
  constructor(
    public questionsService: QuestionsService,
    public dialogRef: MatDialogRef<DialogAdd>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public formBuilder: FormBuilder,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    public translate: TranslateService) {

      this.form = formBuilder.group({
        question: ['', [
          Validators.required]],
        questionType: ['', [
          Validators.required]],
        questionsCategory: ['', [
          Validators.required]]
      });

      this.questionsService.invokeEvent.subscribe(value => {
        if (value === 'someValReload') {
          this.reloadQuestionsCategory();
        }
      });

    }

  ngOnInit() {
    this.isAdded=false;
    this.user = JSON.parse(window.sessionStorage.getItem('user'));
    this.questions = JSON.parse(window.sessionStorage.getItem('questions'));
    this.questionsService.findQuestionTypes()
      .subscribe(data => {
        this.isHidden = "";
        this.questionTypes = data.questionType;
   },
        error => {
         
          this.questionTypes = [];
        },
        () => {
        }
      );

      this.questionsService.findQuestionCategories()
          .subscribe(data => {
            this.isHidden = ""
            this.questionsCategory = alasql("select * from ? order by category ASC",[data.questionsCategory]);
       },
            error => {
             this.isHidden = "hide";
              this.questionsCategory = [];
            },
            () => {
             this.isHidden = "hide";
            }
          );
     
   
  }

  onNoClick(data): void {
    this.dialogRef.close();
    if(this.isAdded==true){
      this.questionsService.callMethodUpdateOfComponent();
    }
    else{

    }
  }

  onSaveClick(data): void {
  
    if(data.questionsCategory.category){

      this.isDisabled=true;
      var payLoad: any={
        question:data,
        userContext: this.user
      };
       
        if(this.questions.find(item=>item.question==data.question&&item.questionType==data.questionType&&item.questionsCategory.uuid==data.questionsCategory.uuid))
        {
          this.openSnackBar("Esta Questão ja esta registada! Contacte o Administrador.", "OK");
          this.isDisabled=false;
      }
      else{
        this.questionsService.createQuestion(payLoad).subscribe(data => {
        },error=>{
        },
        ()=>{
          this.openSnackBar("A Questão foi adicionada com sucesso!", "OK");
          this.isAdded=true;
          this.isDisabled=false;
        }
        );
      } 

    }else{
      this.openSnackBar("Seleccione a categoria!", "OK");
    }

   
  }


  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 4000,
    });
  }

  addQuestionsCategory(): void {
    window.sessionStorage.removeItem("questionsCategory");
    window.sessionStorage.setItem("questionsCategory",JSON.stringify(this.questionsCategory));

    const dialogRef = this.dialog.open(DialogQuestionsCategoryAdd, {
      disableClose:true,
      width: '1200px',
      height: '750px',
      data: new QuestionCategory()
    }); 
  }

  reloadQuestionsCategory(){
    this.questionsCategory = [];
    this.questionsService.findQuestionCategories()
          .subscribe(data => {
            this.isHidden = ""
            this.questionsCategory = alasql("select * from ? order by category ASC",[data.questionsCategory]);
       },
            error => {
             this.isHidden = "hide";
              this.questionsCategory = [];
            },
            () => {
             this.isHidden = "hide";
            }
          );
  }

}

@Component({
  selector: 'questions-category-new-dialog',
  templateUrl: 'questions-category-new-dialog.html',
})
export class DialogQuestionsCategoryAdd implements OnInit{

  public form: FormGroup;
  public isHidden: string;
  public isDisabled;isAdded: boolean;
  public user;questionsCategory: any[];
  
  constructor(
    public questionsService: QuestionsService,
    public dialogRef: MatDialogRef<DialogQuestionsCategoryAdd>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public formBuilder: FormBuilder,
    public snackBar: MatSnackBar,
    public translate: TranslateService) {

      this.form = formBuilder.group({
        category: ['', [
          Validators.required]]
      });

    }

  ngOnInit() {
    this.isAdded=false;
    this.user = JSON.parse(window.sessionStorage.getItem('user'));
    this.questionsCategory=JSON.parse(window.sessionStorage.getItem('questionsCategory'));
  }

  onNoClick(data): void {
    this.dialogRef.close();

    if(this.isAdded==true){
      this.questionsService.callMethodReloadOfComponent();
    }
    else{

    }

    
  }

  onSaveClick(data): void {
    this.isDisabled=true;
    var payLoad: any={
      questionsCategory:data,
      userContext: this.user
    };
     
      if(this.questionsCategory.find(item=>item.category==data.category))
      {
        this.openSnackBar("Esta Categoria de Questão ja esta registada! Contacte o Administrador.", "OK");
        this.isDisabled=false;
    }
    else{
      this.questionsService.createQuestionsCategory(payLoad).subscribe(data => {
      },error=>{
      },
      ()=>{
        this.openSnackBar("A Categoria de Questão foi adicionada com sucesso!", "OK");
        this.isAdded=true;
        this.isDisabled=false;
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