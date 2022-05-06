import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {

  constructor(
    private auth: AngularFireAuth,
    private firestore: AngularFirestore,
    private router: Router
  ) { }

  getCurrentUser() {
    this.auth.authState.subscribe(user => {
      if (user) {
        if (user.uid) {
          this.firestore.collection('users').doc(user.uid).valueChanges().subscribe((data: any) => {
            console.log(data)
            if (data) {
              if (data.userType == 'admin') {

              }
              else {
                this.router.navigate(['home'])

              }
            }
          })
        }
        else {
          this.router.navigate(['home'])
        }

      }
      else {
        this.router.navigate(['home'])
      }

    })
  }


  ngOnInit(): void {

    // get current user information

    this.getCurrentUser()

    // one time admin account creation

    // this.auth.auth.createUserWithEmailAndPassword('admin1@cust.pk', '123456').then(user => {
    //   alert(user.user.uid)
    //   const name = 'admin1'
    //   const timestamp = new Date()
    //   const userType = 'admin'
    //   const userID = user.user.uid
    //   this.firestore.collection('users').doc(user.user.uid).set({
    //     name, timestamp, userType, userID
    //   })
    // }).catch(err => {
    //   alert(err.message)
    // })

  }

}
