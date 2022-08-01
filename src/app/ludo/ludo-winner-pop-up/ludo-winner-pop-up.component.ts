import { Component, OnInit, Output , EventEmitter, Input, ViewChild, ElementRef} from '@angular/core';
import { Router } from '@angular/router';
import { LanguageModel } from 'src/app/language/langModel';

@Component({
  selector: 'app-ludo-winner-pop-up',
  templateUrl: './ludo-winner-pop-up.component.html',
  styleUrls: ['./ludo-winner-pop-up.component.css']
})
export class LudoWinnerPopUpComponent implements OnInit {
  isVisible =false;
  winnerName: string | undefined = "";
  winnerAvatar = document.getElementById('winnerPopupAvatar') as HTMLImageElement;
  // winnerAvatarimplement = this.winnerAvatar.src;
  type ='';
  typeclose='';
  popupMessage ='Connection error. Try Again.';
  btnText= '';
  closetxt= 'Close';
  langModel :any;
  @Output() isClaimed1 = new EventEmitter<string>();
  constructor() { }

  ngOnInit(): void {
  }
  ngAfterViewInit(){
  }
  goToLobby(){
    //this.router.navigateByUrl("")
    console.log("going to lobby play again");
    this.isClaimed1.emit("goToLobby");
  }
  goToHome(){
    //this.router.navigateByUrl("")
    this.isClaimed1.emit("goToHome");
  }

}
