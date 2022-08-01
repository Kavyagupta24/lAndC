import { Component, EventEmitter,OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-pay-popup',
  templateUrl: './pay-popup.component.html',
  styleUrls: ['./pay-popup.component.css']
})
export class PayPopupComponent implements OnInit {
  isVisible =false;
  isExpress = false;
  isExpressDone = false;
  heading ="Make Payment";
  subheading ="";
  expressHead= "";
  yes= "";
  no= "";
  expRef="";
  amountText="";
  refNumText="";
  refIdText="";
  entityidText="";
  footRef="";
  language = 'en';
  refNum ="454";
  refId = "453";
  EntityId="452";
  amountSelected = 0;
  @Output() onClick = new EventEmitter<string>();
  constructor() { }

  ngOnInit(): void {
  }

  close(){
    this.isVisible =false;
    this.isExpress = false;
    this.isExpressDone = false;
    if(this.language == 'en')this.heading ="Make Payment";
    else this.heading ="Faça o pagamento";
    this.onClick.emit();
  }
  onExpress(){
    this.isExpress =true;
    if(this.language == 'en')this.heading ="Express Payment";
    else this.heading ="Pagamento expresso";
    this.onClick.emit();
  }
  onVpos(){
    this.isExpress =false;
    this.onClick.emit();
  }
  approveExp(){
    this.isExpressDone =true;
    this.onClick.emit();
  }
  denyExp(){
    this.close();
  }
}
