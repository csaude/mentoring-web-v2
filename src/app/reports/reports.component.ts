import { Component, OnInit,Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator,MatDialog, MatDialogRef, MatSort , MatTableDataSource, MAT_DIALOG_DATA, PageEvent,MatSnackBar } from '@angular/material';
import { ReportsService } from "./shared/report.service";
import { Report } from "./shared/report";
import {ExcelService} from '../resources/shared/excel.service';
import * as alasql from 'alasql';
import { TranslateService } from 'ng2-translate';

import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})

/** 
* @author Damasceno Lopes <damascenolopess@gmail.com>
*/
export class ReportsComponent implements OnInit {
  public report: Report = new Report();
  public isHidden: string;
  public reports;reports1: any[]=[];
  public ROLE_HIS;
  public form: FormGroup;
  public name: string;
  public code: string;
  public surname: string;
  public phone: string;
  public total: number;

  public isClosed;samples;analyse;sessions;sessionslist;hts;narrative;indicators: boolean;

  public from;until;
  
  @ViewChild(MatPaginator,{static: false}) paginator: MatPaginator;
  @ViewChild(MatSort,{static: false}) sort: MatSort;

  public pageEvent: PageEvent;
  public displayedColumns: string[] = ['district','hf','form','samples_collected','samples_reffered','samples_rejected','results_received'];

  public displayedColumnsAnalyse: string[] = ['form','samples_collected','samples_reffered','samples_rejected','results_received','samples_reffered_p','samples_rejected_p','results_received_p','results_received_p_total'];
  
  public displayedColumnsSessions: string[] = ['form','total'];

  public displayedColumnsSessionsList: string[] = ['form','date_send','date_session','district','hf','cabinet','tutor','position','start','end','state'];

  public displayedColumnsSessionsHTS: string[] = ['district','hf','date_session','tutor','tutored','cabinet','door','time_of_day','q1','q2','q3','q4','q5'];

  public displayedColumnsSessionsNarrative: string[] = ['district','saaj','htcLink','smi','stiAdultsPrison','ctAdultsPrison','ctAdults','apss','adultVl','tbHiv','tpi','nutrition'];

