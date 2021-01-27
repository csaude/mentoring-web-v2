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

  public isClosed;samples;analyse;sessions;sessionslist;hts;narrative;indicators;indicatorslist;pmqtr;narrativeCOP20;pmqtrlist: boolean;

  public from;until;
  
  @ViewChild(MatPaginator,{static: false}) paginator: MatPaginator;
  @ViewChild(MatSort,{static: false}) sort: MatSort;

  public pageEvent: PageEvent;
  public displayedColumns: string[] = ['district','hf','form','samples_collected','samples_reffered','samples_rejected','results_received'];

  public displayedColumnsAnalyse: string[] = ['form','samples_collected','samples_reffered','samples_rejected','results_received','samples_reffered_p','samples_rejected_p','results_received_p','results_received_p_total'];
  
  public displayedColumnsSessions: string[] = ['form','total'];

  public displayedColumnsSessionsList: string[] = ['form','date_send','date_session','district','hf','cabinet','tutor','position','start','end','state'];

  public displayedColumnsSessionsHTS: string[] = ['district','hf','date_session','tutor','tutored','cabinet','door','time_of_day','q1','q2','q3','q4','q5'];

  public displayedColumnsSessionsNarrative: string[] = ['district','preventionVCT','preventionPICT','preventionIndexCase','preventionSaaj','preventionHtcLink','preventionANC','ctStiAdultsPrison','ctAdultsPrison','ctAdultsVLPrison','ctTbHiv','ctApss','ctAdults','ctAdultsVL','ctInh','ctNutrition','ctApssTutoreds','ctApssSessions','ctEAC','ctCervical','tbSessions','tbSessionsCt','tbInh','tbSessionsPediatric','pediatricNutrition','pediatricStarART','pediatricAMA','pediatricTB','pediatricVL'];

  public displayedColumnsPopList: string[] = ['district','hf','date_session','tutor','form','elaborado','aprovado','revisado'];

  public displayedColumnsSessionsPMQTR: string[] = ['district','hf','date_session','tutor','tutored','cabinet','i1','i2','i3','i4','i5','i6','i7','i8'];

  public displayedColumnsSessionsNarrativeCOP20: string[] = ['district','ind_11061','ind_11011','ind_11031','ind_11041','ind_11043','ind_11073','ind_42','ind_10043','ind_10045','ind_04071','ind_04073','ind_04041','ind_04077','ind_04061','ind_15051','ind_06044','ind_02041','ind_01102','ind_01031','ind_01142','ind_02063','ind_01116','ind_02071','ind_02021','ind_02023','ind_08051','ind_03029','ind_030211','ind_030213','ind_03011','ind_03013','ind_05012','ind_05031','ind_05061','ind_05052','ind_05054','ind_05057','ind_19051','ind_19015'];


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
    this.narrativeCOP20 = false;
    this.indicators = false;
    this.indicatorslist = false;
    this.pmqtr=false;
    this.pmqtrlist=false;


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

  getPageSessionsIndicatorsList() {
    this.reports = [];
    this.reports1 = [];
    this.isHidden = "";
    this.reportsService.findMentoringSessionsIndicatorsList(this.from, this.until)
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


  getPageSessionsPMQTR() {
    this.reports = [];
    this.reports1 = [];
    this.isHidden = "";
    this.reportsService.findMentoringSessionsPMQTR(this.from, this.until)
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


  getPageSessionsPMQTRList() {
    this.reports = [];
    this.reports1 = [];
    this.isHidden = "";
    this.reportsService.findMentoringSessionsPMQTRList(this.from, this.until)
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
          var report = alasql("SELECT district AS [Distrito],healthFacility AS [Unidade Sanitária], performedDate AS [Data da Sessão],tutorName AS [Tutor],tutoredName AS [Tutorado],MTQ00000751 AS [TODOS OS PROVEDORES RECEBERAM FORMACAO ABRANGENTE SOBRE A TESTAGEM RAPIDA DE HIV UTILIZANDO O CURRICULO APROVADO A NIVEL NACIONAL?],MTQ00000752 AS [OS PROVEDORES RECEBERAM FORMACAO SOBRE A UTILIZACAO DE LIVROS DE REGISTO/REGISTOS DE TESTAGEM DE HIV PADRONIZADOS?],MTQ00000753 AS [OS PROVEDORES RECEBERAM FORMACAO SOBRE AVALIACAO EXTERNA DA QUALIDADE (AEQ) OU SOBRE O PROCESSO DE TESTES DE PROFICIENCIA (TP)?],MTQ00000754 AS [OS PROVEDORES RECEBERAM FORMACAO SOBRE O PROCESSO DE CONTROLO DE QUALIDADE (CQ)?],MTQ00000755 AS [OS PROVEDORES RECEBERAM FORMACAO EM PROCEDIMENTOS E PRATICAS DE SEGURANCA E DE GESTAO DE RESIDUOS?],MTQ00000756 AS [TODOS OS PROVEDORES RECEBERAM UMA FORMACAO DE RECICLAGEM NOS ULTIMOS DOIS ANOS?],MTQ00000757 AS [EXISTEM REGISTOS COM INDICACAO DE QUE TODOS OS PROVEDORES DEMONSTRARAM COMPETENCIAS DE TESTAGEM RAPIDA DE HIV ANTES DA TESTAGEM DOS CLIENTES?],MTQ00000758 AS [TODOS OS PROVEDORES/TESTADORES RECEBERAM CERTIFICACAO ATRAVES DE UM PROGRAMA DE CERTIFICACAO NACIONAL?],MTQ00000759 AS [OS TESTES DE HIV SAO REALIZADOS APENAS POR PROVEDORESCERTIFICADOS?],MTQ00000760 AS [E NECESSARIO QUE TODOS OS PROVEDORES SEJAM RE-CERTIFICADOS PERIODICAMENTE (ISTO E, A CADA DOIS ANOS)?],MTQ00000761 AS [EXISTE UMA AREA INDICADA PARA A TESTAGEMRAPIDA DE HIV?],MTQ00000762 AS [A AREA DE TESTAGEM ESTA LIMPA E ORGANIZADA PARA A TESTAGEM RAPIDA DE HIV?],MTQ00000763 AS [EXISTE ILUMINACAO SUFICIENTE NA AREA DE TESTAGEM?],MTQ00000764 AS [OS KITS DE TESTE SAO MANTIDOS NUM AMBIENTE DE TEMPERATURA CONTROLADA COM BASE NAS INSTRUCOES DOS FABRICANTES?],MTQ00000765 AS [O ESPACO DE CONSERVACAO DE KITS DE TESTES E OUTROS CONSUMIVEIS E SUFICIENTE E SEGURO?],MTQ00000766 AS [EXISTEM POP E/OU AUXILIARES DE TRABALHO EM VIGOR PARA IMPLEMENTAR PRATICAS DE SEGURANCA?],MTQ00000767 AS [EXISTEM POP E/OU AUXILIARES DE TRABALHO NO LOCAL SOBRE A TRATAMENTO DE RESIDUOS INFECIOSOS E NAO INFECIOSOS?],MTQ00000768 AS [EXISTEM POP E/OU AUXILIARES DE TRABALHO NO LOCAL SOBRE COMO LIDAR COM DERRAMES DE SANGUE E OUTROS FLUIDOS CORPORAIS?],MTQ00000769 AS [EXISTEM POP E/OU AUXILIARES DE TRABALHO NO LOCAL PARA LIDAR COM A EXPOSICAO ACIDENTAL A FLUIDOS CORPORAIS POTENCIALMENTE INFECIOSOS ATRAVES DE LESAO POR PICADA DE AGULHA, DERRAME OU LESOES POR OBJETOS PERFUROCORTANTES?],MTQ00000770 AS [EXISTE EQUIPAMENTO DE PROTECAO INDIVIDUAL (EPI) SEMPRE DISPONIVEL PARA OS PROVEDORES?],MTQ00000771 AS [O EPI E UTILIZADO DE FORMA CONSISTENTE POR TODOS OS AVALIADORES?],MTQ00000772 AS [O EPI E CORRETAMENTE UTILIZADO POR TODOS OS AVALIADORES DURANTE TODO O PROCESSO DE TESTAGEM?],MTQ00000773 AS [EXISTE AGUA LIMPA E SABAO DISPONIVEIS PARA A LAVAGEM DAS MAOS?],MTQ00000774 AS [EXISTE UM DESINFETANTE APROPRIADO PARA LIMPAR A AREA DE TRABALHO DISPONIVEL?],MTQ00000775 AS [OS RESIDUOS PERFURO-CORTANTES, INFECIOSOS E NAO INFECIOSOS SAO MANUSEADOS DE FORMA ADEQUADA?],MTQ00000776 AS [OS RECIPIENTES DE RESIDUOS INFECIOSOS E NAO INFECIOSOS SAO ESVAZIADOS REGULARMENTE DE ACORDO COM O POP E/OU AUXILIARES DE TRABALHO?],MTQ00000777 AS [EXISTENO LOCAL DE TESTAGEM ORIENTACOES/DIRETRIZES NACIONAIS DE ACONSELHAMENTO E TESTAGEM EM SAUDE (ATS)?],MTQ00000778 AS [ESTA A SER USADO O ALGORITMO DE TESTAGEM DE HIV NACIONAL?],MTQ00000779 AS [EXISTE UM PROCESSO NO LOCAL PARA UM ALGORITMO DE TESTAGEM DE HIV ALTERNATIVO, EM CASO DE KIT(S) DE TESTE FORA DO PRAZO DE VALIDADE OU FALTA DE KIT(S)?],MTQ00000780 AS [EXISTEM POP E/OU AUXILIARES DE TRABALHO NO LOCAL PARA CADA TESTE RAPIDO DE HIV UTILIZADO NO ALGORITMO DE TESTAGEM?],MTQ00000781 AS [ESTAO ATUALMENTE DISPONIVEIS PARA UTILIZACAO APENAS KITS RAPIDOS DE HIV APROVADOS A NIVEL NACIONAL?],MTQ00000782 AS [TODOS OS KITS DE TESTE QUE ESTAO ATUALMENTE A SER UTILIZADOS ESTAO DENTRO DO PRAZO DE VALIDADE?],MTQ00000783 AS [OS KITS DE TESTE SAO IDENTIFICADOS COM DATA DE RECECAO E INICIAIS?],MTQ00000784 AS [EXISTE UM PROCESSO EM VIGOR PARA GESTAO DE STOCKS?],MTQ00000785 AS [ESTAO DISPONIVEIS E AFIXADOS NO LOCAL DE TESTAGEM AUXILIARES DE TRABALHO SOBRE A COLHEITA DE AMOSTRAS DOS CLIENTES?],MTQ00000786 AS [EXISTEM CONSUMIVEIS SUFICIENTES DISPONIVEIS PARA COLHEITA DE AMOSTRAS DE CLIENTES?],MTQ00000787 AS [EXISTEM ORIENTACOES NACIONAIS QUE DESCREVAM COMO A IDENTIFICACAO DOS CLIENTES DEVE SER FEITA NO REGISTO DE TESTAGEM DE HIV?],MTQ00000788 AS [OS ELEMENTOS DE IDENTIFICACAO DOS CLIENTES SAO REGISTADOSNO REGISTO DE TESTAGEM DE HIVE NOS DISPOSITIVOS DO TESTE DE ACORDO COM AS ORIENTACOES NACIONAIS?],MTQ00000789 AS [ESTAO DISPONIVEIS E AFIXADOS NO LOCAL DE TESTAGEM POP E/OU AUXILIARES DE TRABALHO SOBRE PROCEDIMENTOS DE TESTAGEM DE HIV?],MTQ00000790 AS [ESTAO DISPONIVEIS CRONOMETROS? E SAO USADOS ROTINEIRAMENTE NA TESTAGEM RAPIDA DE HIV?],MTQ00000791 AS [OS DISPOSITIVOS DE COLHEITA DE AMOSTRA (P. EX., TUBO CAPILAR, ANSA, PIPETAS DESCARTAVEIS, ETC.) SAO UTILIZADOS CORRETAMENTE?],MTQ00000792 AS [OS PROCEDIMENTOS DE TESTAGEM FORAM SEGUIDOS DE FORMA ADEQUADA?],MTQ00000793 AS [ESTAO A SER UTILIZADAS REGULARMENTE (P. EX., DIARIAMENTE OU SEMANALMENTE) AMOSTRAS DE CONTROLO DE QUALIDADE (CQ) POSITIVO E NEGATIVO DE ACORDO COM AS ORIENTACOES DO PAIS?],MTQ00000794 AS [OS RESULTADOS DO CQ FORAM DEVIDAMENTE REGISTADOS?],MTQ00000795 AS [OS RESULTADOS DO CQ INCORRETOS/INVALIDOS SAO DEVIDAMENTE REGISTADOS?],MTQ00000796 AS [FORAM ADOTADAS E DOCUMENTADAS MEDIDAS ADEQUADAS QUANDO OS RESULTADOS DE CQ FORAM INCORRETOS E/OU INVALIDOS?],MTQ00000797 AS [OS REGISTOS DE CQ SAO ANALISADOS PELA PESSOA ENCARREGADA DE FORMA ROTINEIRA?],MTQ00000798 AS [EXISTE UM REGISTO/LIVRO DE REGISTO DE TESTAGEM RAPIDA DE HIV PADRONIZADO NACIONAL DISPONIVEL E A SER UTILIZADO?],MTQ00000799 AS [O LIVRO DE REGISTO/REGISTO DE TESTAGEM DE HIV INCLUI TODOS OS ELEMENTOS DE QUALIDADE IMPORTANTES?],MTQ00000800 AS [TODOS OS ELEMENTOS NO REGISTO/LIVRO DE REGISTO SAO REGISTADOS CORRETAMENTE (P. EX., DADOS DEMOGRAFICOS DOS CLIENTES, NOMES DE KITS, NUMEROS DE LOTES, PRAZOS DE VALIDADE, NOME DO AVALIADOR, RESULTADOS DE HIV INDIVIDUAIS E FINAIS, ETC.)?],MTQ00000801 AS [O RESUMO TOTAL NO FINAL DE CADA PAGINA DOS LIVROS DE REGISTO E CUMPRIDO DE FORMA PRECISA?],MTQ00000802 AS [FORAM REGISTADOS RESULTADOS DE TESTE INVALIDOS NO LIVRO DE REGISTO?],MTQ00000803 AS [OS TESTES INVALIDOS FORAM REPETIDOS E OS RESULTADOS FORAM DEVIDAMENTEREGISTADOS NO LIVRO DE REGISTO?],MTQ00000804 AS [TODOS OS DOCUMENTOS E REGISTOS DOS CLIENTES SAO MANTIDOS EM SEGURANCA DURANTE TODAS AS FASES DO PROCESSO DE TESTAGEM?],MTQ00000805 AS [TODOS OS LIVROS DE REGISTO E OUTROS DOCUMENTOS SAO GUARDADOS EM LOCAL SEGURO QUANDO NAO ESTAO A SER UTILIZADOS?],MTQ00000806 AS [ESTAO OS REGISTOS/LIVROS DE REGISTOS DEVIDAMENTE IDENTIFICADOS E ARQUIVADOS QUANDO COMPLETOS?],MTQ00000807 AS [O LOCAL DE TESTAGEM ESTA INSCRITO NO PROGRAMA DE AVALIACAO EXTERNA DE QUALIDADE DO HIV?],MTQ00000808 AS [TODOS OS PROVEDORES NO LOCAL DE TESTAGEM EFETUAM TESTES NAS AMOSTRAS DE AVALIACAO EXTERNA DE QUALIDADE?],MTQ00000809 AS [A PESSOA RESPONSAVELPELO LOCAL DE TESTAGEM ANALISA OS RESULTADOS DE PAINEIS DE PROFICIENCIA ANTES DE SEREM ENVIADOS PARA O PROVEDOR DOS PAINEIS DE PROFICIENCIA (INS OU OUTRO)OU DESIGNADO?],MTQ00000810 AS [E RECEBIDO UM RELATORIO DE AVALIACAO EXTERNA DE QUALIDADE DO INS OU OUTRO PROVEDOR E E ANALISADO PELO PROVEDOR E/OU PELA PESSOA RESPONSAVEL PELO LOCAL DE TESTAGEM?],MTQ00000811 AS [O PONTO DE TESTAGEM IMPLEMENTA MEDIDAS CORRETIVAS EM CASO DE RESULTADOS INSATISFATORIOS?],MTQ00000812 AS [O PONTO DE TESTAGEM RECEBE VISITAS DE SUPERVISAO PERIODICAS?],MTQ00000813 AS [E FORNECIDO FEEDBACK DURANTE A VISITA DE SUPERVISAO? E DOCUMENTADO?],MTQ00000814 AS [SE OS PROVEDORES PRECISAREM DE FORMACAO DE RECICLAGEM, A FORMACAO OCORRE DURANTE A VISITA DE SUPERVISAO?],MENTORING_ID AS [MENTORING_ID] FROM ?", [this.reports1]);
          this.excelService.exportAsExcelFile(report, 'Sistema de Tutoria, Monitoria do ATS ' + this.datepipe.transform(new Date(), 'dd-MM-yyyy HHmm'));

        }
      );
  }


  getPageSessionsNarrativeCOP20() {
    this.reports = [];
    this.reports1 = [];
    this.isHidden = "";
    this.reportsService.findMentoringSessionsNarrativeCOP20(this.from, this.until)
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
    this.narrativeCOP20 = false;
    this.indicatorslist = false;
    this.pmqtr = false;this.pmqtrlist=false;
    this.reports1=[];
    this.reports = new MatTableDataSource(this.reports1);
  }

  getAnalyse(){
    this.indicatorslist = false;
    this.indicators = false;
    this.isClosed=false;
    this.samples = false;
    this.analyse = true;
    this.sessions = false;
    this.sessionslist = false;
    this.hts = false;
    this.narrative = false;this.narrativeCOP20 = false;
    this.pmqtr = false;this.pmqtrlist=false;
    this.reports1=[];
    this.reports = new MatTableDataSource(this.reports1);
  }

  getSessions(){
    this.indicatorslist = false;
    this.indicators = false;
    this.isClosed=false;
    this.samples = false;
    this.analyse = false;
    this.sessions = true;
    this.sessionslist = false;
    this.hts = false;
    this.narrative = false;this.narrativeCOP20 = false;
    this.pmqtr = false;this.pmqtrlist=false;
    this.reports1=[];
    this.reports = new MatTableDataSource(this.reports1);
  }

  getSessionsList(){
    this.indicatorslist = false;
    this.indicators = false;
    this.isClosed=false;
    this.samples = false;
    this.analyse = false;
    this.sessions = false;
    this.sessionslist = true;
    this.hts = false;
    this.narrative = false;this.narrativeCOP20 = false;
    this.pmqtr = false;this.pmqtrlist=false;
    this.reports1=[];
    this.reports = new MatTableDataSource(this.reports1);
  }

  getHTS(){
    this.indicatorslist = false;
    this.indicators = false;
    this.isClosed=false;
    this.samples = false;
    this.analyse = false;
    this.sessions = false;
    this.sessionslist = false;
    this.hts = true;
    this.narrative = false;this.narrativeCOP20 = false;
    this.pmqtr = false;this.pmqtrlist=false;
    this.reports1=[];
    this.reports = new MatTableDataSource(this.reports1);
  }

  getIndicatorsPMQTR(){
    this.indicatorslist = false;
    this.indicators = false;
    this.isClosed=false;
    this.samples = false;
    this.analyse = false;
    this.sessions = false;
    this.sessionslist = false;
    this.hts = false;
    this.narrative = false;this.narrativeCOP20 = false;
    this.pmqtr = true;this.pmqtrlist=false;
    this.reports1=[];
    this.reports = new MatTableDataSource(this.reports1);
  }

  getNarrative(){
    this.indicatorslist = false;
    this.indicators = false;
    this.isClosed=false;
    this.samples = false;
    this.analyse = false;
    this.sessions = false;
    this.sessionslist = false;
    this.hts = false;
    this.narrative = true;this.narrativeCOP20 = false;
    this.pmqtr = false;this.pmqtrlist=false;
    this.reports1=[];
    this.reports = new MatTableDataSource(this.reports1);
  }

  getIndicators(){
    this.indicatorslist = false;
    this.indicators = true;
    this.isClosed=false;
    this.samples = false;
    this.analyse = false;
    this.sessions = false;
    this.sessionslist = false;
    this.hts = false;
    this.narrative = false;this.narrativeCOP20 = false;
    this.pmqtr = false;this.pmqtrlist=false;
    this.reports1=[];
    this.reports = new MatTableDataSource(this.reports1);
  }

  getIndicatorsList(){
    this.indicatorslist = true;
    this.indicators = false;
    this.isClosed=false;
    this.samples = false;
    this.analyse = false;
    this.sessions = false;
    this.sessionslist = false;
    this.hts = false;
    this.narrative = false;this.narrativeCOP20 = false;
    this.pmqtr = false;this.pmqtrlist=false;
    this.reports1=[];
    this.reports = new MatTableDataSource(this.reports1);
  }

  getNarrativeCOP20(){
    this.indicatorslist = false;
    this.indicators = false;
    this.isClosed=false;
    this.samples = false;
    this.analyse = false;
    this.sessions = false;
    this.sessionslist = false;
    this.hts = false;
    this.narrative = false;this.narrativeCOP20 = true;
    this.pmqtr = false;this.pmqtrlist=false;
    this.reports1=[];
    this.reports = new MatTableDataSource(this.reports1);
  }

  getPMQTRList(){
    this.indicatorslist = false;
    this.indicators = false;
    this.isClosed=false;
    this.samples = false;
    this.analyse = false;
    this.sessions = false;
    this.sessionslist = false;
    this.hts = false;
    this.narrative = false;this.narrativeCOP20 = false;
    this.pmqtr = false;this.pmqtrlist=true;
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
      else if(this.indicatorslist){
        this.getPageSessionsIndicatorsList();
      }
      else if(this.pmqtr){
        this.getPageSessionsPMQTR();
      }else if(this.narrativeCOP20){
        this.getPageSessionsNarrativeCOP20();
      } else if(this.pmqtrlist){
        this.getPageSessionsPMQTRList();
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
  var report = alasql("SELECT district AS [Distrito],healthFacility AS [Unidade Sanitária], performedDate AS [Data da Sessão],tutorName AS [Tutor],tutoredName AS [Tutorado],cabinet AS [Sector],door AS [Porta], timeOfDay AS [Período],atendidos AS [NUMERO DE PACIENTES ATENDIDOS POR DIA],previos AS [NUMERO DE INDIVIDUOS QUE SABEM QUE SAO HIV POSITIVOS],testados AS [NUMERO DE INDIVIDUOS TESTADOS],positivos AS [NUMERO DE INDIVIDUOS COM TESTE POSITIVO],inscritos AS [NUMERO DE INDIVIDUOS INSCRITOS NOS CUIDADOS E TRATAMENTO DO HIV],createdAt AS [Data de Envio],MENTORING_ID AS [MENTORING_ID] FROM ?", [this.reports1]);
  this.excelService.exportAsExcelFile(report, 'Sistema de Tutoria, Monitoria do ATS ' + this.datepipe.transform(new Date(), 'dd-MM-yyyy HHmm'));
}else if(this.narrative){
  var report = alasql("SELECT district AS [Province],preventionVCT AS [# of HTC mentoring sessions at VCT service points],preventionPICT AS [# of HTC specific mentoring sessions at PITC service points],preventionIndexCase AS [# of HF-level index case testing mentoring sessions to HCWs and lay counselors per month.],preventionSaaj AS [# of HTC mentoring sessions taking place at SAAJ],preventionHtcLink AS [# of mentoring sessions on HTC linkages],preventionANC AS [# of ANC mentoring sessions per quarter],ctStiAdultsPrison AS [# of STI screening-specific clinical mentoring sessions for (new) prisoners on ART],ctAdultsPrison AS [# of adult ART-specific clinical mentoring sessions in prisons],ctAdultsVLPrison AS [# of VL-specific clinical mentoring sessions in prisons],ctTbHiv AS [# of TB/HIV-specific clinical mentoring sessions performed in the HIV care and treatment setting],ctApss AS [# of PHDP-specific clinical mentoring sessions],ctAdults AS [# of adult ART-specific clinical mentoring sessions],ctAdultsVL AS [# of adult VL specific clinical mentoring sessions],ctInh AS [# of adult INH specific clinical mentoring sessions],ctNutrition AS [# of nutrition-specific clinical mentoring sessions for adults],ctApssTutoreds AS [# of HCWs and counselors, who received at least one mentoring session on PSS for improved adherence],ctApssSessions AS [# of PSS mentoring sessions (total)],ctEAC AS [# of EAC-specific clinical mentoring sessions],ctCervical AS [# of Cervical Cancer Screening specific clinical mentoring sessions],tbSessions AS [# of TB screening specific mentoring sessions taking place at clinical consultations],tbSessionsCt AS [# of TB/HIV-specific clinical mentoring sessions performed in the TB C&T setting],tbInh AS [# of INH prophylaxis follow-up mentoring sessions in CCR],tbSessionsPediatric AS [# of pediatric TB/HIV mentoring sessions],pediatricNutrition AS [# of pediatric nutrition-specific clinical mentoring sessions],pediatricStarART AS [# of mentoring sessions on pediatric ART initiation],pediatricAMA AS [# Mentoring sessions on enhanced adherence counseling],pediatricTB AS [# of TB/HIV-specific clinical mentoring sessions performed in the HIV CT setting],pediatricVL AS [# VL specific clinical mentoring sessions] FROM ?", [this.reports1]);
  this.excelService.exportAsExcelFile(report, 'Sistema de Tutoria, Dados para o Narrativo ' + this.datepipe.transform(new Date(), 'dd-MM-yyyy HHmm'));
}else if(this.indicators){
  var report = alasql("SELECT formName AS [Nome do Formulário],totalPerformed AS [Total] FROM ?", [this.reports1]);
  this.excelService.exportAsExcelFile(report, 'Sistema de Tutoria, Submissões Laboratório ' + this.datepipe.transform(new Date(), 'dd-MM-yyyy HHmm'));
}
else if(this.indicatorslist){
  var report = alasql("SELECT district AS [Distrito],healthFacility AS [Unidade Sanitária], performedDate AS [Data da Sessão],tutorName AS [Tutor],formName AS [Formulário], CASE elaborado WHEN 'true' THEN 'Sim' ELSE 'Não' END AS 'Elaborado', CASE aprovado WHEN 'true' THEN 'Sim' ELSE 'Não' END AS 'Aprovado', CASE revisado WHEN 'true' THEN 'Sim' ELSE 'Não' END AS 'Revisado' FROM ?", [this.reports1]);
  this.excelService.exportAsExcelFile(report, 'Sistema de Tutoria, Submissões Laboratório ' + this.datepipe.transform(new Date(), 'dd-MM-yyyy HHmm'));
}else if(this.pmqtr){
  var report = alasql("SELECT district AS [Distrito],healthFacility AS [Unidade Sanitária], performedDate AS [Data da Sessão],tutorName AS [Tutor],tutoredName AS [Tutorado],cabinet AS [Sector],formacao AS [(%) FORMAÇÃO E CERTIFICAÇÃO DO PESSOAL], instalacoes AS [(%) INSTALAÇÕES FÍSICAS],seguranca AS [(%) SEGURANÇA],pretestagem AS [(%) FASE PRÉ-TESTAGEM],testagem AS [(%) FASE DE TESTAGEM],postestagem AS [(%) FASE PÓS-TESTAGEM - DOCUMENTOS E REGISTOS],avaliacao AS [(%) AVALIAÇÃO EXTERNA DE QUALIDADE],total AS [% TOTAL], createdAt AS [Data de Envio],mentorship_id FROM ?", [this.reports1]);
  this.excelService.exportAsExcelFile(report, 'Sistema de Tutoria, Relatorio PMQ-TR HIV ' + this.datepipe.transform(new Date(), 'dd-MM-yyyy HHmm'));
}else if(this.narrativeCOP20){
  var report = alasql("SELECT district AS [Province],ind_11061 AS [# of HTC mentoring sessions at VCT service points],ind_11011 AS [# of mentoring sessions on the use of national screening tools],ind_11031 AS [# of HF-level index case testing mentoring sessions to HCWs and lay counselors],ind_11041 AS [# of mentoring sessions on proactive screening of children health cards],ind_11043 AS [# of mentoring sessions on HTC for children and adolescents],ind_11073 AS [# of mentoring sessions on HTC linkages],ind_42 AS [# of HTC mentoring sessions taking place at SAAJ],ind_10043 AS [# of mentoring sessions at SAAJs on HIV and GBV prevention and care],ind_10045 AS [# of mentoring sessions at SAAJs on screening, diagnosis and treatment of STIs],ind_04071 AS [# of mentoring sessions on universal HIV testing for PLW with unknown status],ind_04073 AS [# of mentoring sessions on ANC/CCR index-case testing strategy],ind_04041 AS [# of mentoring sessions on retesting of breastfeeding women according to MoH policy],ind_04077 AS [# of mentoring sessions on the provision of DTG-based treatment regimens to PLW],ind_04078 AS [# of mentoring sessions on the identification and timely treatment of HIV/TB co-infected PLW ],ind_04061 AS [# of mentoring sessions on use of PSS and positive prevention instruments tailored to support PLW],ind_15051 AS [# of mentoring sessions on the use of approved screening tools and algorithms for the identification of HIV+ KP within HFs],ind_06044 AS [# of mentoring sessions on implementation of routine/universal screening tool as per MOH guidelines],ind_02041 AS [# of mentoring sessions on MOH criteria for offering TLD],ind_01102 AS [# of mentoring sessions on APSS implementation, documentation and reporting],ind_01031 AS [# of mentoring sessions on multi-month ART dispensation],ind_01142 AS [# of mentoring sessions on VL demand creation package],ind_02063 AS [# of mentoring sessions with young adult case managers],ind_01116 AS [# of mentoring activities at prison AJUDA health facilities],ind_02071 AS [# of mentoring sessions on HIV/FP integration],ind_02021 AS [# of MCH/PMTCT and C&T mentoring sessions that include FP competencies],ind_02023 AS [# of mentoring sessions on the use of FP M&E and referral tools],ind_08051 AS [# of mentoring sessions on CECAP services provision (VIA, colposcopy and LEEP)],ind_03029 AS [# of mentoring sessions on 3MDD of TPT],ind_030211 AS [# of mentoring sessions on TPT cascade],ind_030213 AS [# of mentoring sessions on identification and reporting of adverse pharmaceutical events (esp. for INH and 3HP)],ind_03011 AS [# of mentoring sessions at pediatric entry points on TB screening for children and adolescents],ind_03013 AS [# of mentoring sessions on use of GeneXpert],ind_05012 AS [# of mentoring sessions on HIV status disclosure support for children],ind_05031 AS [# of mentoring sessions on implementation of optimized ART regimens for children],ind_05061 AS [# of mentoring sessions on DSD enrollment for children and adolescents],ind_05052 AS [# of mentoring sessions in pediatrics applying the PSS mentoring package],ind_05054 AS [# of mentoring sessions on identification of HIV+ children > 5 years of age at high risk of suboptimal adherence and becoming lost to follow-up],ind_05057 AS [# of mentoring sessions on the transition packages of services for children and adolescents among different HIV services],ind_19051 AS [# of mentoring sessions to HCW to strengthen diagnostic capacity],ind_19015 AS [# of mentoring sessions on VL collection] FROM ?", [this.reports1]);
  this.excelService.exportAsExcelFile(report, 'Sistema de Tutoria, Dados para o Narrativo COP20 ' + this.datepipe.transform(new Date(), 'dd-MM-yyyy HHmm'));
}else if(this.pmqtrlist){
  var report = alasql("SELECT district AS [Distrito],healthFacility AS [Unidade Sanitária], performedDate AS [Data da Sessão],tutorName AS [Tutor],tutoredName AS [Tutorado],cabinet AS [Sector],MTQ00000751 AS [TODOS OS PROVEDORES RECEBERAM FORMACAO ABRANGENTE SOBRE A TESTAGEM RAPIDA DE HIV UTILIZANDO O CURRICULO APROVADO A NIVEL NACIONAL?],MTQ00000752 AS [OS PROVEDORES RECEBERAM FORMACAO SOBRE A UTILIZACAO DE LIVROS DE REGISTO/REGISTOS DE TESTAGEM DE HIV PADRONIZADOS?],MTQ00000753 AS [OS PROVEDORES RECEBERAM FORMACAO SOBRE AVALIACAO EXTERNA DA QUALIDADE (AEQ) OU SOBRE O PROCESSO DE TESTES DE PROFICIENCIA (TP)?],MTQ00000754 AS [OS PROVEDORES RECEBERAM FORMACAO SOBRE O PROCESSO DE CONTROLO DE QUALIDADE (CQ)?],MTQ00000755 AS [OS PROVEDORES RECEBERAM FORMACAO EM PROCEDIMENTOS E PRATICAS DE SEGURANCA E DE GESTAO DE RESIDUOS?],MTQ00000756 AS [TODOS OS PROVEDORES RECEBERAM UMA FORMACAO DE RECICLAGEM NOS ULTIMOS DOIS ANOS?],MTQ00000757 AS [EXISTEM REGISTOS COM INDICACAO DE QUE TODOS OS PROVEDORES DEMONSTRARAM COMPETENCIAS DE TESTAGEM RAPIDA DE HIV ANTES DA TESTAGEM DOS CLIENTES?],MTQ00000758 AS [TODOS OS PROVEDORES/TESTADORES RECEBERAM CERTIFICACAO ATRAVES DE UM PROGRAMA DE CERTIFICACAO NACIONAL?],MTQ00000759 AS [OS TESTES DE HIV SAO REALIZADOS APENAS POR PROVEDORESCERTIFICADOS?],MTQ00000760 AS [E NECESSARIO QUE TODOS OS PROVEDORES SEJAM RE-CERTIFICADOS PERIODICAMENTE (ISTO E, A CADA DOIS ANOS)?],MTQ00000761 AS [EXISTE UMA AREA INDICADA PARA A TESTAGEMRAPIDA DE HIV?],MTQ00000762 AS [A AREA DE TESTAGEM ESTA LIMPA E ORGANIZADA PARA A TESTAGEM RAPIDA DE HIV?],MTQ00000763 AS [EXISTE ILUMINACAO SUFICIENTE NA AREA DE TESTAGEM?],MTQ00000764 AS [OS KITS DE TESTE SAO MANTIDOS NUM AMBIENTE DE TEMPERATURA CONTROLADA COM BASE NAS INSTRUCOES DOS FABRICANTES?],MTQ00000765 AS [O ESPACO DE CONSERVACAO DE KITS DE TESTES E OUTROS CONSUMIVEIS E SUFICIENTE E SEGURO?],MTQ00000766 AS [EXISTEM POP E/OU AUXILIARES DE TRABALHO EM VIGOR PARA IMPLEMENTAR PRATICAS DE SEGURANCA?],MTQ00000767 AS [EXISTEM POP E/OU AUXILIARES DE TRABALHO NO LOCAL SOBRE A TRATAMENTO DE RESIDUOS INFECIOSOS E NAO INFECIOSOS?],MTQ00000768 AS [EXISTEM POP E/OU AUXILIARES DE TRABALHO NO LOCAL SOBRE COMO LIDAR COM DERRAMES DE SANGUE E OUTROS FLUIDOS CORPORAIS?],MTQ00000769 AS [EXISTEM POP E/OU AUXILIARES DE TRABALHO NO LOCAL PARA LIDAR COM A EXPOSICAO ACIDENTAL A FLUIDOS CORPORAIS POTENCIALMENTE INFECIOSOS ATRAVES DE LESAO POR PICADA DE AGULHA, DERRAME OU LESOES POR OBJETOS PERFUROCORTANTES?],MTQ00000770 AS [EXISTE EQUIPAMENTO DE PROTECAO INDIVIDUAL (EPI) SEMPRE DISPONIVEL PARA OS PROVEDORES?],MTQ00000771 AS [O EPI E UTILIZADO DE FORMA CONSISTENTE POR TODOS OS AVALIADORES?],MTQ00000772 AS [O EPI E CORRETAMENTE UTILIZADO POR TODOS OS AVALIADORES DURANTE TODO O PROCESSO DE TESTAGEM?],MTQ00000773 AS [EXISTE AGUA LIMPA E SABAO DISPONIVEIS PARA A LAVAGEM DAS MAOS?],MTQ00000774 AS [EXISTE UM DESINFETANTE APROPRIADO PARA LIMPAR A AREA DE TRABALHO DISPONIVEL?],MTQ00000775 AS [OS RESIDUOS PERFURO-CORTANTES, INFECIOSOS E NAO INFECIOSOS SAO MANUSEADOS DE FORMA ADEQUADA?],MTQ00000776 AS [OS RECIPIENTES DE RESIDUOS INFECIOSOS E NAO INFECIOSOS SAO ESVAZIADOS REGULARMENTE DE ACORDO COM O POP E/OU AUXILIARES DE TRABALHO?],MTQ00000777 AS [EXISTENO LOCAL DE TESTAGEM ORIENTACOES/DIRETRIZES NACIONAIS DE ACONSELHAMENTO E TESTAGEM EM SAUDE (ATS)?],MTQ00000778 AS [ESTA A SER USADO O ALGORITMO DE TESTAGEM DE HIV NACIONAL?],MTQ00000779 AS [EXISTE UM PROCESSO NO LOCAL PARA UM ALGORITMO DE TESTAGEM DE HIV ALTERNATIVO, EM CASO DE KIT(S) DE TESTE FORA DO PRAZO DE VALIDADE OU FALTA DE KIT(S)?],MTQ00000780 AS [EXISTEM POP E/OU AUXILIARES DE TRABALHO NO LOCAL PARA CADA TESTE RAPIDO DE HIV UTILIZADO NO ALGORITMO DE TESTAGEM?],MTQ00000781 AS [ESTAO ATUALMENTE DISPONIVEIS PARA UTILIZACAO APENAS KITS RAPIDOS DE HIV APROVADOS A NIVEL NACIONAL?],MTQ00000782 AS [TODOS OS KITS DE TESTE QUE ESTAO ATUALMENTE A SER UTILIZADOS ESTAO DENTRO DO PRAZO DE VALIDADE?],MTQ00000783 AS [OS KITS DE TESTE SAO IDENTIFICADOS COM DATA DE RECECAO E INICIAIS?],MTQ00000784 AS [EXISTE UM PROCESSO EM VIGOR PARA GESTAO DE STOCKS?],MTQ00000785 AS [ESTAO DISPONIVEIS E AFIXADOS NO LOCAL DE TESTAGEM AUXILIARES DE TRABALHO SOBRE A COLHEITA DE AMOSTRAS DOS CLIENTES?],MTQ00000786 AS [EXISTEM CONSUMIVEIS SUFICIENTES DISPONIVEIS PARA COLHEITA DE AMOSTRAS DE CLIENTES?],MTQ00000787 AS [EXISTEM ORIENTACOES NACIONAIS QUE DESCREVAM COMO A IDENTIFICACAO DOS CLIENTES DEVE SER FEITA NO REGISTO DE TESTAGEM DE HIV?],MTQ00000788 AS [OS ELEMENTOS DE IDENTIFICACAO DOS CLIENTES SAO REGISTADOSNO REGISTO DE TESTAGEM DE HIVE NOS DISPOSITIVOS DO TESTE DE ACORDO COM AS ORIENTACOES NACIONAIS?],MTQ00000789 AS [ESTAO DISPONIVEIS E AFIXADOS NO LOCAL DE TESTAGEM POP E/OU AUXILIARES DE TRABALHO SOBRE PROCEDIMENTOS DE TESTAGEM DE HIV?],MTQ00000790 AS [ESTAO DISPONIVEIS CRONOMETROS? E SAO USADOS ROTINEIRAMENTE NA TESTAGEM RAPIDA DE HIV?],MTQ00000791 AS [OS DISPOSITIVOS DE COLHEITA DE AMOSTRA (P. EX., TUBO CAPILAR, ANSA, PIPETAS DESCARTAVEIS, ETC.) SAO UTILIZADOS CORRETAMENTE?],MTQ00000792 AS [OS PROCEDIMENTOS DE TESTAGEM FORAM SEGUIDOS DE FORMA ADEQUADA?],MTQ00000793 AS [ESTAO A SER UTILIZADAS REGULARMENTE (P. EX., DIARIAMENTE OU SEMANALMENTE) AMOSTRAS DE CONTROLO DE QUALIDADE (CQ) POSITIVO E NEGATIVO DE ACORDO COM AS ORIENTACOES DO PAIS?],MTQ00000794 AS [OS RESULTADOS DO CQ FORAM DEVIDAMENTE REGISTADOS?],MTQ00000795 AS [OS RESULTADOS DO CQ INCORRETOS/INVALIDOS SAO DEVIDAMENTE REGISTADOS?],MTQ00000796 AS [FORAM ADOTADAS E DOCUMENTADAS MEDIDAS ADEQUADAS QUANDO OS RESULTADOS DE CQ FORAM INCORRETOS E/OU INVALIDOS?],MTQ00000797 AS [OS REGISTOS DE CQ SAO ANALISADOS PELA PESSOA ENCARREGADA DE FORMA ROTINEIRA?],MTQ00000798 AS [EXISTE UM REGISTO/LIVRO DE REGISTO DE TESTAGEM RAPIDA DE HIV PADRONIZADO NACIONAL DISPONIVEL E A SER UTILIZADO?],MTQ00000799 AS [O LIVRO DE REGISTO/REGISTO DE TESTAGEM DE HIV INCLUI TODOS OS ELEMENTOS DE QUALIDADE IMPORTANTES?],MTQ00000800 AS [TODOS OS ELEMENTOS NO REGISTO/LIVRO DE REGISTO SAO REGISTADOS CORRETAMENTE (P. EX., DADOS DEMOGRAFICOS DOS CLIENTES, NOMES DE KITS, NUMEROS DE LOTES, PRAZOS DE VALIDADE, NOME DO AVALIADOR, RESULTADOS DE HIV INDIVIDUAIS E FINAIS, ETC.)?],MTQ00000801 AS [O RESUMO TOTAL NO FINAL DE CADA PAGINA DOS LIVROS DE REGISTO E CUMPRIDO DE FORMA PRECISA?],MTQ00000802 AS [FORAM REGISTADOS RESULTADOS DE TESTE INVALIDOS NO LIVRO DE REGISTO?],MTQ00000803 AS [OS TESTES INVALIDOS FORAM REPETIDOS E OS RESULTADOS FORAM DEVIDAMENTEREGISTADOS NO LIVRO DE REGISTO?],MTQ00000804 AS [TODOS OS DOCUMENTOS E REGISTOS DOS CLIENTES SAO MANTIDOS EM SEGURANCA DURANTE TODAS AS FASES DO PROCESSO DE TESTAGEM?],MTQ00000805 AS [TODOS OS LIVROS DE REGISTO E OUTROS DOCUMENTOS SAO GUARDADOS EM LOCAL SEGURO QUANDO NAO ESTAO A SER UTILIZADOS?],MTQ00000806 AS [ESTAO OS REGISTOS/LIVROS DE REGISTOS DEVIDAMENTE IDENTIFICADOS E ARQUIVADOS QUANDO COMPLETOS?],MTQ00000807 AS [O LOCAL DE TESTAGEM ESTA INSCRITO NO PROGRAMA DE AVALIACAO EXTERNA DE QUALIDADE DO HIV?],MTQ00000808 AS [TODOS OS PROVEDORES NO LOCAL DE TESTAGEM EFETUAM TESTES NAS AMOSTRAS DE AVALIACAO EXTERNA DE QUALIDADE?],MTQ00000809 AS [A PESSOA RESPONSAVELPELO LOCAL DE TESTAGEM ANALISA OS RESULTADOS DE PAINEIS DE PROFICIENCIA ANTES DE SEREM ENVIADOS PARA O PROVEDOR DOS PAINEIS DE PROFICIENCIA (INS OU OUTRO)OU DESIGNADO?],MTQ00000810 AS [E RECEBIDO UM RELATORIO DE AVALIACAO EXTERNA DE QUALIDADE DO INS OU OUTRO PROVEDOR E E ANALISADO PELO PROVEDOR E/OU PELA PESSOA RESPONSAVEL PELO LOCAL DE TESTAGEM?],MTQ00000811 AS [O PONTO DE TESTAGEM IMPLEMENTA MEDIDAS CORRETIVAS EM CASO DE RESULTADOS INSATISFATORIOS?],MTQ00000812 AS [O PONTO DE TESTAGEM RECEBE VISITAS DE SUPERVISAO PERIODICAS?],MTQ00000813 AS [E FORNECIDO FEEDBACK DURANTE A VISITA DE SUPERVISAO? E DOCUMENTADO?],MTQ00000814 AS [SE OS PROVEDORES PRECISAREM DE FORMACAO DE RECICLAGEM, A FORMACAO OCORRE DURANTE A VISITA DE SUPERVISAO?],MENTORING_ID AS [MENTORING_ID] FROM ?", [this.reports1]);
  this.excelService.exportAsExcelFile(report, 'Sistema de Tutoria, Relatorio PMQ-TR List ' + this.datepipe.transform(new Date(), 'dd-MM-yyyy HHmm'));
}


        }

  
}

