import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ContractService } from 'src/app/services/contract.service';

@Component({
  selector: 'app-advertisement',
  templateUrl: './advertisement.component.html',
  styleUrls: ['./advertisement.component.scss']
})
export class AdvertisementComponent implements OnInit {
  counterInput:number =0
  payPerView:number =0
  companyFund:number =0
  marketingFund:number =0

  @ViewChild('targetDiv', { static: true }) targetDiv: ElementRef | undefined;


  constructor(private _router: Router,
    private contractService: ContractService, ) { 
      
    }

  async ngOnInit(): Promise<void> {
    this.payPerView = await this.contractService.getPayPerViewValue()
    this.companyFund = await this.contractService.getCompanyBudget()
    this.marketingFund = await this.contractService.getMktBudget()
    this.counterInput = await this.contractService.getViews()

    const options = {
      root: null, // Use the viewport as the root element
      rootMargin: '0px',
      threshold: 1.0 // Trigger when the entire div is in view
    };

    const observer = new IntersectionObserver(entries => {
      entries.forEach(async entry => {
        if (entry.isIntersecting) {
          await this.contractService.increaseView()
          this.counterInput = await this.contractService.getViews()
          await this.contractService.deposit()
          console.log(4)
          this.companyFund = await this.contractService.getCompanyBudget()
          this.marketingFund = await this.contractService.getMktBudget()
        } 
      });
    }, options);

    observer.observe(this.targetDiv?.nativeElement);
  }

  
  navigate(){ 
    this._router.navigate(['home'])
  }
}