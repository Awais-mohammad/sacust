import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    // private firestore: AngularFirestore,
    // private auth: AngularFireAuth,
    public snackBar: MatSnackBar,
    private router: Router,
  ) { }

  email: string;
  password: string;
  spin: boolean = false;
  error: string;
  errmsg: string;

  showspin() {
    this.spin = !this.spin
  }


  validate() {
    this.showspin()
    if (!this.email) {
      this.error = 'email'
      this.errmsg = 'Email cannot be left blank'
      this.showspin()
    }
    else if (!this.password) {
      this.error = 'password'
      this.errmsg = 'Email cannot be left blank'
      this.showspin()
    }
    else if (!this.email.includes('@cust.edu.pk')) {
      this.error = 'email'
      this.errmsg = 'Email format invalid'
      this.showspin()
    }
    else {
      this.login()
    }
  }


  login() {
    // this.auth.auth.signInWithEmailAndPassword(this.email, this.password).then(user => {
    //   this.firestore.collection('users').doc(user.user.uid).valueChanges().subscribe((c_user: any) => {

    //     console.log(c_user);

    //     if (c_user.userTyp == this.data.user) {
    //       if (c_user.userTyp == 'Student') {

    //         this.gotoPage('student-dashboard')

    //       }
    //       else if (c_user.userTyp == 'Admin') {

    //         this.gotoPage('admin-dashboard')
    //       }
    //       else if (c_user.userTyp == 'Supervisor') {
    //         this.gotoPage('supervision-groups')
    //       }
    //       else if (c_user.userTyp == 'Co-ordinator') {
    //         this.gotoPage('cordinator-dashboard')
    //       }
    //       else if (c_user.userTyp == 'Staff') {
    //         this.gotoPage('staff-dashboard')
    //       }
    //       else if (c_user.userTyp == 'Evaluator') {
    //         this.gotoPage('evaluator-dashboard')
    //       }
    //       else {
    //         this.auth.auth.signOut()
    //         this.openSnackBar('No user found!!', 3000)
    //       }
    //     }
    //     else {
    //       this.auth.auth.signOut()
    //       this.openSnackBar('Please donnot try to login into other"s system!', 3000)
    //     }

    //   })
    // }).catch((err) => {
    //   this.openSnackBar(err.message, 3000)
    // })

    if(this.data.user=='Admin' && this.email.includes('@cust.edu.pk')){
      // this.router.navigate(['admin-dashboard'])
      this.gotoPage('admin-dashboard')
    }
    else{
      this.openSnackBar('invalid email domain',2000)
    }
  }

  openSnackBar(message, duration: number) {

    this.snackBar.open(message, '', {
      duration: duration,
      verticalPosition: 'top', // 'top' | 'bottom'
      horizontalPosition: 'end', //'start' | 'center' | 'end' | 'left' | 'right'
      panelClass: ['snack-bar-color'],
    });

    this.showspin()
    this.close()
  }

  gotoPage(pagename) {
    this.router.navigate([pagename]).then(() => {
      this.close()
    })
  }

  close() {
    this.dialog.closeAll()
  }

  ngOnInit(): void {
  }

}
