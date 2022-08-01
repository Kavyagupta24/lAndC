import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ApiServiceService } from 'src/services/api-service.service';
import { LocalDbService } from 'src/services/local-db.service';
import { SoundServiceService } from 'src/services/sound-serviceWeb.service';
import { GlobalDetails } from '../globalVars';
import { LanguageModel } from '../language/langModel';
import { MessagepopupComponent } from '../messagepopup/messagepopup.component';

@Component({
  selector: 'app-email-otp',
  templateUrl: './email-otp.component.html',
  styleUrls: ['./email-otp.component.css']
})
export class EmailOtpComponent implements OnInit {

  @ViewChild(MessagepopupComponent)
  messagePopUp: MessagepopupComponent = new MessagepopupComponent;
  constructor(private router:Router,private global: GlobalDetails, private api: ApiServiceService,
    private localDb: LocalDbService,private soundService: SoundServiceService, public langModel: LanguageModel) { }

  ngOnInit(): void {
  }
  email:any=this.global.myEmail
  otp:any;
  checkOtp(){
    this.soundService.playAudio('click');
    this.api.verifyOtpEmail(this.otp).subscribe((data) => {
      var response = data;
      console.log("response---------->",response);
      if(response.message != 'Invalid OTP')this.router.navigateByUrl('setPassword');
      else{
        this.messagePopUp.isVisible= true;
       this.messagePopUp.popupMessage = this.langModel.componentLang.popups.wrongOTP[this.langModel.lang];
      this.messagePopUp.closetxt = this.langModel.componentLang.popups.close[this.langModel.lang];
      }// this.global.authToken = response.status;
      // this.global.userId = response.message;
      // //alert("You have registered successfully");
      // this.messagePopUp.isVisible= true;
      // this.messagePopUp.popupMessage = 'You have registered successfully.';
      // this.isFail = 'successfull';
      
      
    },(e: any) => {
      //alert(JSON.stringify(e.error.message));
      this.messagePopUp.isVisible= true;
      if(e.error.message!= null) {
        this.messagePopUp.popupMessage = JSON.stringify(e.error.message);
        }else {
          this.messagePopUp.popupMessage = this.langModel.componentLang.popups.connectionErr[this.langModel.lang];
      this.messagePopUp.closetxt = this.langModel.componentLang.popups.close[this.langModel.lang];
        }
      //this.isFail = 'error';
     // this.router.navigateByUrl('landingPage');
      });
    //this.router.navigateByUrl("resetPassword")
  }
  resend(){
    this.soundService.playAudio('click');
    this.api.getOtpEmail().subscribe((data) => {
      var response = data;
      console.log("response---------->",response);
      if(response.success){
        this.messagePopUp.isVisible= true;
        this.messagePopUp.popupMessage = this.langModel.componentLang.popups.successOtp[this.langModel.lang];
      this.messagePopUp.closetxt = this.langModel.componentLang.popups.close[this.langModel.lang];
      }
      // this.global.authToken = response.status;
      // this.global.userId = response.message;
      // //alert("You have registered successfully");
      // this.messagePopUp.isVisible= true;
      // this.messagePopUp.popupMessage = 'You have registered successfully.';
      // this.isFail = 'successfull';
      
      
    },(e: any) => {
      //alert(JSON.stringify(e.error.message));
      this.messagePopUp.isVisible= true;
      if(e.error.message!= null) {
        this.messagePopUp.popupMessage = JSON.stringify(e.error.message);
        }else {
          this.messagePopUp.popupMessage = this.langModel.componentLang.popups.connectionErr[this.langModel.lang];
      this.messagePopUp.closetxt = this.langModel.componentLang.popups.close[this.langModel.lang];
        }
     // this.router.navigateByUrl('landingPage');
      });
  }

  back(){
    this.soundService.playAudio('click');
    this.router.navigateByUrl("register");
  }
  onClaim(evt:any){
    this.soundService.playAudio('click');
    this.messagePopUp.isVisible= false;
    if(evt == 'close'){
      //this.isFail == 'successfull') this.router.navigateByUrl('homePage');
     // else if(this.isFail == 'error')this.router.navigateByUrl('landingPage');
   // this.isFail = '';
    }
  }

}
