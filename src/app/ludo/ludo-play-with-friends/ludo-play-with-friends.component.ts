import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalDetails } from './../../globalVars'
import { Client } from 'colyseus.js';
import { MessagepopupComponent } from 'src/app/messagepopup/messagepopup.component';
import { SoundServiceService } from 'src/services/sound-serviceWeb.service';
import { LanguageModel } from 'src/app/language/langModel';
 const client = new Client("ws://34.197.91.228:3003");
//const client = new Client("ws://localhost:3004");
@Component({
  selector: 'app-ludo-play-with-friends',
  templateUrl: './ludo-play-with-friends.component.html',
  styleUrls: ['./ludo-play-with-friends.component.css']
})
export class LudoPlayWithFriendsComponent implements OnInit {
  roomCode: string = "";
  roomExsitOrnot: boolean = false;
  @ViewChild(MessagepopupComponent)
  messagePopUp: MessagepopupComponent = new MessagepopupComponent;
  constructor(private router: Router, private global: GlobalDetails,private soundService: SoundServiceService, public langModel: LanguageModel) { }
  back(){
    this.soundService.playAudio('click');
    console.log("going back to Ludo landing page");
    this.router.navigateByUrl("ludoLandingPage")
  }
  create(){
    this.soundService.playAudio('click');
    this.global.createOrJoin = "create";
    this.global.LudoGameType = "PWF";
    this.router.navigateByUrl('ludoRandomPlay');
  }
  ngOnInit(): void {
  }
  onClaim(type:any){
    this.soundService.playAudio('click');
    this.messagePopUp.isVisible= false;
  }
  async ludoJoin(){
    this.soundService.playAudio('click');
    this.global.createOrJoin = "join";
    this.global.roomCode = this.roomCode;
    if(this.global.createOrJoin == "join"){
      await client.getAvailableRooms("playWithFriends").then(rooms => {
        console.log("total rooms -> ",rooms.length);
        rooms.forEach((room) => {
          if(String(this.global.roomCode) == String(room.roomId)){
            // console.log("herererere");
            this.roomExsitOrnot = true;
          }
          console.log(room.roomId.length , this.global.roomCode?.length);
          console.log(room.clients);
          console.log(room.maxClients);
          console.log(room.metadata);
        });
      }).catch(e => {
        console.error(e);
      });
      console.log(this.roomExsitOrnot);
      if(this.roomExsitOrnot == false){
        this.messagePopUp.isVisible= true;
        this.messagePopUp.popupMessage = this.langModel.componentLang.popups.wrongCode[this.langModel.lang];
     this.messagePopUp.closetxt = this.langModel.componentLang.popups.close[this.langModel.lang];
      }else{
        this.global.checkersGameType = "PWF";
        this.global.createOrJoin = "join";
      this.router.navigateByUrl('ludo');
      }
    }
    
  }
}
