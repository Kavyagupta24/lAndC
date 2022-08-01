import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalDetails } from 'src/app/globalVars';
import { LanguageModel } from 'src/app/language/langModel';
import { SoundServiceService } from 'src/services/sound-serviceWeb.service';

@Component({
  selector: 'app-payment-history',
  templateUrl: './payment-history.component.html',
  styleUrls: ['./payment-history.component.css']
})
export class PaymentHistoryComponent implements OnInit {

  constructor(private router: Router,private soundService: SoundServiceService, public langModel: LanguageModel, public global:GlobalDetails) { }

  ngOnInit(): void {
  }
  back(){
    this.soundService.playAudio('click');
    this.router.navigateByUrl('wallet');
  }

}
