import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import * as firebase from 'firebase';
import { Papa } from 'ngx-papaparse';
import { MylabsComponent } from '../mylabs/mylabs.component';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {

  constructor(
    private auth: AngularFireAuth,
    private firestore: AngularFirestore,
    private router: Router,
    private papa: Papa,
    private dialoge: MatDialog
  ) {
    this.view = true
  }

  view: boolean;
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

  shift() {
    this.view = !this.view
  }
  remove(param) {
    this.firestore.collection('requests').doc(param).delete().then(() => {
      alert('request removed')
    }).catch(() => {
      alert('Something went wrong!!')
    })
  }

  approve(param) {
    var config = {
      apiKey: "AIzaSyDTfhG_ocAYr870eLCqc361un5NJ2EI4qs",
      authDomain: "sa-cust.firebaseapp.com",
      projectId: "sa-cust",
      storageBucket: "sa-cust.appspot.com",
      messagingSenderId: "875712135758",
      appId: "1:875712135758:web:0ac6849ee8dfe558b6b91f",
      measurementId: "G-PMHQ1NHLYY"
    };

    var secondApp = firebase.initializeApp(config, "secondaryapp")

    secondApp.auth().createUserWithEmailAndPassword(param.email, '123456').then(resp => {
      alert(resp.user.uid)
      if (resp.user.uid) {
        secondApp.auth().currentUser.sendEmailVerification().then(() => {
          alert('User registered check your email to verify otherwise you will not be able to login')
          const name = param.name
          const email = param.email
          const userType = 'Students'
          const userID = resp.user.uid
          const timestamp = new Date()
          this.firestore.collection('users').doc(resp.user.uid).set({
            name, email, userType, userID, timestamp
          })

          secondApp.auth().signOut()
          alert('student created')
        }).catch((err => {
          alert(err.message)
        }))
      }
    })
  }

  requests: any;
  getRequests() {

    this.firestore.collection('requests').valueChanges().subscribe(d => {
      this.requests = d
      console.log(this.requests);

    })
  }

  selectedCSVFileName: string;
  isCSV_Valid: boolean
  labName: string[] = []
  instructor: string[] = []
  empId: string[] = []
  labCode: string[] = [];
  timingsOne: string[] = []
  timingsTwo: string[] = []
  day: string[] = []
  // LOAD CSV FILE FROM INPUT
  fileChangeListener($event: any): void {

    const files = $event.srcElement.files;

    if (files !== null && files !== undefined && files.length > 0) {
      this.selectedCSVFileName = files[0].name;

      const reader: FileReader = new FileReader();
      reader.readAsText(files[0]);
      reader.onload = e => {

        const csv = reader.result;
        const results = this.papa.parse(csv as string, { header: false });

        // VALIDATE PARSED CSV FILE
        if (results !== null && results !== undefined && results.data !== null &&
          results.data !== undefined && results.data.length > 0 && results.errors.length === 0) {
          this.isCSV_Valid = true;

          // PERFORM OPERATIONS ON PARSED CSV
          let csvTableHeader = results.data[0];

          let csvTableData = [...results.data.slice(1, results.data.length)];
          console.log(csvTableData);

          console.log(csvTableData);

          for (var i = 0; i < csvTableData.length; i++) {

            // console.log();


            if (csvTableData[i][2] && csvTableData[i][7]) {
              this.labName.push(csvTableData[i][2])
              this.instructor.push(csvTableData[i][7])
              this.empId.push(csvTableData[i][8])
              this.labCode.push(csvTableData[i][1])
              this.timingsOne.push(csvTableData[i][10])
              this.timingsTwo.push(csvTableData[i][11])
              this.day.push(csvTableData[i][9])
            }
            console.log(this.timingsOne, this.timingsTwo);



          }

          this.createLabs()

        } else {
          for (let i = 0; i < results.errors.length; i++) {
            console.log('Error Parsing CSV File: ', results.errors[i].message);
          }
        }
      };
    } else {
      console.log('No File Selected');
    }

  }

  createLabs() {

    for (var i = 0; i < this.labName.length; i++) {
      console.log('labName->', this.labName[i], this.labCode[i], 'instructor', this.instructor[i], 'empID', this.empId[i]);
      const day = this.day[i]
      const labName = this.labName[i]
      const courseCode = this.labCode[i]
      const teacherName = this.instructor[i]
      const SA = 0
      const teacherID = this.empId[i]
      const slotOne = this.timingsOne[i]
      const slotTwo = this.timingsTwo[i]

      this.firestore.collection('labs').add({
        labName, courseCode, teacherName, SA, teacherID, slotOne, slotTwo
      }).then(doc => {
        const docID = doc.id
        this.firestore.collection('labs').doc(doc.id).update({
          docID

        }).catch(() => {
          console.log('Something went wrong');

        })
      })

    }

    alert('labs created successfully!!')
  }
  labs: any[]

  getLabs() {
    this.firestore.collection('labs').valueChanges().subscribe(lab => {
      this.labs = lab

    })
  }

  viewLab(labID) {
    // console.log(this.cUser.email);
    console.log(labID);

    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.height = '650px';
    dialogConfig.width = '500px';
    dialogConfig.data = {
      user: labID,
    };
    this.dialoge.open(MylabsComponent, dialogConfig);
  }


  ngOnInit(): void {
    this.getLabs()
    // get current user information
    this.getRequests()
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
