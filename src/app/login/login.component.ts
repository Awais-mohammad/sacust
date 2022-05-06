import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';

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
    private auth: AngularFireAuth,
    private firestore: AngularFirestore
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
    else if (!this.email.includes('@cust.pk')) {
      this.error = 'email'
      this.errmsg = 'Email format invalid'
      this.showspin()
    }
    
    else {
      this.login()
    }
  }


  login() {
    this.auth.auth.signInWithEmailAndPassword(this.email, this.password).then(user => {
      this.firestore.collection('users').doc(user.user.uid).valueChanges().subscribe((c_user: any) => {

        console.log(c_user);

        if (c_user.userType == 'Students') {

          this.gotoPage('student-dashboard')

        }
        else if (c_user.userType == 'admin') {

          this.gotoPage('admin-dashboard')
        }
        else {
          this.auth.auth.signOut()
          this.openSnackBar('Please donnot try to login into other"s system!', 3000)
        }

      })
    }).catch((err) => {
      this.openSnackBar(err.message, 3000)
    })

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
