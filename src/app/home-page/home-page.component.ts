import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiServiceService } from 'src/services/api-service.service';
import { LocalDbService } from 'src/services/local-db.service';
import { SoundServiceService } from 'src/services/sound-serviceWeb.service';
import { GlobalDetails } from '../globalVars';
import { LanguageModel } from '../language/langModel';

declare var particlesJS: any;
@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {
  avatarimg:any;
  constructor(private router: Router ,private localDb: LocalDbService,private api: ApiServiceService, public global: GlobalDetails,private soundService: SoundServiceService, public langModel: LanguageModel) { }
  
  ngOnInit(): void {
    this.getUserDetails();
    
    this.getCoins();
    this.getGamesRankLudo();
    this.getGamesRankCheckers();
    this.global.isforgotPwd = false;
    this.avatarimg = "../../assets/img/profile/Avatar"+this.global.avatar+".png";
    particlesJS.load('particles-js', 'assets/json_files/particlesjs-config.json', null);
    this.soundService.stopMusic();
    this.global.isPlaying =false;
    this.global.gameName ="Home";
  }
  back(){
    this.soundService.playAudio('click');
    this.router.navigateByUrl('clubLandingPage');
  }
  
  getUserDetails(){
    this.api.getUserDetails().subscribe((data) => {
      var response = data;
      console.log("response---------->",response,response.userName);
      if(response.userName == null ) response.userName ='Genilson';
      this.global.userName = response.userName;
      if(response.avatarId == 0 ) response.avatarId =1;
      this.global.avatar = response.avatarId;
      this.avatarimg = "../../assets/img/profile/Avatar"+this.global.avatar+".png";
      
      this.global.firstName = response.firstName;
      this.global.lastName = response.lastName;
      if(response.dob != null ){
        var result = response.dob.slice(0, 10);
        this.global.dOb = result;
      }
      this.global.address = response.address;
      this.global.myEmail = response.email;
      this.global.myphone = response.phoneNumber;
      if(response.gender != null ){
        if(response.gender == "male") response.gender ="Male";
        if(response.gender == "female") response.gender ="Female";
        this.global.gender = response.gender;
      }
      
      this.global.accNum = response.bankAccNum;
      this.global.bankName = response.bankName;
      this.global.expPhoneNumber = response.expressPhoneNumber;
      this.global.phoneVerified = response.phoneVerified;
      this.global.emailVerified = response.emailVerified;
    },(e: any) => {
      console.log("eee",JSON.stringify(e));
    //   this.messagePopUp.isVisible= true;
    //   if(e.error.message!= null) {
    //     this.messagePopUp.popupMessage = JSON.stringify(e.error.message);
    //     }else {
    //       this.messagePopUp.popupMessage = "Connection error. Try Again.";
    //     }
    //  this.router.navigateByUrl('landingPage');
      });
    
  }
  getCoins(){
    this.api.getCoins().subscribe((data) => {
      var response = data;
      console.log("response---------->",response);
     this.global.coins = response.coins;
     //this.global.moneyAmt = response.money;
     this.getRealMoney();
      
    },(e: any) => {
      console.log("eee",JSON.stringify(e));
    //   this.messagePopUp.isVisible= true;
    //   if(e.error.message!= null) {
    //     this.messagePopUp.popupMessage = JSON.stringify(e.error.message);
    //     }else {
    //       this.messagePopUp.popupMessage = "Connection error. Try Again.";
    //     }
    //  this.router.navigateByUrl('landingPage');
      });
    
  }
  getRealMoney(){
    this.api.getRealMoney().subscribe((data) => {
      var response = data;
      console.log("response---------->",response);
    // this.global.coins = response.coins;
     this.global.moneyAmt = this.global.coins * response[0].value;
     this.global.moneyVal = response[0].value;
      
    },(e: any) => {
      console.log("eee",JSON.stringify(e));
    //   this.messagePopUp.isVisible= true;
    //   if(e.error.message!= null) {
    //     this.messagePopUp.popupMessage = JSON.stringify(e.error.message);
    //     }else {
    //       this.messagePopUp.popupMessage = "Connection error. Try Again.";
    //     }
    //  this.router.navigateByUrl('landingPage');
      });
  }
  getGamesRankLudo(){
    this.api.getRank("ludo").subscribe((data) => {
      var response = data;
      console.log("response of games---------->",response);
     this.global.winsLudo = response.wins;
      
    },(e: any) => {
      console.log("eee",JSON.stringify(e));
    //   this.messagePopUp.isVisible= true;
    //   if(e.error.message!= null) {
    //     this.messagePopUp.popupMessage = JSON.stringify(e.error.message);
    //     }else {
    //       this.messagePopUp.popupMessage = "Connection error. Try Again.";
    //     }
    //  this.router.navigateByUrl('landingPage');
      });
  }
  getGamesRankCheckers(){
    this.api.getRank("checkers").subscribe((data) => {
      var response = data;
      console.log("response of games---------->",response);
     this.global.winsCheckers = response.wins;
      
    },(e: any) => {
      console.log("eee",JSON.stringify(e));
    //   this.messagePopUp.isVisible= true;
    //   if(e.error.message!= null) {
    //     this.messagePopUp.popupMessage = JSON.stringify(e.error.message);
    //     }else {
    //       this.messagePopUp.popupMessage = "Connection error. Try Again.";
    //     }
    //  this.router.navigateByUrl('landingPage');
      });
  }
  checkers(){
    this.soundService.playAudio('click');
    this.global.gameName ="Checkers";
    this.router.navigateByUrl('ludoLandingPage');
    //this.router.navigateByUrl('checkers');
  }
  ludoGames(){
    this.soundService.playAudio('click');
    this.global.gameName ="Ludo";
    this.router.navigateByUrl('ludoLandingPage');
  }
  setting(){
    this.soundService.playAudio('click');
    this.router.navigateByUrl('settings')
  }
  profileRoute(){
    this.soundService.playAudio('click');
    this.router.navigateByUrl('profileLogout');
  }
  storeClicked(){
    this.soundService.playAudio('click');
    this.router.navigateByUrl('store');
  }
  walletClicked(){
    this.soundService.playAudio('click');
    this.router.navigateByUrl('wallet');
  }
}
