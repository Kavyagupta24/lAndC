import { Component, ViewChild, ViewEncapsulation} from '@angular/core';
// import { DOCUMENT } from '@angular/common';
import { Meta } from '@angular/platform-browser';
import { Client } from 'colyseus.js';
import "jquery";
import { Router } from '@angular/router';
import { MessagepopupComponent } from '../messagepopup/messagepopup.component';
import { GlobalDetails } from '../globalVars';
import { ShareonmobileService } from 'src/app/shareonmobile.service';
import { SoundServiceService } from 'src/services/sound-serviceWeb.service';
import { LudoWinnerPopUpComponent } from '../ludo/ludo-winner-pop-up/ludo-winner-pop-up.component';
import { LanguageModel } from '../language/langModel';


//import * as $ from "jquery";
//import { jQuery } from "jquery";

declare var popupFail: any;
declare const joinLobby: any;
declare const leaveLobbyRoom: any;
declare const leaveGameRoom: any;
declare var $:JQueryStatic;
// declare var Client: Client;
declare var jQuery: any;
declare var PWFroomId: any;
//const client = new Client("ws://localhost:3001");
const client = new Client("ws://34.197.91.228:3002");
// For sign in: ws://34.197.91.228:3001/
@Component({
  selector: 'app-root',
  templateUrl: './checkers.component.html',
    styleUrls: ['./checkers.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class CheckersComponent {
  //@ViewChild('elements') element: ElementRef | undefined;
  name = 'Angular';
  isFail: any;
  images: Array<{}>=[];
  inviteScreen: any = true;
  gameType: string | undefined = '';
  createOrJoin: string | undefined = '';
  roomCode: string = "";
  PWFCreateorJoin: boolean = false;
  myName: string | undefined = '';
  indexOfEntry: number = 0;
  entryArray = [10, 20, 30, 40, 50, 60];
  rewardsArray = [100, 200, 300, 400, 500, 600];

  entry: number = this.entryArray[this.indexOfEntry];
  reward: number = this.rewardsArray[this.indexOfEntry];
  @ViewChild(LudoWinnerPopUpComponent)
  LudoWinnerPopUp: LudoWinnerPopUpComponent = new LudoWinnerPopUpComponent;
  @ViewChild(MessagepopupComponent)
  messagePopUp: MessagepopupComponent = new MessagepopupComponent;
  constructor(private meta: Meta, private router: Router, public global: GlobalDetails, private shareService: ShareonmobileService,private soundService: SoundServiceService, public langModel: LanguageModel){
    this.gameType = this.global.checkersGameType;
    this.createOrJoin = this.global.createOrJoin;
    this.myName = this.global.userName;
    
    this.images = [
      {path: './../../assets/Brand1.png'},
      {path: './../../assets/brand2.png'},
      {path: './../../assets/Brand3.png'},
      {path: './../../assets/Brand4.png'}
      
  ]
  }
  
  
  ngOnInit(){
    
  }
  ngAfterViewInit(){
    console.log("gameType", this.global.checkersGameType);
    if(this.gameType == 'PWF' && this.createOrJoin == 'create'){
      console.log("gameType : ", this.gameType, " create");
      document.getElementById("PWFcreate")!.style.display = 'block';
      document.getElementById("gameScreen")!.style.display = 'none';
    }else if((this.gameType == 'PWF' && this.createOrJoin == 'join') || this.gameType == 'RP'){
      console.log("gameType : ", this.gameType, " join");
      var myavatar = document.getElementById(
        'myAvatar'
      )! as HTMLImageElement;
      myavatar.src =
        '../../assets/img/profile/Avatar' +
        this.global.avatar +
        '.png';
      document.getElementById("searchingPlayers")!.style.display = 'block';
      document.getElementById("gameScreen")!.style.display = 'none';
      document.getElementById("PWFcreate")!.style.display = 'none';

    }
    var userName = this.global.userName;
    if(userName === null){
      console.log("userName is null");
      return;
    }
    else{
      joinLobby($, client, this.router, this.messagePopUp, userName, this.global.checkersGameType, this.global.roomCode, this.global.createOrJoin, this.global.avatar, this.global.userId,this.soundService, this.LudoWinnerPopUp, this.langModel);
    }
  }
  increaseAmount(){
    this.soundService.playAudio('click');
    if(this.indexOfEntry < this.entryArray.length-1){
      this.indexOfEntry = this.indexOfEntry + 1;
      this.entry = this.entryArray[this.indexOfEntry];
      this.reward = this.rewardsArray[this.indexOfEntry];
      console.log(this.entry, this.reward, this.indexOfEntry);
    }
  }
  decreaseAmount(){
    this.soundService.playAudio('click');
    if(this.indexOfEntry > 0){
      this.indexOfEntry = this.indexOfEntry - 1;
      this.entry = this.entryArray[this.indexOfEntry];
      this.reward = this.rewardsArray[this.indexOfEntry];
      console.log(this.entry, this.reward, this.indexOfEntry);
    }
  }
  onclick(){
    
    //var userName = prompt("Please enter your name:");
    
  }
  endGame(){
    // alert("You have quit the game");
    this.messagePopUp.isVisible= true;
    this.messagePopUp.type = 'option';
    this.messagePopUp.popupMessage = this.langModel.componentLang.popups.gameQuit[this.langModel.lang];
      this.messagePopUp.closetxt = this.langModel.componentLang.popups.no[this.langModel.lang];
      this.messagePopUp.btnText = this.langModel.componentLang.popups.yes[this.langModel.lang];
  }
  onClaim(type:any){
    this.soundService.playAudio('click');
    if(type == 'yes'){
      leaveLobbyRoom();
      leaveGameRoom();
      this.router.navigateByUrl('homePage');
    }
    // else{
    //   }
    this.messagePopUp.isVisible= false;
    if(type == 'close'){
        if(popupFail == 1 ){
          this.router.navigateByUrl('homePage');
          popupFail = null;
        }else if(popupFail == 2){
          this.router.navigateByUrl('homePage');
          popupFail = null;
        }
        // if(this.isFail == 'successfull') this.router.navigateByUrl('homePage');
        // else if(this.isFail == 'error')this.router.navigateByUrl('landingPage');
      this.isFail = '';
      }
    }
    onClaim1(type:any){
      if(type == "goToLobby"){
        this.soundService.playAudio('click');
        this.LudoWinnerPopUp.isVisible = false;
        this.router.navigateByUrl("checkers");
      }else if(type == "goToHome"){
        this.soundService.playAudio('click');
        this.LudoWinnerPopUp.isVisible = false;
        this.router.navigateByUrl("homePage");
      }
    }
  endGame1(){
      //this.router.navigateByUrl('ludoRandomPlay');
      this.messagePopUp.isVisible= true;
    this.messagePopUp.type = 'option';
    this.messagePopUp.popupMessage = this.langModel.componentLang.popups.roomRemove[this.langModel.lang];
      this.messagePopUp.closetxt = this.langModel.componentLang.popups.no[this.langModel.lang];
      this.messagePopUp.btnText = this.langModel.componentLang.popups.yes[this.langModel.lang];
    }
  shareCode(){
    this.soundService.playAudio('click');
      this.shareService.openSharePvtRoom(PWFroomId);
    }
  // checkersPopup(message: any){
  //   this.messagePopUp.isVisible= true;
  //   this.messagePopUp.popupMessage = JSON.stringify(message);
  // }
}
