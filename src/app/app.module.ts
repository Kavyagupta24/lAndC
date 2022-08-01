import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ClipboardModule } from 'ngx-clipboard';
import { LoginpageComponent } from './loginpage/loginpage.component';
import { LoadingpageComponent } from './loadingpage/loadingpage.component';
import { LandingpageComponent } from './landingpage/landingpage.component';
import { ProgressBarModule } from 'angular-progress-bar';
import { RegisterComponent } from './register/register.component';
import { FormsModule } from '@angular/forms';
import { CheckersComponent } from './checkers/checkers.component';
import { HomePageComponent } from './home-page/home-page.component';
import { HttpClientModule } from '@angular/common/http';
import {GlobalDetails} from './globalVars';
import { SettingsComponent } from './settings/settings.component';
import { SetPasswordComponent } from './set-password/set-password.component';
import { MessagepopupComponent } from './messagepopup/messagepopup.component';
import { ProfileLogoutComponent } from './profile-logout/profile-logout.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { LudoComponent } from './ludo/ludo.component';
import { PhoneLoginComponent } from './phone-login/phone-login.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { PhoneforgotPasswordComponent } from './phoneforgot-password/phoneforgot-password.component';
import { PhoneOtpComponent } from './phone-otp/phone-otp.component';
import { EmailOtpComponent } from './email-otp/email-otp.component';
import { PhoneSetPasswordComponent } from './phone-set-password/phone-set-password.component';
import { PhoneSignUpOtpComponent } from './phone-sign-up-otp/phone-sign-up-otp.component';
import { SetProfileComponent } from './set-profile/set-profile.component';
import { LudoRandomPlayComponent } from './ludo-random-play/ludo-random-play.component';
import { LudoLandingPageComponent } from './ludo-landing-page/ludo-landing-page.component';
import { CheckersPlayWFriendsComponent } from './checkers-play-wfriends/checkers-play-wfriends.component';
import { LeaderBoardComponent } from './leader-board/leader-board.component';
import { WalletComponent } from './payment/wallet/wallet.component';
import { StoreComponent } from './payment/store/store.component';
import { ReedemMoneyComponent } from './payment/reedem-money/reedem-money.component';
import { SuccessPageComponent } from './payment/success-page/success-page.component';
import { PayPopupComponent } from './payment/payment-popup/pay-popup.component';
import { PaymentHistoryComponent } from './payment/payment-history/payment-history.component';
import { ShareonmobileService } from 'src/app/shareonmobile.service';
import { LudoPlayWithFriendsComponent } from './ludo/ludo-play-with-friends/ludo-play-with-friends.component';
import {IvyCarouselModule} from 'angular-responsive-carousel';
import { TutorialComponent } from './tutorial/tutorial.component';
import { UserDetailsComponent } from './user-details/user-details.component';
import { LudoWinnerPopUpComponent } from './ludo/ludo-winner-pop-up/ludo-winner-pop-up.component';
import { TournamentsComponent } from './tournaments/tournaments.component';
import { TournamentDetailsComponent } from './tournament-details/tournament-details.component';
import { BankinfoComponent } from './bankinfo/bankinfo.component';
import { TncComponent } from './tnc/tnc.component';
import { SoundServiceService } from 'src/services/sound-serviceWeb.service';
import { LanguageModel } from './language/langModel';
import {ConnectionServiceModule} from 'ng-connection-service';

@NgModule({
  declarations: [
    AppComponent,
    LoginpageComponent,
    LoadingpageComponent,
    LandingpageComponent,
    RegisterComponent,
    CheckersComponent,
    HomePageComponent,
    SetPasswordComponent,
    SettingsComponent,
    MessagepopupComponent,
    ProfileLogoutComponent,
    ResetPasswordComponent,
    LudoComponent,
    LudoRandomPlayComponent,
    LudoLandingPageComponent,
    PhoneLoginComponent,
    ForgotPasswordComponent,
    PhoneforgotPasswordComponent,
    PhoneOtpComponent,
    PhoneSetPasswordComponent,
    PhoneSignUpOtpComponent,
    EmailOtpComponent,
    SetProfileComponent,
    CheckersPlayWFriendsComponent,
    LeaderBoardComponent,
    WalletComponent,
    StoreComponent,
    ReedemMoneyComponent,
    SuccessPageComponent,
    PayPopupComponent,
    PaymentHistoryComponent,
    LudoPlayWithFriendsComponent,
    LudoWinnerPopUpComponent,
    TutorialComponent,
    UserDetailsComponent,
    BankinfoComponent,
    TournamentsComponent,
    TournamentDetailsComponent,
    TncComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ClipboardModule,
    ProgressBarModule,
    IvyCarouselModule,
    FormsModule,
    HttpClientModule,
    ConnectionServiceModule 
    // FontAwesomeModule
  ],
  providers: [GlobalDetails, ShareonmobileService,SoundServiceService,LanguageModel],
  bootstrap: [AppComponent]
})
export class AppModule { }
