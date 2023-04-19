import { Component, AfterViewInit, OnInit, ViewChild } from '@angular/core';
import { Observable, delay, interval, map, of, switchMap } from 'rxjs';
import { GlobalService } from 'src/app/services/global.service';
import { MatPaginator} from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, AfterViewInit{
  data$!: Observable<any>;
  sleep$!: Observable<any>;
  prodValue: number = 976;
  increment: number = 1;
  midpH: boolean = false;
  valpH$!: Observable<number>;
  val: number = 0;
  
  pageSize: number = 5;
  _page: number = 0;
  pageSizeOptions: number[] = [5, 10, 25, 50, 100];
  dataSource = new MatTableDataSource<any>;
  displayedColumns: string[] = ['PH', 'LOTE', 'BOTTLES'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  constructor(
    private globalService: GlobalService
  ) { }

  ngOnInit(): void {
    let frm = {};
    
    this.midpH = true;
    this.valpH$ = of(Math.round(this.randomRange(5.01, 9.01) * 100) / 100).pipe(
      map(x => {
        this.val = x;
        this.prodValue = this.prodValue+this.increment;
        frm = {
          pH: this.val,
          lote: 'BC-2023-0418',
          bottles: this.prodValue,
          status: 'Process'
        }
        return frm;
      }),
      delay(3000),
      switchMap(_ =>  this.globalService.postData(frm).pipe(
        map((res: any) => {
          this.midpH = false;
          if (res.Status == 200){
            this.dataSource.data = res.Data;
            this.dataSource.sort = this.sort;
            return res.Data;
          }
        })
      ))
    );
    // this.save();
    
    this.sleep$ = interval(10000).pipe(
      map(() => {
        this.midpH = true;
        this.valpH$ = of(Math.round(this.randomRange(5.01, 9.01) * 100) / 100).pipe(
          map(x => {
            this.val = x;
            this.prodValue = this.prodValue+this.increment;
            frm = {
              pH: this.val,
              lote: 'BC-2023-0418',
              bottles: this.prodValue,
              status: 'Process'
            }
            return frm;
          }),
          delay(3000),
          switchMap(_ =>  this.globalService.postData(frm).pipe(
            map((res: any) => {
              this.midpH = false;
              if (res.Status == 200){
                this.dataSource.data = res.Data;
                this.dataSource.sort = this.sort;
                return res.Data;
              }
            })
          ))
        );
      })
    );
  }

  save(){
    this.prodValue = this.prodValue+this.increment;
    let frm = {
      pH: this.val,
      lote: 'BC-2023-0418',
      bottles: this.prodValue,
      status: 'Process'
    }
    this.data$ = this.globalService.postData(frm).pipe(
      map((res: any) => {
        this.midpH = false;
        if (res.Status == 200){
          this.dataSource.data = res.Data;
          this.dataSource.sort = this.sort;
          return res.Data;
        }
      })
    );
  }

  randomRange(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }

}
