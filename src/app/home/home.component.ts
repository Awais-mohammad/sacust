import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { LoginComponent } from '../login/login.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(
    private dialog: MatDialog,
  ) { }

  openDialog(uTyp){
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.height = '520px';
    dialogConfig.width = '500px';
    dialogConfig.data = {
      user: uTyp,
    };
    this.dialog.open(LoginComponent, dialogConfig);
  }

  ngOnInit(): void {
  }

}
