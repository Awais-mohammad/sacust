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
      this.close()
    })
  }

  ngOnInit(): void {
  }

}
