import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  @Input() showButton: boolean = true;

  @Input() payPerViewValue: number = 0;
  @Input() updatedPayPerViewValue: number = 0;
  @Input() companyBudgetValue: number = 0;
  @Input() advViews: number = 0;
  @Input() marketingBudgetValue: number = 0;
  @Input() musicianAccountValue: number = 0;
  @Input() payPerListenValue: number = 0;
  @Input() updatedPayPerListenValue: number = 0;

  @Output() updateValues = new EventEmitter<{
    payPerViewValue: number;
    payPerListenValue: number;
  }>();

  constructor(
  ) {
  }

  ngOnInit(): void {}
}
