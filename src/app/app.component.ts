import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ContractService } from './services/contract.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(private _router: Router, private _contract: ContractService){
  }
  title = 'blockchain';

  goHome(){
    this._router.navigate([""])
  }
}
