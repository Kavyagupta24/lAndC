import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiServiceService } from 'src/services/api-service.service';
import { SoundServiceService } from 'src/services/sound-serviceWeb.service';
import { GlobalDetails } from '../globalVars';
import { LanguageModel } from '../language/langModel';

@Component({
  selector: 'app-tournament-details',
  templateUrl: './tournament-details.component.html',
  styleUrls: ['./tournament-details.component.css']
})
export class TournamentDetailsComponent implements OnInit {

  constructor(private router: Router,public global: GlobalDetails,private soundService: SoundServiceService, public langModel: LanguageModel,private api:ApiServiceService) { }

  ngOnInit(): void {
  }
  back(){
    this.soundService.playAudio('click');
    this.router.navigateByUrl('tournaments');
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
      case 'redbox':
        if(this.global.gameName =="Ludo")
        {
           return {'background':'#660606',
           'border': '2px solid #a42323'};
        }
        else{
           return { 'background':'#006200',
           'border': '2px solid #3c9f21'};
        }
        break;
        case 'redBox-header':
          if(this.global.gameName =="Ludo")
          {
             return {'color':'#9a0e0e'};
          }
          else{
             return { 'color':'#006200'};
          }
          break; 
        case 'back-header':
          if(this.global.gameName =="Ludo")
          {
             return {'background': 'url(../../assets/img1/Header_Stretchable.png) 0/100% 100% no-repeat'};
          }
          else{
            return {'background': 'url(../../assets/Checkers_Home/header.png) 0/100% 100% no-repeat'};
          }
          break;

          case 'yellowbtn':
          if(this.global.gameName =="Ludo")
          {
             return {'background': 'url(../../assets/img1/button_green_bg.png) 0/100% 100% no-repeat',
             'color':'#fff'};
          }
          else{
            return {'background': 'url(../../assets/Checkers_Home/button_red.png) 0/100% 100% no-repeat',
             'color':'#fff'};
          }
          break;
          case 'betbox':
            if(this.global.gameName =="Ludo")
            {
               return {'background': 'url(../../assets/img1/randomPlay/textbox.png) 0/100% 100% no-repeat'};
            }
            else{
              return {'background': 'url(../../assets/Checkers_Home/textboxChecker.png) 0/100% 100% no-repeat'};
            }
            break;
      default:
        return { 'background-image': 'url(../../assets/img1/Repeatable_Bg.png),url(../../assets/img1/Stretchable_BG.png)'};
    }
  }

  onJoin(tId:any){
    console.log( tId,"tid");
    this.soundService.playAudio('click');
    this.api.registerTournaments(tId).subscribe((data: any)=>{
      console.log( data,"data after register");
      
     });
  }
}
