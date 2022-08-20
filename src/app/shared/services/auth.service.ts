import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { User } from 'src/app/pages/auth/interfaces/user.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl= 'http://localhost:3200';

  currentUser= new BehaviorSubject<User>({name:'',  email:'', pass:''});
  users:User[]=[];

  constructor(private http:HttpClient, private router:Router) {
    this.getUsers().subscribe( res => this.users = res);
  }

  register(user:User):Observable<any>{
    localStorage.setItem( 'usuario_registrado', JSON.stringify(user) );

    return this.http.post<any>(`${this.apiUrl}/users`, 
    {
      name: user.name,
      email:user.email,
      pass:user.pass
    }).pipe(
      tap( ()=> {
        this.router.navigate(['/auth/login']);
      } )
    );
    
  }
  login(user:User){

    // return this.http.post<any>(`${this.apiUrl}/login`, 
    //   {
    //     name: user.name,
    //     email:user.email,
    //     pass:user.pass
    //   })
    //   .pipe( 
    //     tap( res => {
    //       const nextUser:User= res;
    //       this.currentUser.next(nextUser);
    //       localStorage.setItem( 'user_logged', JSON.stringify(nextUser));
    //       console.log('logueado: ', nextUser);
          
    //     })
    //   ); 
    
    const nextUser= this.users.find( ({email}) => user.email == email ); 
    if (!nextUser) {
      console.log( 'usuario no registrado', user );
      this.router.navigate(['/auth/register']);
    }else{
      console.log( 'Bienvenido', user );
      this.currentUser.next(nextUser);
      localStorage.setItem( 'user_logged', JSON.stringify(nextUser));
      this.router.navigate(['/']);
    }
  }

  logout():void {
    localStorage.removeItem('user_logged');
    this.currentUser.next({name:'',  email:'', pass:''});
    this.router.navigate(['/auth/login']);
  }

  isLoggedIn():boolean {
    const userData = localStorage.getItem('user_logged');
    return (userData !== null);
  }

  getUsers():Observable<User[]>{
    return this.http.get<User[]>(`${this.apiUrl}/users`);
  }
}
