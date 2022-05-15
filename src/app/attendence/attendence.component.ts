import { Component, Inject, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore'
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AngularFireAuth } from '@angular/fire/auth'
import { timestamp } from 'rxjs/operators';

@Component({
  selector: 'app-attendence',
  templateUrl: './attendence.component.html',
  styleUrls: ['./attendence.component.scss']
})
export class AttendenceComponent implements OnInit {

  constructor(
    private firestore: AngularFirestore,
    private dialog: MatDialog,
    private auth: AngularFireAuth,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    alert( data.c_slot)
    this.getLab()
  }

  foods: string[] = ['Present', 'Absent']

  close() {
    this.dialog.closeAll()
  }

  assistants: any;

  getLab() {
    this.firestore.collection('labs').doc(this.data.labID).collection('student-assistants').valueChanges().subscribe((labData: any) => {
      console.log(labData);
      this.assistants = labData

    })
  }

  status: string;
  name: string;
  regNo: string
  absent: any[] = []
  present: any[] = []

  markAttendence(param, name, regNo) {
    console.log(param, name, regNo);
    this.status = param;
    this.name = name;
    this.regNo = regNo
    if (param == 'Absent') {
      this.absent.push(regNo)
    }
    else {
      this.present.push(regNo)
    }
    console.log('present', this.present);
    console.log('absent', this.absent);


  }

  saveAtendence() {
    this.spin = true
    this.present.push('alpha')
    this.absent.push('alpha')
    const present = this.present
    const absent = this.absent
    const timestamp = new Date()
    const date = timestamp.getDate()
    const month = timestamp.getMonth()
    const slot = this.data.c_slot
    this.firestore.collection('labs').doc(this.data.labID).collection('attendence').add({
      present, absent, date, month, slot
    }).then((d) => {
      const docID = d.id
      this.firestore.collection('labs').doc(this.data.labID).collection('attendence').doc(d.id).update({
        docID
      }).then(() => {
        this.close()
        alert('attendece submitted for' + this.data.c_slot)
        this.spin = false
      })
    })
  }

  time: any;
  show: boolean = false
  spin: boolean = false

  checkAttendence() {
    this.spin = true

    this.time = new Date()
    const date = this.time.getDate()
    const month = this.time.getMonth()
    this.firestore.collection('labs').doc(this.data.labID).collection('attendence', q => q.where('slot', '==', this.data.c_slot).where('date', '==', date).where('month', '==', month)).valueChanges().subscribe(data => {
      if (data.length > 0) {
        console.log(data);
        alert('attendence for this slot for today is already marked')
        this.show = true
        this.spin = false
      }
      else {
        this.show = false
        console.log('noo record of attendece found for today');
        this.spin = false
      }
    })
  }

  ngOnInit(): void {
    this.checkAttendence()


  }

}