  constructor(
    public excelService:ExcelService,
    public datepipe: DatePipe,
    public reportsService: ReportsService,
    public formBuilder: FormBuilder,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    public translate: TranslateService) {
    this.form = formBuilder.group({
      from: [],
      until: [],
    });

    this.reportsService.invokeEvent.subscribe(value => {
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

    this.isClosed = true;
    this.samples = false;
    this.analyse = false;
    this.sessions = false;
    this.sessionslist = false;
    this.hts = false;
    this.narrative = false;


  }

  getPage() {
    this.reports = [];
    this.reports1 = [];
    this.isHidden = "";
    this.reportsService.findSampleReports(this.from, this.until)
      .subscribe(data => {

        if(data&&!data.sampleIndicator.length){
          this.reports1.push(data.sampleIndicator);
          this.reports = new MatTableDataSource(this.reports1);
          
        }
        else  if(data&&data.sampleIndicator.length>1){
            this.reports1=data.sampleIndicator;
            this.reports = new MatTableDataSource(this.reports1);
            this.reports.sort = this.sort;
            this.reports.paginator = this.paginator;
        
          }
          
          else{
            this.isHidden = "hide";
            this.reports = [];
            this.reports1 = [];
          } 
      },
        error => {
          this.isHidden = "hide";
          this.reports = [];
          this.reports1 = [];
        },
        () => {
          this.total=this.reports1.length;
          this.isHidden = "hide";
        }
      );
  }


  getPageAnalyse() {
    this.reports = [];
    this.reports1 = [];
    this.isHidden = "";
    this.reportsService.findAnalysisTables(this.from, this.until)
      .subscribe(data => {
      
        if(data&&!data.analysisTable.length){
          this.reports1.push(data.analysisTable);
          this.reports = new MatTableDataSource(this.reports1);
          
        }
        else   if(data&&data.analysisTable.length>1){
            this.reports1=data.analysisTable;
            this.reports = new MatTableDataSource(this.reports1);
            this.reports.sort = this.sort;
            this.reports.paginator = this.paginator;
            
          }
          
          else{
            this.isHidden = "hide";
            this.reports = [];
            this.reports1 = [];
          } 
      },
        error => {
          this.isHidden = "hide";
          this.reports = [];
          this.reports1 = [];
        },
        () => {
          this.total=this.reports1.length;
          this.isHidden = "hide";
        }
      );
  }

  getPageSessions() {
    this.reports = [];
    this.reports1 = [];
    this.isHidden = "";
    this.reportsService.findMentoringSessions(this.from, this.until)
      .subscribe(data => {

       
        if(data&&!data.performedSession.length){
          this.reports1.push(data.performedSession);
          this.reports = new MatTableDataSource(this.reports1);
          
        }
        else if(data&&data.performedSession.length>1){
            this.reports1=data.performedSession;
            this.reports = new MatTableDataSource(this.reports1);
            this.reports.sort = this.sort;
            this.reports.paginator = this.paginator;
            
          }
          
          else{
            this.isHidden = "hide";
            this.reports = [];
            this.reports1 = [];
          } 
      },
        error => {
          this.isHidden = "hide";
          this.reports = [];
          this.reports1 = [];
        },
        () => {
          this.total=this.reports1.length;
          this.isHidden = "hide";
        }
      );
  }

  getPageSessionsList() {
    this.reports = [];
    this.reports1 = [];
    this.isHidden = "";
    this.reportsService.findMentoringSessionsList(this.from, this.until)
      .subscribe(data => {
      

        if(data&&!data.performedSession.length){
          this.reports1.push(data.performedSession);
          this.reports = new MatTableDataSource(this.reports1);
          
        }
        else if(data&&data.performedSession.length>1){
            this.reports1=data.performedSession;
            this.reports = new MatTableDataSource(this.reports1);
            this.reports.sort = this.sort;
            this.reports.paginator = this.paginator;
            
          }
          
          else{
            this.isHidden = "hide";
            this.reports = [];
            this.reports1 = [];
          } 
      },
        error => {
          this.isHidden = "hide";
          this.reports = [];
          this.reports1 = [];
        },
        () => {
          this.total=this.reports1.length;
          this.isHidden = "hide";
        }
      );
  }

  getPageSessionsHTS() {
    this.reports = [];
    this.reports1 = [];
    this.isHidden = "";
    this.reportsService.findMentoringSessionsHTS(this.from, this.until)
      .subscribe(data => {
      

        if(data&&!data.performedSession.length){
          this.reports1.push(data.performedSession);
          this.reports = new MatTableDataSource(this.reports1);
          
        }
        else if(data&&data.performedSession.length>1){
            this.reports1=data.performedSession;
            this.reports = new MatTableDataSource(this.reports1);
            this.reports.sort = this.sort;
            this.reports.paginator = this.paginator;
            
          }
          
          else{
            this.isHidden = "hide";
            this.reports = [];
            this.reports1 = [];
          } 
      },
        error => {
          this.isHidden = "hide";
          this.reports = [];
          this.reports1 = [];
        },
        () => {
          this.total=this.reports1.length;
          this.isHidden = "hide";
        }
      );
  }

  getPageSessionsNarrative() {
    this.reports = [];
    this.reports1 = [];
    this.isHidden = "";
    this.reportsService.findMentoringSessionsNarrative(this.from, this.until)
      .subscribe(data => {
      

        if(data&&!data.performedSession.length){
          this.reports1.push(data.performedSession);
          this.reports = new MatTableDataSource(this.reports1);
          
        }
        else if(data&&data.performedSession.length>1){
            this.reports1=data.performedSession;
            this.reports = new MatTableDataSource(this.reports1);
            this.reports.sort = this.sort;
            this.reports.paginator = this.paginator;
            
          }
          
          else{
            this.isHidden = "hide";
            this.reports = [];
            this.reports1 = [];
          } 
      },
        error => {
          this.isHidden = "hide";
          this.reports = [];
          this.reports1 = [];
        },
        () => {
          this.total=this.reports1.length;
          this.isHidden = "hide";
        }
      );
  }

  getPageSessionsIndicators() {
    this.reports = [];
    this.reports1 = [];
    this.isHidden = "";
    this.reportsService.findMentoringSessionsIndicators(this.from, this.until)
      .subscribe(data => {
      

        if(data&&!data.performedSession.length){
          this.reports1.push(data.performedSession);
          this.reports = new MatTableDataSource(this.reports1);
          
        }
        else if(data&&data.performedSession.length>1){
            this.reports1=data.performedSession;
            this.reports = new MatTableDataSource(this.reports1);
            this.reports.sort = this.sort;
            this.reports.paginator = this.paginator;
            
          }
          
          else{
            this.isHidden = "hide";
            this.reports = [];
            this.reports1 = [];
          } 
      },
        error => {
          this.isHidden = "hide";
          this.reports = [];
          this.reports1 = [];
        },
        () => {
          this.total=this.reports1.length;
          this.isHidden = "hide";
        }
      );
  }


  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 4000,
    });
  }

  getSamples(){
    this.isClosed=false;
    this.samples = true;
    this.analyse = false;
    this.sessions = false;
    this.sessionslist = false;
    this.indicators = false;
    this.hts = false;
    this.narrative = false;
    this.reports1=[];
    this.reports = new MatTableDataSource(this.reports1);
  }

  getAnalyse(){
    this.indicators = false;
    this.isClosed=false;
    this.samples = false;
    this.analyse = true;
    this.sessions = false;
    this.sessionslist = false;
    this.hts = false;
    this.narrative = false;
    this.reports1=[];
    this.reports = new MatTableDataSource(this.reports1);
  }

  getSessions(){
    this.indicators = false;
    this.isClosed=false;
    this.samples = false;
    this.analyse = false;
    this.sessions = true;
    this.sessionslist = false;
    this.hts = false;
    this.narrative = false;
    this.reports1=[];
    this.reports = new MatTableDataSource(this.reports1);
  }

  getSessionsList(){
    this.indicators = false;
    this.isClosed=false;
    this.samples = false;
    this.analyse = false;
    this.sessions = false;
    this.sessionslist = true;
    this.hts = false;
    this.narrative = false;
    this.reports1=[];
    this.reports = new MatTableDataSource(this.reports1);
  }

  getHTS(){
    this.indicators = false;
    this.isClosed=false;
    this.samples = false;
    this.analyse = false;
    this.sessions = false;
    this.sessionslist = false;
    this.hts = true;
    this.narrative = false;
    this.reports1=[];
    this.reports = new MatTableDataSource(this.reports1);
  }

  getNarrative(){
    this.indicators = false;
    this.isClosed=false;
    this.samples = false;
    this.analyse = false;
    this.sessions = false;
    this.sessionslist = false;
    this.hts = false;
    this.narrative = true;
    this.reports1=[];
    this.reports = new MatTableDataSource(this.reports1);
  }

  getIndicators(){
    this.indicators = true;
    this.isClosed=false;
    this.samples = false;
    this.analyse = false;
    this.sessions = false;
    this.sessionslist = false;
    this.hts = false;
    this.narrative = false;
    this.reports1=[];
    this.reports = new MatTableDataSource(this.reports1);
  }

  search() {
    var userValue = this.form.value
    if ((userValue.from != "" && userValue.from != null) && (userValue.until != "" && userValue.until != null)) {
      this.from = this.datepipe.transform(userValue.from, 'dd-MM-yyyy');
      this.until = this.datepipe.transform(userValue.until, 'dd-MM-yyyy');

      if(this.samples){
        this.getPage();
      }else if(this.analyse){
        this.getPageAnalyse();
      }else if(this.sessions){
        this.getPageSessions();
      }else if(this.sessionslist){
        this.getPageSessionsList();
      }else if(this.hts){
        this.getPageSessionsHTS();
      }else if(this.narrative){
        this.getPageSessionsNarrative();
      }else if(this.indicators){
        this.getPageSessionsIndicators();
      }

    }else{
this.openSnackBar("Deve seleccionar a Data Inicial e a Data Final","OK");
    }
    
  }

  printListExcel() {
    if(this.samples){
          var report = alasql("SELECT district AS [Distrito],healthFacility AS [Unidade Sanitária],form AS [Formulário],collectedSamples AS [Amostras Colhidas],transportedSamples AS [Amostras Referidas],rejectedSamples AS [Amostras Rejeitadas],receivedSamples AS [Resultados Recebidos] FROM ?", [this.reports1]);
          this.excelService.exportAsExcelFile(report, 'Sistema de Tutoria, Relatório de Amostras ' + this.datepipe.transform(new Date(), 'dd-MM-yyyy HHmm'));
    }else if(this.analyse){
      var report = alasql("SELECT form AS [Formulário],collectedSamples AS [Amostras Colhidas],referredSamples AS [Amostras Referidas],rejectedSamples AS [Amostras Rejeitadas],receivedResult AS [Resultados Recebidos],transportation AS [Transporte (%)],rejection AS [Rejeição (%)],result AS [Resultado (%)],totalResult AS [Resultado Total (%)] FROM ?", [this.reports1]);
      this.excelService.exportAsExcelFile(report, 'Sistema de Tutoria, Tabela de Analises ' + this.datepipe.transform(new Date(), 'dd-MM-yyyy HHmm'));
}else if(this.sessions){
  var report = alasql("SELECT formName AS [Nome do Formulário],totalPerformed AS [Total] FROM ?", [this.reports1]);
  this.excelService.exportAsExcelFile(report, 'Sistema de Tutoria, Sessões de Tutoria ' + this.datepipe.transform(new Date(), 'dd-MM-yyyy HHmm'));
}else if(this.sessionslist){
  var report = alasql("SELECT formName AS [Nome do Formulário],createdAt AS [Data de Envio],performedDate AS [Data da Sessão],district AS [Distrito],healthFacility AS [Unidade Sanitária],cabinet AS [Gabinete],tutorName AS [Tutor], position AS [Position], startDate AS [Início], endDate AS [Fim], status AS [Estado] FROM ?", [this.reports1]);
  this.excelService.exportAsExcelFile(report, 'Sistema de Tutoria, Sessões de Tutoria ' + this.datepipe.transform(new Date(), 'dd-MM-yyyy HHmm'));
}else if(this.hts){
  var report = alasql("SELECT district AS [Distrito],healthFacility AS [Unidade Sanitária], performedDate AS [Data da Sessão],district AS [Distrito],healthFacility AS [Unidade Sanitária],tutorName AS [Tutor],tutoredName AS [Tutorado],cabinet AS [Sector],door AS [Porta], timeOfDay AS [Período],atendidos AS [NUMERO DE PACIENTES ATENDIDOS POR DIA],previos AS [NUMERO DE INDIVIDUOS QUE SABEM QUE SAO HIV POSITIVOS],testados AS [NUMERO DE INDIVIDUOS TESTADOS],positivos AS [NUMERO DE INDIVIDUOS COM TESTE POSITIVO],inscritos AS [NUMERO DE INDIVIDUOS INSCRITOS NOS CUIDADOS E TRATAMENTO DO HIV],createdAt AS [Data de Envio] FROM ?", [this.reports1]);
  this.excelService.exportAsExcelFile(report, 'Sistema de Tutoria, Monitoria do ATS ' + this.datepipe.transform(new Date(), 'dd-MM-yyyy HHmm'));
}else if(this.narrative){
  var report = alasql("SELECT district AS [Province],saaj AS [# of HTC mentoring sessions taking place at SAAJ],htcLink AS [# of mentoring sessions on HTC linkages],smi AS [# of ANC mentoring sessions],stiAdultsPrison AS [# of STI screening-specific clinical mentoring sessions for (new) prisoners on ART],ctAdultsPrison AS [# of adult ART-specific clinical mentoring sessions in prisons],ctAdults AS [# of adult ART-specific clinical mentoring sessions],apss AS [# of PHDP-specific clinical mentoring sessions],adultVl AS [# of adult VL specific clinical mentoring sessions],tbHiv AS [# of TB/HIV-specific clinical mentoring sessions performed in the HIV C&T setting],tpi AS [# of adult INH specific clinical mentoring sessions],nutrition AS [# of nutrition-specific clinical mentoring sessions for adults] FROM ?", [this.reports1]);
  this.excelService.exportAsExcelFile(report, 'Sistema de Tutoria, Dados para o Narrativo ' + this.datepipe.transform(new Date(), 'dd-MM-yyyy HHmm'));
}else if(this.indicators){
  var report = alasql("SELECT formName AS [Nome do Formulário],totalPerformed AS [Total] FROM ?", [this.reports1]);
  this.excelService.exportAsExcelFile(report, 'Sistema de Tutoria, Sessões de Tutoria ' + this.datepipe.transform(new Date(), 'dd-MM-yyyy HHmm'));
}


        }

  
}

