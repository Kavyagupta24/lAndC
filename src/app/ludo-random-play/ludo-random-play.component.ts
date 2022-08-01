import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Item } from './item';
import { ITEMS } from './mock-data';
import { GlobalDetails } from '../globalVars';
import { SoundServiceService } from 'src/services/sound-serviceWeb.service';
import { LanguageModel } from '../language/langModel';

@Component({
  selector: 'app-ludo-random-play',
  templateUrl: './ludo-random-play.component.html',
  styleUrls: ['./ludo-random-play.component.css'],
})
export class LudoRandomPlayComponent implements OnInit {
  itemsList: Item[] = ITEMS;
  radioSel: any;
  radioSelected: string = '';
  radioSelectedString: string = '';
  gameType: string = '';

  indexOfEntry: number = 0;

  entryArray = [10, 20, 30, 40, 50, 60];
  rewardsArray = [100, 200, 300, 400, 500, 600];

  entry: number = this.entryArray[this.indexOfEntry];
  reward: number = this.rewardsArray[this.indexOfEntry];

  constructor(private router: Router, public global: GlobalDetails,private soundService: SoundServiceService, public langModel: LanguageModel) {
    if(this.global.LudoGameType == 'PWF'){
      this.gameType = this.langModel.componentLang.pwfPage.heading[this.langModel.lang];
    }else if(this.global.LudoGameType == 'RP'){
      this.gameType = this.langModel.componentLang.randomplayPage.randomPlay[this.langModel.lang];
    } 
    
    console.log('player name.', this.global.userName);
    this.itemsList = ITEMS;
    this.radioSelected = 'item_1';
    this.getSelecteditem();
  }
  getSelecteditem() {
    this.radioSel = ITEMS.find((Item) => Item.value === this.radioSelected);
    this.radioSelectedString = JSON.stringify(this.radioSel);
    console.log('radio selected--->', this.radioSel.name);
    this.global.gottiId = parseInt(this.radioSel.name);
    if (this.radioSel.value == 'item_2') {
      // this.radioSelectedNumber = true;
      // this.radioSelectedEmail = false;
    } else if (this.radioSel.value == 'item_1') {
      // this.radioSelectedNumber = false;
      // this.radioSelectedEmail = true;
    }
  }
  onItemChange(item: any) {
    this.getSelecteditem();
  }

  ngOnInit(): void {}

  ngAfterViewInit(){
    if(this.global.gameName == 'Ludo'){
      document.querySelector('.board1')!.classList.add('selected');
      this.global.boardType = "Board_1";
    }
    
  }
  start() {
    this.soundService.playAudio('click');
    if (this.global.gameName == 'Ludo') {
      this.router.navigateByUrl('ludo');
    } else {
      this.global.checkersGameType = 'RP';
      this.router.navigateByUrl('checkers');
    }
  }
  gameCheck(type: any) {
    switch (type) {
      case 'bg':
        if (this.global.gameName == 'Ludo') {
          return {
            'background-image':
              'url(../../assets/img1/Repeatable_Bg.png),url(../../assets/img1/Stretchable_BG.png)',
          };
        } else {
          return {
            'background-image':
              'url(../../assets/img1/Repeatable_Bg.png),url(./../../assets/BG_1px.png)',
          };
        }
        break;
      case 'back-header':
        if (this.global.gameName == 'Ludo') {
          return {
            background:
              'url(../../assets/img1/Header_Stretchable.png) 0/100% 100% no-repeat',
          };
        } else {
          return {
            background:
              'url(../../assets/Checkers_Home/header.png) 0/100% 100% no-repeat',
          };
        }
        break;
      case 'btn':
        if (this.global.gameName == 'Ludo') {
          return {
            background:
              'url(../../assets/img1/button_green_bg.png) 0/100% 100% no-repeat',
          };
        } else {
          return {
            background:
              'url(../../assets/Checkers_Home/button_red.png) 0/100% 100% no-repeat',
          };
        }
        break;
      case 'betBox':
        if (this.global.gameName == 'Ludo') {
          return {
            background:
              'url(../../assets/img1/randomPlay/textbox.png) 0/100% 100% no-repeat',
          };
        } else {
          return {
            background:
              'url(../../assets/Checkers_Home/textboxChecker.png) 0/100% 100% no-repeat',
          };
        }
        break;
      case 'bet':
        if (this.global.gameName == 'Ludo') {
          return { color: '#850808' };
        } else {
          return { color: '#18a504' };
        }
        break;
      default:
        return {
          'background-image':
            'url(../../assets/img1/Repeatable_Bg.png),url(../../assets/img1/Stretchable_BG.png)',
        };
    }
  }
  chooseBoard(type:any){
    this.soundService.playAudio('click');
    this.global.boardType = "Board_"+type;
    document.querySelector('.board1')!.classList.remove('selected');
    document.querySelector('.board2')!.classList.remove('selected');
    document.querySelector('.board3')!.classList.remove('selected');
    document.querySelector('.board'+type)!.classList.add('selected');
  }
  back() {
    this.soundService.playAudio('click');
    this.router.navigateByUrl('ludoLandingPage');
  }
  increaseAmount(){
    this.soundService.playAudio('click');
    if(this.indexOfEntry < this.entryArray.length-1){
      this.indexOfEntry = this.indexOfEntry + 1;
      this.entry = this.entryArray[this.indexOfEntry];
      this.reward = this.rewardsArray[this.indexOfEntry];
      console.log(this.entry, this.reward, this.indexOfEntry);
    }
  }
  decreaseAmount(){
    this.soundService.playAudio('click');
    if(this.indexOfEntry > 0){
      this.indexOfEntry = this.indexOfEntry - 1;
      this.entry = this.entryArray[this.indexOfEntry];
      this.reward = this.rewardsArray[this.indexOfEntry];
      console.log(this.entry, this.reward, this.indexOfEntry);
    }
  }
}
