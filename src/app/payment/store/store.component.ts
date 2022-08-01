import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalDetails } from 'src/app/globalVars';
import { LanguageModel } from 'src/app/language/langModel';
import { MessagepopupComponent } from 'src/app/messagepopup/messagepopup.component';
import { SoundServiceService } from 'src/services/sound-serviceWeb.service';
import { PayPopupComponent } from '../payment-popup/pay-popup.component';

@Component({
  selector: 'app-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.css']
})
export class StoreComponent implements OnInit {
  @ViewChild(PayPopupComponent)
  payPopUp: PayPopupComponent = new PayPopupComponent;
  coinArr =[
    {coin: 10,money: 5190 ,class: 'coin'},
    {coin: 20,money: 10380 ,class: 'two-coin'},
    {coin: 50,money: 25950 ,class: 'three-coin'},
    {coin: 100,money: 51900 ,class: 'four-coin'},
    {coin: 500,money: 259500 ,class: 'coin-potli'},
    {coin: 1000,money: 519000 ,class: 'coin-box'}
  ];
  constructor(private router: Router,public global:GlobalDetails,private soundService: SoundServiceService, public langModel: LanguageModel) { }

  ngOnInit(): void {
    // this.coinArr =[
    //   {coin: 10,money: this.global.moneyVal * 10 ,class: 'coin'},
    //   {coin: 20,money: this.global.moneyVal * 20 ,class: 'two-coin'},
    //   {coin: 50,money: this.global.moneyVal * 50 ,class: 'three-coin'},
    //   {coin: 100,money: this.global.moneyVal * 100 ,class: 'four-coin'},
    //   {coin: 500,money: this.global.moneyVal * 500 ,class: 'coin-potli'},
    //   {coin: 1000,money: this.global.moneyVal * 1000 ,class: 'coin-box'}
    // ];
  }
  cardClick(amount:any){
    this.soundService.playAudio('click');
    this.payPopUp.isVisible= true;
    this.payPopUp.amountSelected= this.global.moneyVal * amount;

    this.payPopUp.heading = this.langModel.componentLang.paymentPopup.heading[this.langModel.lang];
    this.payPopUp.subheading = this.langModel.componentLang.paymentPopup.subheading[this.langModel.lang];
    this.payPopUp.expressHead = this.langModel.componentLang.paymentPopup.expressHead[this.langModel.lang];
    this.payPopUp.yes = this.langModel.componentLang.paymentPopup.yes[this.langModel.lang];
    this.payPopUp.no = this.langModel.componentLang.paymentPopup.no[this.langModel.lang];
    this.payPopUp.expRef = this.langModel.componentLang.paymentPopup.expRef[this.langModel.lang];
    this.payPopUp.amountText = this.langModel.componentLang.refList.amount[this.langModel.lang];
    this.payPopUp.refNumText = this.langModel.componentLang.refList.refNum[this.langModel.lang];
    this.payPopUp.refIdText = this.langModel.componentLang.refList.refID[this.langModel.lang];
    this.payPopUp.entityidText = this.langModel.componentLang.refList.entityid[this.langModel.lang];
    this.payPopUp.footRef = this.langModel.componentLang.paymentPopup.footRef[this.langModel.lang];
    this.payPopUp.language = this.langModel.lang;
    
    console.log("testAmt", amount, this.payPopUp.amountSelected);
  }
  back(){
    this.soundService.playAudio('click');
    this.router.navigateByUrl('landingPage');
  }
  onPopupTap(evt:any){
    this.soundService.playAudio('click');
  }

}
