import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiServiceService } from 'src/services/api-service.service';
import { SoundServiceService } from 'src/services/sound-serviceWeb.service';
import { GlobalDetails } from '../globalVars';
import { LanguageModel } from '../language/langModel';

@Component({
  selector: 'app-tournaments',
  templateUrl: './tournaments.component.html',
  styleUrls: ['./tournaments.component.css']
})
export class TournamentsComponent implements OnInit {

  constructor(private router: Router,private api:ApiServiceService,public global: GlobalDetails,private soundService: SoundServiceService, public langModel: LanguageModel) { }

  ngOnInit(): void {
    this.global.tourDataArray= [];
    this.getDetails();
  }

  getDetails(){
   
    this.api.upcomingTournaments().subscribe((data: any)=>{
     // this.global.tourDataArray=data;
      for(var i = 0; i < data.length; i++){
        if(data[i].gameType == "CHECKER" || data[i].gameType == "checker") data[i].gameType = 'Checkers';
        if(data[i].gameType == "LUDO" || data[i].gameType == "ludo") data[i].gameType = 'Ludo';
        console.log( data[i].gameType," abcd",this.global.gameName);
        if(data[i].gameType == this.global.gameName){
        this.global.tourDataArray.push(data[i]);
        console.log( this.global.tourDataArray,"chk123");
        }
      }
      // data.endDate: null
      // data.entryFee: 200
      // data.fifthPrize: 0
      // data.firstPrize: 0
      // data.fourthPrize: 0
      // data.gameId: 32490
      // data.gameName: "Ludo"
      // data.gameType: "CHECKER"
      // data.maxPlayers: 1500
      // data.registrationClose: null
      // data.registrationOpens: null
      // data.secondPrize: 0
      // data.startDate: "2022-07-10T18:17:00.000+00:00"
      // data.status: 1
      // data.thirdPrize: 0
      // data.tourneyType: "tournament"
      // data.winningPrize: 1000
    });
  }

  onJoin(tId:any){
    console.log( tId,"tid");
    this.soundService.playAudio('click');
    this.api.registerTournaments(tId).subscribe((data: any)=>{
      console.log( data,"data after register");
      
     });
  }
  back(){
    this.soundService.playAudio('click');
    this.global.isPlaying =false;
    this.router.navigateByUrl('ludoLandingPage');
  }
  tourneyDetails(id:any){
    this.global.id = id;
    this.soundService.playAudio('click');
    this.router.navigateByUrl('tournament-details');
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
           return {'background-color':'#9a0e0e'};
        }
        else{
           return { 'background-color':'#006200'};
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
             return {'background': 'url(../../assets/img1/Button_Yellow.png) 0/100% 100% no-repeat',
             'color':'#9a0e0e'};
          }
          else{
            return {'background': 'url(../../assets/Checkers_Home/button_red.png) 0/100% 100% no-repeat',
             'color':'#fff'};
          }
          break;
          case 'greenbtn':
          if(this.global.gameName =="Ludo")
          {
             return {'background': 'url(../../assets/img1/button_green_bg.png) 0/100% 100% no-repeat',
             'color':'#fff'};
          }
          else{
            return {'background': 'url(../../assets/img1/Button_Yellow.png) 0/100% 100% no-repeat',
             'color':'#006200'};
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
}
