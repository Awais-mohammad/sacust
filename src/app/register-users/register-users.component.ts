import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import * as firebase from 'firebase/app'

@Component({
  selector: 'app-register-users',
  templateUrl: './register-users.component.html',
  styleUrls: ['./register-users.component.scss']
})
export class RegisterUsersComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialoge: MatDialog,
    private firestore: AngularFirestore,
    private auth: AngularFireAuth,
    private router: Router
  ) {
    this.spin = false
  }

  email: string;
  password: string;
  spin: boolean = false;
  error: string;
  errmsg: string;
  name: string;

  showspin() {
    this.spin = !this.spin
  }

  close() {
    this.dialoge.closeAll()
  }

  validate() {

    this.spin = true
    if (!this.email) {
      alert('provide email')

      this.spin = false
    }
    else if (!this.password) {

      this.spin = false
      alert('provide password')
    }
    else if (!this.name) {

      this.spin = false
      alert('provide name')
    }
    else if (this.data.user == 'Students') {


      if (this.email.includes('@cust.pk')) {

        var config = {
          apiKey: "AIzaSyDTfhG_ocAYr870eLCqc361un5NJ2EI4qs",
          authDomain: "sa-cust.firebaseapp.com",
          projectId: "sa-cust",
          storageBucket: "sa-cust.appspot.com",
          messagingSenderId: "875712135758",
          appId: "1:875712135758:web:0ac6849ee8dfe558b6b91f",
          measurementId: "G-PMHQ1NHLYY"
        };

        var secondApp = firebase.initializeApp(config, "secondary")

        secondApp.auth().createUserWithEmailAndPassword(this.email, this.password).then(resp => {
          alert(resp.user.uid)
          if (resp.user.uid) {
            secondApp.auth().currentUser.sendEmailVerification().then(() => {
              alert('User registered check your email to verify otherwise you will not be able to login')
              const name = this.name
              const email = this.email
              const userType = this.data.user
              const userID = resp.user.uid
              const timestamp = new Date()
              this.firestore.collection('users').doc(resp.user.uid).set({
                name, email, userType, userID, timestamp
              })

              this.spin = false
              this.close()
              secondApp.auth().signOut()
            }).catch((err => {
              alert(err.message)
            }))
          }
        }).catch(err => {

          this.spin = false
          alert(err.message)
        })
      }
      else {
        alert('Only Cust domain mails allowed')

        this.spin = false
      }

    }
    else if (this.data.user == 'Teachers') {

      if (this.email.includes('@cust.edu.pk')) {

        var config = {
          apiKey: "AIzaSyDTfhG_ocAYr870eLCqc361un5NJ2EI4qs",
          authDomain: "sa-cust.firebaseapp.com",
          projectId: "sa-cust",
          storageBucket: "sa-cust.appspot.com",
          messagingSenderId: "875712135758",
          appId: "1:875712135758:web:0ac6849ee8dfe558b6b91f",
          measurementId: "G-PMHQ1NHLYY"
        };

        var secondApp = firebase.initializeApp(config, "secondary")

        secondApp.auth().createUserWithEmailAndPassword(this.email, this.password).then(resp => {
          alert(resp.user.uid)
          if (resp.user.uid) {
            secondApp.auth().currentUser.sendEmailVerification().then(() => {
              alert('User registered check your email to verify otherwise you will not be able to login')
              const name = this.name
              const email = this.email
              const userType = this.data.user
              const userID = resp.user.uid
              const timestamp = new Date()
              this.firestore.collection('users').doc(resp.user.uid).set({
                name, email, userType, userID, timestamp
              })

              this.spin = false
              this.close()
              secondApp.auth().signOut()
            }).catch((err => {
              alert(err.message)
            }))
          }
        }).catch(err => {

          this.spin = false
          alert(err.message)
        })
      }

      else {
        alert('Only Cust domain mails allowed')

        this.spin = false
      }

    }

  }

  

  ngOnInit(): void {

   
  }

}
