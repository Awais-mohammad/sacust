import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss']
})
export class FeedbackComponent implements OnInit {

  constructor(
    private dialog: MatDialog
  ) { }

  close() {
    this.dialog.closeAll()
  }
  ngOnInit(): void {
  }

  submit() {
    this.close()
    alert('feedback submitted')
  }
}
