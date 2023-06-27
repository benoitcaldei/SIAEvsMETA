import {
  Component,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import { ContractService } from 'src/app/services/contract.service';
import { Subscription, interval } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  isLoading = false;
  private routeChangeListener: any;
  constructor(
    private contractService: ContractService,
    private _router: Router,
  ) {}

  updatedPayPerViewValue: number = 0;
  payPerViewValue: number = 0;
  companyBudgetValue: number = 0;
  musicianAccountValue: number = 0
  marketingBudgetValue: number = 0;
  payPerListenValue: number = 0
  updatedPayPerListenValue:number = 0
  advViews: number = 0;


  ngOnInit(): void {
    this.loadAllData();
    this.routeChangeListener = this._router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.loadAllData();
      }
    });
  }

  navigate(path: string) {
    this._router.navigate([path]);
  }

  async getPayPerListenValue() {
    this.isLoading = true;
    this.updatedPayPerListenValue =
      await this.contractService.getPayPerListenValue();
    this.isLoading = false;
  }

  async getPayPerViewValue() {
    this.isLoading = true;
    this.updatedPayPerViewValue =
      await this.contractService.getPayPerViewValue();
    this.isLoading = false;
  }

  async getCompanyBudget() {
    this.isLoading = true;
    this.companyBudgetValue = await this.contractService.getCompanyBudget();
    this.isLoading = false;
  }

  async getMktBudget() {
    this.isLoading = true;
    this.marketingBudgetValue = await this.contractService.getMktBudget();
    this.isLoading = false;
  }

  async getViews() {
    this.isLoading = true;
    this.advViews = await this.contractService.getViews();
    this.isLoading = false;
  }

  async getMusicianValue() {
    this.isLoading = true;
    this.musicianAccountValue = await this.contractService.getMusicianValue();
    this.isLoading = false;
  }

  

  async loadAllData() {
    await this.getPayPerViewValue();
    await this.getPayPerListenValue();
    await this.getCompanyBudget();
    await this.getMktBudget();
    await this.getViews();
    await this.getMusicianValue();
  }


  async updateValues(event:{
    payPerViewValue: number;
    payPerListenValue: number;
  }){

    if(!!event.payPerListenValue) await this.savePayPerListenValue(event.payPerListenValue)
    if(!!event.payPerViewValue) await this.savePayPerViewValue(event.payPerViewValue)
  }
  async savePayPerViewValue(payPerViewValue: number) {
    this.isLoading = true;
    await this.contractService.savePayPerViewValue(payPerViewValue);
    await this.getPayPerViewValue()
    this.isLoading = false;
  }

  async savePayPerListenValue(payPerListenValue: number) {
    this.isLoading = true;
    await this.contractService.savePayPerListenValue(payPerListenValue);
    await this.getPayPerListenValue()
    this.isLoading = false;
  }

  
}
