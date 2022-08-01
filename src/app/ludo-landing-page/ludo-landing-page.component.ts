import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SoundServiceService } from 'src/services/sound-serviceWeb.service';
import { GlobalDetails } from '../globalVars';
import { LanguageModel } from '../language/langModel';

@Component({
  selector: 'app-ludo-landing-page',
  templateUrl: './ludo-landing-page.component.html',
  styleUrls: ['./ludo-landing-page.component.css']
})
export class LudoLandingPageComponent implements OnInit {

  constructor(private router: Router,public global: GlobalDetails,private soundService: SoundServiceService, public langModel: LanguageModel) 
  {
    if(!this.global.isPlaying){
      if(this.global.gameName =="Ludo") this.soundService.soundName ="ludostart";
      else this.soundService.soundName ="Homepage";
       this.soundService.startMusic(); 
    }
  }

  ngOnInit(): void {
  }
  leaderboard(){
    this.soundService.playAudio('click');
    this.router.navigateByUrl('leaderBoard');
  }

  ludoRandomPlay(){
    this.soundService.playAudio('click');
    this.global.LudoGameType = "RP";
    this.router.navigateByUrl("ludoRandomPlay");
  }
  ludoPlayWFriends(){
    this.soundService.playAudio('click');
    this.global.LudoGameType = "PWF";
    this.router.navigateByUrl("ludoPlayWFriends");
  }
  checkersPlayWithFriends(){
    this.soundService.playAudio('click');
    this.global.checkersGameType = "PWF";
    this.router.navigateByUrl("checkersPlayWFriends");
  }
  onTournaments(){
    this.soundService.playAudio('click');
    this.soundService.soundName ="Championship";
    this.soundService.startMusic();
    this.router.navigateByUrl("tournaments");
  }
  setting(){
    this.soundService.playAudio('click');
    this.router.navigateByUrl('settings');
  }
  gameCheck(type:any){
    switch(type){
      case 'bg':
      if(this.global.gameName =="Ludo")
      {
         return { 'background-image': 'url(../../assets/img1/Repeatable_Bg.png),url(../../assets/img1/Stretchable_BG.png)'};
      }
      else{
         return { 'background-image': 'url(../../assets/img1/Repeatable_Bg.png),url(./../../assets/BG_1px.png)'};
      }
      break;
      case 'anchorGame':
        if(this.global.gameName =="Ludo")
        {
           return {'color':'#9a0e0e'};
        }
        else{
           return { 'color':'#006200'};
        }
        break;
        case 'user-coin':
        if(this.global.gameName =="Ludo")
        {
           return {'background': 'url(../../assets/img1/homePage/coins_Bg.png) 0/100% 100% no-repeat'};
        }
        else{
          return {'background': 'url(../../assets/Checkers_Home/textbox.png) 0/100% 100% no-repeat'};
        }
        break;
      default:
        return { 'background-image': 'url(../../assets/img1/Repeatable_Bg.png),url(../../assets/img1/Stretchable_BG.png)'};
    }
  }
  back(){
    this.soundService.stopMusic();
    this.soundService.playAudio('click');
    this.global.gameName ="Home";
    this.router.navigateByUrl('homePage');
  }
  tutorial(){
    this.soundService.playAudio('click');
    this.router.navigateByUrl('tutorial');
  }
}
