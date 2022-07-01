import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AttendenceComponent } from '../attendence/attendence.component';
import { Router } from '@angular/router';
import { FeedbackComponent } from '../feedback/feedback.component';

@Component({
  selector: 'app-teacher-dashboard',
  templateUrl: './teacher-dashboard.component.html',
  styleUrls: ['./teacher-dashboard.component.scss']
})
export class TeacherDashboardComponent implements OnInit {

  constructor(
    private firestore: AngularFirestore,
    private auth: AngularFireAuth,
    private dialog: MatDialog,
    private router: Router
  ) {
    this.currentDiv = 'main'
  }


  currentDiv: string
  labs: any;
  saReqs: any;
  c_labID: string;

  getRequests(labID) {
    this.c_labID = labID
    this.firestore.collection('labs').doc(labID).collection('student-assistants-requests').valueChanges().subscribe(data => {
      if (data.length > 0) {
        this.saReqs = data
        console.log(this.saReqs,'reqs');

      }
    })
  }

  underView: any;
  viewLab(lab) {
    this.underView = lab
    console.log(this.underView);
    this.currentDiv = 'view-lab'
    this.getRequests(this.underView.docID)
    this.getSA()

  }

  addSA(param: any) {
    console.log('method called');

    const name = param.name
    const regNo = param.regNo
    const addedAt = new Date()
    const incentiveToGive = param.incentive
    this.firestore.collection('labs').doc(this.c_labID).collection('student-assistants').add({
      name, regNo, addedAt, incentiveToGive
    }).then(doc => {
      const docID = doc.id
      this.firestore.collection('labs').doc(this.c_labID).collection('student-assistants').doc(doc.id).update({
        docID
      }).then(() => {
        this.firestore.collection('labs').doc(this.c_labID).collection('student-assistants-requests').doc(param.docID).delete().then(() => {
          alert('student Assistant added to the lab')
        }).then(() => {
          const SA = 1
          this.firestore.collection('labs').doc(this.c_labID).update({
            SA
          })
        })

      })
    })
  }

  sa: any;

  getSA() {
    this.firestore.collection('labs').doc(this.c_labID).collection('student-assistants').valueChanges().subscribe(data => {
      this.sa = data
    })

  }

  markAttendence(slot, sa, labID) {
    console.log(slot, sa, labID);

    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.height = '430px';
    dialogConfig.width = '500px';
    dialogConfig.data = {

      c_slot: slot,
      labID: labID
    }
    this.dialog.open(AttendenceComponent, dialogConfig);
  }

  feedback(sname) {
    // console.log(slot, sa, labID);

    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.height = '80%';
    dialogConfig.width = '40%';
    dialogConfig.data = {

      std_name: sname
    }
    this.dialog.open(FeedbackComponent, dialogConfig);
  }
  ngOnInit(): void {


    this.auth.authState.subscribe((u) => {

      if (u) {

        // console.log();

        this.firestore.collection('users').doc(u.uid).valueChanges().subscribe((data: any) => {
          this.firestore.collection('labs', (q => q.where('teacherID', '==', data.empID))).valueChanges().subscribe(labsData => {
            this.labs = labsData
            console.log(this.labs);

          })
        })

      }
    })

    const timestamp = new Date()
    console.log(timestamp.getDate(), timestamp.getMonth());

    this.auth.authState.subscribe(u => {
      if (u) {

      }
      else {
        this.router.navigate(['home'])
      }
    })
  }

}
