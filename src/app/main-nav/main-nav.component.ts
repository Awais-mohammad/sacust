import { Component, HostListener } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { RegisterUsersComponent } from '../register-users/register-users.component';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { CreateLabComponent } from '../create-lab/create-lab.component';
import {MatBottomSheet, MatBottomSheetRef} from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.scss']
})
export class MainNavComponent {

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(
    private breakpointObserver: BreakpointObserver,
    private dialog: MatDialog,
    private firestore: AngularFirestore,
    private auth: AngularFireAuth,
    private router: Router,
    private _bottomSheet: MatBottomSheet
  ) {
    // this.createLab()
    this.currentUser()
  }

  typesOfShoes: string[] = ['Profile', 'Logout'];
  width: number;
  selectedOptions: string;

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.width = window.innerWidth;
  }

  list: boolean = false;

  showHideList() {
    this.list = !this.list
  }

  onChange(change) {
    console.log(change.option.value, change.option.selected);
    if (change.option.value == 'Logout') {
      // this.logout()
    }
  }

  openDialog(uTyp) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.height = '650px';
    dialogConfig.width = '500px';
    dialogConfig.data = {
      user: uTyp,
    };
    this.dialog.open(RegisterUsersComponent, dialogConfig);
  }


  logOut() {
    this.auth.auth.signOut().then(() => {
      this.router.navigate(['home'])
    })
  }

  cUser: any;

  currentUser() {
    this.auth.authState.subscribe(user => {
      if (user) {
        if (user.uid) {
          this.firestore.collection('users').doc(user.uid).valueChanges().subscribe((data: any) => {
            this.cUser = data;
            console.log(this.cUser);

          })
        }
      }
    })
  }

  createLab() {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.height = '600px';
    dialogConfig.width = '500px';
    this.dialog.open(CreateLabComponent, dialogConfig);
  }


  gotopage(param) {
    this.router.navigate([param])
    
  }
}
