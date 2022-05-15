import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { createWorker } from 'tesseract.js';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AngularFireStorage } from '@angular/fire/storage'
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
@Component({
  selector: 'app-student-dashboard',
  templateUrl: './student-dashboard.component.html',
  styleUrls: ['./student-dashboard.component.scss']
})
export class StudentDashboardComponent implements OnInit {

  selectedFile: File = null;
  fb;
  downloadURL: Observable<string>;

  constructor(private router: Router,
    private auth: AngularFireAuth,
    private firestore: AngularFirestore,
    private http: HttpClient,
    private storage: AngularFireStorage
  ) {
    this.done = false
    this.currentDiv = 'timetable'
  }


  img: any;
  currentDiv: string;

  private basePath = '/uploads';
  labs: any[] = []
  tempLabs: string[] = ['ITP', 'IMP', 'PWD']
  done: boolean;
  spin: boolean = false;
  incentive: string[] = ['Cash', 'Certificate']
  choosedLab: string;
  choosedIncent: string;

  switch(switchTo) {
    this.currentDiv = switchTo
    this.done = false
  }

  selectFile(event) {
    this.spin = true
    var n = Date.now();
    const file = event.target.files[0];
    const filePath = `RoomsImages/${n}`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(`RoomsImages/${n}`, file);
    task
      .snapshotChanges()
      .pipe(
        finalize(() => {
          this.downloadURL = fileRef.getDownloadURL();
          this.downloadURL.subscribe(url => {
            if (url) {
              this.fb = url;
            }
            console.log(this.fb, 'url');
            this.http.post('http://127.0.0.1:5000/timetable', { imageURL: this.fb }).subscribe((data: any) => {
              console.log(data);
              this.labs = data
              this.done = true
              this.spin = false
            }, (() => {
              console.log('some error encountered');
              this.done = false
              this.spin = false
            }))

          });
        })
      )
      .subscribe(url => {
        if (url) {
          console.log(url);
        }
      });
  }

  selectTranscript(event) {
    this.spin = true
    var n = Date.now();
    const file = event.target.files[0];
    const filePath = `RoomsImages/${n}`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(`RoomsImages/${n}`, file);
    task
      .snapshotChanges()
      .pipe(
        finalize(() => {
          this.downloadURL = fileRef.getDownloadURL();
          this.downloadURL.subscribe(url => {
            if (url) {
              this.fb = url;
            }
            console.log(this.fb, 'url');
            console.log(this.userData.name, this.regNo);

            this.http.post('http://127.0.0.1:5000/transcript', { pdfURL: this.fb, studentName: this.userData.name, studentRegNo: this.regNo }).subscribe((data: any) => {
              console.log(data);

              this.labs = data

              this.done = true
              this.spin = false
            }, (err => {

              this.done = false
              this.spin = false
              alert(err.message)
            }))

          });
        })
      )
      .subscribe(url => {
        if (url) {
          console.log(url);
        }
      });
  }



  chooseModel(pa) {
    alert(pa)
    this.choosedLab = pa
  }

  chooseIncentive(inc) {
    alert(inc)
    this.choosedIncent = inc
  }

  temp: any;

  post() {
    this.firestore.collection('labs', (q => q.where('labName', '==', this.choosedLab))).valueChanges().subscribe((l: any) => {

      const name = this.userData.name
      const regNo = this.regNo
      const incentive = this.choosedIncent
      this.temp = l;
      console.log(this.temp.docID);

      if (l.length > 0) {

        this.firestore.collection('labs').doc(this.temp[0].docID).collection('student-assistants-requests').add({
          name, regNo, incentive
        }).then((d) => {
          const docID = d.id
          this.firestore.collection('labs').doc(this.temp[0].docID).collection('student-assistants-requests').doc(docID).update({
            docID
          }).then(() => {
            alert('request sent successfully')
            this.currentDiv = 'timetable'
          })
        })

      }
      else {
        alert('try again after some time as instructor didnot created the lab till now')
      }
    })

  }

  userData: any;
  regNo: any;

  checkLogin() {
    this.auth.authState.subscribe(user => {
      if (user) {
        this.firestore.collection('users').doc(user.uid).valueChanges().subscribe((data: any) => {
          this.userData = data
          console.log(this.userData);
          this.regNo = this.userData.email.slice(0, 9);

        })
      }
      else {
        this.router.navigate(['home'])
      }
    })
  }

  ngOnInit(): void {
    this.checkLogin()
    // this.post()
  }

}
