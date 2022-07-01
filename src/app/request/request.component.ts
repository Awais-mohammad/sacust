import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-request',
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.scss']
})
export class RequestComponent implements OnInit {

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
  name: string;
  uNumber: string;
  role: string;

  spin: boolean = false;
  error: string;
  errmsg: string;

  showspin() {
    this.spin = !this.spin
  }

  close() {
    this.dialog.closeAll()
  }


  request() {
    this.showspin()
    if (this.role == 'teacher') {

      // check if teacher exists
      this.firestore.collection('labs', q => q.where('teacherID', '==', this.email)).valueChanges().subscribe((data: any) => {

        if (data.length < 1) {
          alert('no lab assigned to you thus you cannot use this system')
          this.showspin()
        }
        else if (this.name != data[0].teacherName) {
          alert('name miss matched please use official name')
          this.showspin()
        }
        else {
          console.log(data);

          const password = '123456' + this.name
          this.auth.auth.createUserWithEmailAndPassword(this.email, password).then(u => {
            const email = this.email
            const name = this.name
            // const empID = data[0].teacherID
            const userType = 'Teachers'
            const timestamp = new Date()
            const docID = u.user.uid
            this.firestore.collection('users').doc(docID).set({
              email, name, userType, timestamp, docID
            })
              .then(() => {
                this.showspin()
                this.auth.auth.currentUser.sendEmailVerification().then(() => {

                  alert('please check your mail to approve account. Your password is->' + password)
                  this.close()
                })
              })

          })

        }
      })

    }
    else {


      const name = this.name
      const email = this.email
      const verification = this.uNumber
      const role = this.role
      this.firestore.collection('requests').add({
        name, email, verification, role
      }).then((doc) => {
        const docID = doc.id
        this.firestore.collection('requests').doc(doc.id).update({})
        docID
      }).then(() => {
        alert('request send')
        this.showspin()
        this.close()
      })
    }
  }

  chooseModel(val) {
    // console.log(val);

    this.role = val
    console.log(this.role);

  }
  ngOnInit(): void {
  }

}
