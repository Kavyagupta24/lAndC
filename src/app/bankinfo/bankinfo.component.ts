import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiServiceService } from 'src/services/api-service.service';
import { SoundServiceService } from 'src/services/sound-serviceWeb.service';
import { GlobalDetails } from '../globalVars';
import { LanguageModel } from '../language/langModel';

@Component({
  selector: 'app-bankinfo',
  templateUrl: './bankinfo.component.html',
  styleUrls: ['./bankinfo.component.css']
})
export class BankinfoComponent implements OnInit {
  expPhoneNumber: Number = NaN;
  bankName: string| undefined="";
  accNum :string| undefined ="";
  constructor(private router :Router, private api:ApiServiceService, public global:GlobalDetails,private soundService: SoundServiceService, public langModel: LanguageModel) { }

  ngOnInit(): void {
    this.accNum = this.global.accNum;
    this.bankName = this.global.bankName;
    this.expPhoneNumber = this.global.expPhoneNumber;
  }
  back(){
    this.soundService.playAudio('click');
    this.router.navigateByUrl('user-details');
  }
  nextClicked(){
    this.global.accNum = this.accNum;
    this.global.bankName = this.bankName;
    this.global.expPhoneNumber = this.expPhoneNumber;
    console.log(this.bankName,"this.bankName");
    this.soundService.playAudio('click');
    this.router.navigateByUrl('setProfile');
  }
  onSkip(){
    this.soundService.playAudio('click');
    this.router.navigateByUrl('setProfile'); 
  }
}
