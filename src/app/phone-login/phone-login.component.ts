import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ApiServiceService } from 'src/services/api-service.service';
import { LocalDbService } from 'src/services/local-db.service';
import { SoundServiceService } from 'src/services/sound-serviceWeb.service';
import { GlobalDetails } from '../globalVars';
import { LanguageModel } from '../language/langModel';
import { MessagepopupComponent } from '../messagepopup/messagepopup.component';

@Component({
  selector: 'app-phone-login',
  templateUrl: './phone-login.component.html',
  styleUrls: ['./phone-login.component.css']
})
export class PhoneLoginComponent implements OnInit {
  phone:number=NaN
  invalidEmail= false;
  // email: string = "";
  password: string = "";
  isFail: string = "";
  code:any;
  codeArray=[
    {countryCode:"244"},
    {countryCode:"243"},
    {countryCode:"245"},
  ]
  @ViewChild(MessagepopupComponent)
  messagePopUp: MessagepopupComponent = new MessagepopupComponent;
  constructor(private router:Router,private global: GlobalDetails, private api: ApiServiceService,
    private localDb: LocalDbService,private soundService: SoundServiceService, public langModel: LanguageModel) { }

  ngOnInit(): void {
    this.code=this.codeArray[0].countryCode
  }
  
  validateDetails(){
    this.soundService.playAudio('click');
    // console.log(this.code)
    var emailValid = this.phoneCheck(this.phone);
      if(this.phoneCheck(this.phone) == false){ //emailValid==false
        this.invalidEmail=true;
        //alert("Enter Correct Email Address");
      this.messagePopUp.isVisible= true;
      this.messagePopUp.popupMessage = this.langModel.componentLang.popups.wrongPhnNum[this.langModel.lang];
     this.messagePopUp.closetxt = this.langModel.componentLang.popups.close[this.langModel.lang];
        console.log('invalidPhoneornot--------->',this.phoneCheck(this.phone),"---------invalidPhone",this.invalidEmail);
      }
      else {
        // this.global.myEmail = this.code+" "+this.phone;
        this.global.myphone=this.phone;
        this.global.countryCode=this.code;
        this.global.password = this.password;
        console.log("globalPhoneNumber-------->",this.global.countryCode ,this.global.myphone);
        this.login();
      }

      // if(this.invalidEmail == false){
      //   this.router.navigateByUrl('setPassword');
      //   console.log('setPassword route');
      // }
      console.log("check phone",emailValid);
  }

  login(){
    this.api.phoneSignIn().subscribe((data) => {
      var response = data;
      console.log("response---------->",response);
      this.global.authToken = response.authToken;
      this.global.userId = response.userId;
      this.getUserDetails();
     
      //alert("You have logged in successfully");
      //this.router.navigateByUrl('homePage');
     

    },(e: any) => {
      this.messagePopUp.isVisible= true;
      if(e.error.message!= null) {
      this.messagePopUp.popupMessage = this.langModel.componentLang.popups.invalid[this.langModel.lang];
     this.messagePopUp.closetxt = this.langModel.componentLang.popups.close[this.langModel.lang];
      }else {
        this.messagePopUp.popupMessage = this.langModel.componentLang.popups.connectionErr[this.langModel.lang];
     this.messagePopUp.closetxt = this.langModel.componentLang.popups.close[this.langModel.lang];
      }
      this.isFail = 'error';
      //alert(JSON.stringify(e.error.message));
      //if(JSON.stringify(e.error.message)=="")
      });
  }

  getUserDetails(){
    this.api.getUserDetails().subscribe((data) => {
      var response = data;
      console.log("response---------->",response.userName);
      if(response.userName == null ) response.userName ='Genilson';
      this.global.userName = response.userName;
      if(response.avatarId == 0 ) response.avatarId =1;
      this.global.avatar = response.avatarId;
      this.localDb.setGameSessionData();
      this.messagePopUp.isVisible= true;
      this.messagePopUp.popupMessage = this.langModel.componentLang.popups.successLogin[this.langModel.lang];
     this.messagePopUp.closetxt = this.langModel.componentLang.popups.next[this.langModel.lang];
      this.isFail = 'successfull';
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
  phoneCheck(phone:any){
    var re = /[0-9]{6,14}/;
    if (!(re.test(phone))) {
      return false;
    }
    else{
      return true;
    }	

  }
  onClaim(evt:any){
    this.soundService.playAudio('click');
    this.messagePopUp.isVisible= false;
    if(evt == 'close'){
      if(this.isFail == 'successfull') this.router.navigateByUrl('homePage');
     // else if(this.isFail == 'error')this.router.navigateByUrl('landingPage');
    this.isFail = '';
    }
  }

  back(){
    this.soundService.playAudio('click');
    this.router.navigateByUrl('landingPage');
  }
  reset(){
    this.soundService.playAudio('click');
    this.router.navigateByUrl('phoneforgotPassword');
  }
}



