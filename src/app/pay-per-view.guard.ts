import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { ContractService } from './services/contract.service';

@Injectable({
  providedIn: 'root',
})
export class PayPerViewGuard implements CanActivate {
  constructor(private _contractService: ContractService, private _router: Router) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this._contractService.getPayPerViewValue().then(value=>{
      if(!value){
        return false
      } else {
      return  true
      }      
    })

  }
}
