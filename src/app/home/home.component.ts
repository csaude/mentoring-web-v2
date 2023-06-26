import { DatePipe } from '@angular/common';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from 'ng2-translate';
import { MatPaginator, MatSort , MatTableDataSource } from '@angular/material';
import * as alasql from 'alasql';
import { TutoredsService } from "../tutoreds/shared/tutored.service";
import {ExcelService} from '../resources/shared/excel.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

/**
* @author Damasceno Lopes <damascenolopess@gmail.com>
*/
export class HomeComponent implements OnInit {

  @ViewChild(MatPaginator,{static: false}) paginator: MatPaginator;
  @ViewChild(MatSort,{static: false}) sort: MatSort;

  public sessions;sessions1: any[]=[];


  public displayedColumns: string[] = ['district','programmaticArea','totalSubmited','lastUpdate'];

  public chart1;chart2;chart3;chartSS1;chartSS;chartSS12;

  public barChartLabels: string[] = [];
  public barChartType: string = 'bar';
  public barChartLegend: boolean = true;
  public barChartData: any[] = [];

public total;

  public barChartOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    title: {
      text: 'Sessões de Tutoria',
      display: true
    },legend: {
      position: 'bottom'
  },
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true,
          userCallback: function (label, index, labels) {
            if (Math.floor(label) === label) {
              return label;
            }
          }
        }
      }],
      xAxes: [{
        ticks: {
          autoSkip: false
        },
        stacked:true
      }]
    }

  };

  //Chart3
  public lineChartLabels: string[] = [];
  public lineChartType: string = 'line';
  public lineChartLegend: boolean = true;
  public lineChartData: any[] = [];
  //Line Chart
  public lineChartOptions: any = {
    scaleShowVerticalLines: true,
    responsive: true,
    maintainAspectRatio: false,
    legend: {
      position: 'bottom'
  },
    title: {
      text: 'Nº de sessões submetidas nos últimos 12 meses',
      display: true
    },
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true,
          userCallback: function (label, index, labels) {
            if (Math.floor(label) === label) {
              return label;
            }
          }
        }
      }],
      xAxes: [{
        ticks: {
          autoSkip: false
        }
      }]
    }
  };

  constructor(
    public translate: TranslateService,
    public tutoredService: TutoredsService,
    public excelService:ExcelService,
    public datepipe: DatePipe
  ){


  }



  ngOnInit() {

    var user = JSON.parse(window.sessionStorage.getItem('user'));

    this.tutoredService.findSubmitedSessions(user.uuid)
    .subscribe(data => {
      console.log(data.submitedSessions);




      var temchart = [];
      if (!Array.isArray(data.submitedSessions)) {
        temchart.push(data.submitedSessions);
      } else {
        temchart = data.submitedSessions;
      }

      console.log(temchart);

      console.log(Array.isArray(temchart));

      this.chartSS =  alasql("Select district, SUM(totalSubmited::NUMBER) AS totalSubmited FROM ?performedSession GROUP BY district order by district ASC",[temchart]);
      this.chartSS1 = temchart;
      this.total=this.chartSS1.length;
      this.sessions = new MatTableDataSource(this.chartSS1);
      this.sessions.sort = this.sort;
      this.sessions.paginator = this.paginator;

    },error=>{},
  ()=>{

    this.chart2=true;

    var label: string[] = [];
    var value: number[] = [];

      for (let l of this.chartSS) {
        label.push(l.district);
        value.push(l.totalSubmited);
      }


      this.barChartLabels = label;
      this.barChartData = [
        { data: value, label: "Sessões" }];

        this.chart1=true;
    });


    this.tutoredService.findSubmitedSessionsLast12Months(user.uuid)
    .subscribe(data => {
      console.log(data);

      var temchart = [];
      if (!Array.isArray(data.performedSession)) {
        temchart.push(data.performedSession);
      } else {
        temchart = data.performedSession;
      }

      this.chartSS12 = alasql("Select * FROM ?performedSession order by healthFacility ASC",[temchart]);

      var label: string[] = [];
      var value: number[] = [];

      for (let l of this.chartSS12) {
        label.push(l.district);
        value.push(+l.totalPerformed);

      }
      this.lineChartLabels = label;
      this.lineChartData = [
        { data: value, label: "Sessões submetidas" }];



    },error=>{},
  ()=>{



    this.chart3=true;
  });

  }

  download(){
    this.excelService.exportAsExcelFile(this.chartSS1, 'Sistema de Tutoria, Sessões de Tutoria ' + this.datepipe.transform(new Date(), 'dd-MM-yyyy HHmm'));
  }


}
















