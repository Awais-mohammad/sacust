import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import * as firebase from 'firebase/app'

@Component({
  selector: 'app-mylabs',
  templateUrl: './mylabs.component.html',
  styleUrls: ['./mylabs.component.scss']
})
export class MylabsComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialoge: MatDialog,
    private firestore: AngularFirestore,
    private auth: AngularFireAuth,
    private router: Router
  ) {
    this.regNo = data.user
    this.getLabs()
  }


  regNo: string;
  labData: any
  getLabs() {

    this.firestore.collection('labs').doc(this.regNo).valueChanges().subscribe(data => {
      console.log(data);
      this.labData = data
      this.getSA()
    })

  }

  close(){
    this.dialoge.closeAll()
  }
  assist: any;

  getSA() {
    this.firestore.collection('labs').doc(this.regNo).collection('student-assistants').valueChanges().subscribe(s => {
      this.assist = s
    })
  }

  ngOnInit(): void {
  }

}
