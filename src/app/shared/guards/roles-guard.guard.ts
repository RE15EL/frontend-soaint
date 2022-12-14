import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { NgxToastService } from 'ngx-toast-notifier';
import { Observable } from 'rxjs';
import { User } from 'src/app/pages/users/interfaces/user.interface';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RolesGuardGuard implements CanActivate {

  constructor( 
    private authSvc:AuthService,
    private router:Router,
    private ngxToastServ:NgxToastService){    
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
      return this.checkUserLogin(route);
      
  }

  checkUserLogin( route:ActivatedRouteSnapshot ):boolean{
    let userRoles:string[]=[];
    this.authSvc.getCurrentUser$().subscribe( (user:User) => userRoles= [...user.roles]);//obtener los roles del currentUser
    if( userRoles.includes(route.data['role']) ){
      return true;
    }else{
      this.ngxToastServ.onDanger('','No tiene permisos para navegar a esta zona de la plataforma');
      this.router.navigate(['/']);
      return false;
    }
    
  }
  
}
