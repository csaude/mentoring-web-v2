import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { LoginsService } from '../shared/logins.service';
import { User } from '../../users/shared/user';
import { MatPaginator,MatDialog, MatDialogRef, MatSort , MatTableDataSource, MAT_DIALOG_DATA, PageEvent } from '@angular/material';
import { NavbarService } from '../../nav-bar/nav-bar.service';
import { MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})

/** 
* @author damasceno.lopes
*/
export class LoginFormComponent implements OnInit {
  public user;
  public form: FormGroup;
  public loginFail: string = "hide";
  public loginAccess: string = "hide";
  public isDisabled: boolean;
  public localUser = { username: '', password: '' };

   
  constructor(
    formBuilder: FormBuilder,
    public router: Router,
    public route: ActivatedRoute,
    public loginsService: LoginsService,
    public dialog: MatDialog,
    public nav: NavbarService,
    public snackBar: MatSnackBar
  ) {
    this.form = formBuilder.group({
      username: ['', [
        Validators.required
      ]],
      password: ['', [
        Validators.required
      ]]
    });
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 4000,
    });
  }

  ngOnInit() {
    this.isDisabled = false;
    var user = JSON.parse(window.sessionStorage.getItem('user'));
    if (user) {
      this.router.navigate(['home']);
    }
  }
  /**
   * Handle user authentication
   */
  login() {
    window.sessionStorage.clear();
    this.isDisabled = true;
    this.loginsService.findOneUserByCredentials(this.localUser)
      .subscribe(data => {
        this.user = data;
        if (this.user) {
          if (this.user.accountNonExpired == "true"||this.user.accountNonLocked == "true"||this.user.accountNonExpired == "true"||this.user.credentialsNonExpired == "true"||this.user.enabled == "true") {
            window.sessionStorage.setItem('user', JSON.stringify(this.user));
            this.router.navigate(['home']);
            this.nav.callMethodOfSecondComponent();
          } else {
            this.openSnackBar("Acesso restrito, contacte o SIS sis@fgh.org.mz!", "OK");
            this.loginAccess = "";
            this.loginFail = "hide";
            this.isDisabled = false;
          }
        } else {
          this.openSnackBar("Credencias Inválidas!", "OK");
          this.loginAccess = "hide";
          this.loginFail = "";
          this.isDisabled = false;
        }
      }, error => {
        this.openSnackBar("Credencias Inválidas!", "OK");
        this.loginFail = "";
        this.loginAccess = "hide";
        this.isDisabled = false;
      },
        () => {
        }
      );
  }


resetPass(): void {
  
  const dialogRef = this.dialog.open(DialogResetPass, {
    disableClose:true,
    width: '800px',
    height: '300px',
    data: null
}); 

}

}



@Component({
  selector: 'login-reset-dialog',
  templateUrl: 'login-reset-dialog.html',
})
export class DialogResetPass implements OnInit{

  public form: FormGroup;
  public isHidden: string;
  public isDisabled;isAdded: boolean;
  public user;questionsCategory: any[];
  public message;
  
  constructor(
    public loginsService: LoginsService,
    public dialogRef: MatDialogRef<DialogResetPass>,
    public formBuilder: FormBuilder,
    public snackBar: MatSnackBar) {

      this.form = formBuilder.group({
        email: ['', [Validators.required, Validators.email]]
      });

    }

  ngOnInit() {
    this.isAdded=false;
    this.user = JSON.parse(window.sessionStorage.getItem('user'));
    this.questionsCategory=JSON.parse(window.sessionStorage.getItem('questionsCategory'));
  }

  onSaveClick(): void {
    this.isDisabled=true;
    var userValue = this.form.value

    var payLoad: any={
        email: userValue.email
   
    };

    this.loginsService.resetPass(payLoad)
    .subscribe(data => {      
        this.message=data;
    }, error => {
      this.openSnackBar("Não foi posivel actualizar a senha contacte o Administrador!", "OK");
      this.isDisabled = false;
    },
      () => {
        if(this.message.message){
          this.openSnackBar("Não foi posivel actualizar a senha contacte o Administrador!", "OK");
          this.isDisabled = false;
        }else{
          this.openSnackBar("Senha actualizada com sucesso verifique o seu E-mail.", "OK");
        this.dialogRef.close();
        }
        
      }
    );
      

  }

  onNoClick(): void {
    this.dialogRef.close();
    
  }


  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 5000,
    });
  }

}
