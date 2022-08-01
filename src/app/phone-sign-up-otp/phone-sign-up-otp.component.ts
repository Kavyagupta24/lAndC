import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ApiServiceService } from 'src/services/api-service.service';
import { LocalDbService } from 'src/services/local-db.service';
import { SoundServiceService } from 'src/services/sound-serviceWeb.service';
import { GlobalDetails } from '../globalVars';
import { LanguageModel } from '../language/langModel';
import { MessagepopupComponent } from '../messagepopup/messagepopup.component';

@Component({
  selector: 'app-phone-sign-up-otp',
  templateUrl: './phone-sign-up-otp.component.html',
  styleUrls: ['./phone-sign-up-otp.component.css']
})
export class PhoneSignUpOtpComponent implements OnInit {

  @ViewChild(MessagepopupComponent)
  messagePopUp: MessagepopupComponent = new MessagepopupComponent;
  constructor(private router: Router, private global: GlobalDetails, private api: ApiServiceService,
    private localDb: LocalDbService,private soundService: SoundServiceService, public langModel: LanguageModel) { }

  ngOnInit(): void {
  }
  // phone:any=this.global.myEmail
  code: any = this.global.countryCode
  phone: any = this.global.myphone
  phNumber: any = this.code + ' ' + this.phone
  otp: any;
  // otpvalidation:any;

  checkOtp() {
    this.soundService.playAudio('click');
    // this.router.navigateByUrl("setPassword")
    this.global.OTP = this.otp;

    if (this.global.isforgotPwd) {
      this.api.phoneOtpVerificationResend().subscribe((data) => {
        var otpVarify = data
        console.log(otpVarify)
        if (otpVarify) {
          if(otpVarify.message != 'Wrong otp entered')this.router.navigateByUrl('phoneSetPassword');
          else{
            this.messagePopUp.isVisible= true;
           this.messagePopUp.popupMessage = this.langModel.componentLang.popups.wrongOTP[this.langModel.lang];
     this.messagePopUp.closetxt = this.langModel.componentLang.popups.close[this.langModel.lang];
          }
        }
        else {
          this.messagePopUp.isVisible = true;
          this.messagePopUp.popupMessage = this.langModel.componentLang.popups.enterOTP[this.langModel.lang];
     this.messagePopUp.closetxt = this.langModel.componentLang.popups.close[this.langModel.lang];
        }

      });
    } else {
      this.api.phoneOtpVerification().subscribe((data) => {
        var otpVarify = data
        console.log(otpVarify)
        if (otpVarify) {
          if(otpVarify.message != 'Wrong otp entered')this.router.navigateByUrl('phoneSetPassword');
          else{
            this.messagePopUp.isVisible= true;
            this.messagePopUp.popupMessage = this.langModel.componentLang.popups.wrongOTP[this.langModel.lang];
            this.messagePopUp.closetxt = this.langModel.componentLang.popups.close[this.langModel.lang];
          }
        }
        else {
          this.messagePopUp.isVisible = true;
          this.messagePopUp.popupMessage = this.langModel.componentLang.popups.enterOTP[this.langModel.lang];
     this.messagePopUp.closetxt = this.langModel.componentLang.popups.close[this.langModel.lang];
        }

      });
    }
    // console.log(this.otpvalidation)
    // if(this.otpvalidation === true){


    // }

  }
  onClaim(evt: any) {
    this.soundService.playAudio('click');
    this.messagePopUp.isVisible = false;
  }
  resend() {
    this.soundService.playAudio('click');
    if(this.global.isforgotPwd){
      this.api.phoneOtpResend().subscribe((data)=>{
      console.log( data," this.res this.res");
    });
  }
  else{
    this.api.phoneOtp().subscribe((data)=>{
      console.log( data," this.res this.res");
    });
  }
  }

  back() {
    this.soundService.playAudio('click');
    this.router.navigateByUrl("register")
  }

}

