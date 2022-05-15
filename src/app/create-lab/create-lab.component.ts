import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore'
import { MatDialog } from '@angular/material/dialog';
import { AngularFireAuth } from '@angular/fire/auth'
@Component({
  selector: 'app-create-lab',
  templateUrl: './create-lab.component.html',
  styleUrls: ['./create-lab.component.scss']
})
export class CreateLabComponent implements OnInit {

  constructor(
    private firestore: AngularFirestore,
    private dialog: MatDialog,
    private auth: AngularFireAuth
  ) { }
  spin: boolean;

  labName: string
  courseCode: string;
  slot1: any;
  slot2: any;

  validate() {
    this.spin = true
    if (this.labName && this.courseCode && this.slot1 && this.slot2) {

      const labName = this.labName
      const courseCode = this.courseCode
      const slot1 = this.slot1
      const slot2 = this.slot2
      const createdAt = new Date()
      const SA = 0
      const teacherName = this.currentUser.name
      const teacherID = this.currentUser.userID


      this.firestore.collection('labs').add({
        labName, slot1, courseCode, slot2, createdAt, SA, teacherName, teacherID
      }).then(doc => {
        const docID = doc.id
        this.firestore.collection('labs').doc(doc.id).update({
          docID
        })
      }).then(() => {
        alert('lab created successfully')
        this.spin = false
        this.close()

      })


    }
    else {
      alert('cant leave field blank')
      this.spin = false
    }

  }
  close() {
    this.dialog.closeAll()
  }
  currentUser: any;
  ngOnInit(): void {

    this.auth.authState.subscribe(d => {
      if (d) {
        this.firestore.collection('users').doc(d.uid).valueChanges().subscribe(data => {
          this.currentUser = data

        })
      }
    })
  }

}
