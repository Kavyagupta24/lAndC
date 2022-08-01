import { Component } from '@angular/core';
import { Subject } from 'rxjs';
import { SoundServiceService } from 'src/services/sound-serviceWeb.service';
import { GlobalDetails } from './globalVars';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'lAndC';
 
  constructor(public global:GlobalDetails,private soundService: SoundServiceService){
   
    document.addEventListener('backbutton', (evt) => this.backbtn(evt),false);
    document.addEventListener('pause', (evt) => this.bgmode(evt));
    document.addEventListener('resume', (evt) => this.bgmodeback(evt));
  }
  backbtn(evt:any){
    evt.preventDefault();
  }
  bgmode(evt:any){
    // on background mode
    if(this.global.soundPlaying) {
      this.soundService.stopMusic();
    }

    if(this.global.sound2Playing) {
      this.soundService.stopeGameSound();
    }
  }
  bgmodeback(evt:any){
    if(this.global.soundPlaying) {
       if(this.global.gameName =="Ludo" || this.global.gameName =="Checkers"){
      //   this.soundService.soundName ="ludostart";
         this.soundService.startMusic();
       }
       //else if(this.global.gameName =="Checkers"){
      //   this.soundService.soundName ="Homepage";
      //   this.soundService.startMusic();
      // }
      // this.soundService.soundName ="Championship";
      // this.soundService.startMusic();
    }
    // resume from bg mode
  }
  
}
