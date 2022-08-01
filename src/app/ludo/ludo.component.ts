import { jsDocComment } from '@angular/compiler';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Client } from 'colyseus.js';
import { ConnectionService } from 'ng-connection-service';
import { SoundServiceService } from 'src/services/sound-serviceWeb.service';
import { GlobalDetails } from '../globalVars';
import { LanguageModel } from '../language/langModel';
import { MessagepopupComponent } from '../messagepopup/messagepopup.component';
import { ShareonmobileService } from '../shareonmobile.service';
import { LudoWinnerPopUpComponent } from './ludo-winner-pop-up/ludo-winner-pop-up.component';

// declare const clientDeclare: any;
const CONSTANTS = {
  defaultColors: ['red', 'green', 'yellow', 'blue'],
};
let GAMEDATA = {
  playerIds: [],
  playerIndex: '',
  movableGottis: [],
  currentPlayerColor: '',
};

class createPowerup {
  type: any;
  description: any;
  image: any;
  constructor(type: any) {
    this.type = type;
    let desc = '';
    if (type == 'freeRoll') {
      desc = 'Gives you an extra free roll! Yeaaa';
    } else if (type == 'skipTurn') {
      desc = "Skips the next players' turn!";
    } else if (type == 'killAnyGotti') {
      desc = 'Kill any player in the Arena!';
    }
    let elem = document.createElement('div');
    elem.className = 'powerUp';
    elem.classList.add(type);
    this.description = document.createElement('p');
    this.description.innerText = desc;
    elem.appendChild(this.description);
    this.image = elem;
  }
}

var global: any = {
  user: [],
  myName: null,
  myId: null,
  opponentName: null,
  opponentName1: null,
  opponentName2: null,
  points: 1000,
  lobbyPlayers: [],
  players: [{}, {}],
  myself: {},
  gameCards: [],
  player1Id: null,
  player2ID: null,
  playercount: 0,
  mySessionID: null,
  myPiece: 0,
  otherPiece: 0,
  gameRoom: null,
  lobbyRoom: null,
};
//const client = new Client('ws://localhost:3004');
const client = new Client("ws://34.197.91.228:3003");

@Component({
  selector: 'app-ludo',
  templateUrl: './ludo.component.html',
  styleUrls: ['./ludo.component.css'],
})
export class LudoComponent implements OnInit {
  eventListenerdone: boolean = false;
  myName: string | undefined = '';
  oppOne: string | undefined = '';
  oppTwo: string | undefined = '';
  oppThree: string | undefined = '';
  PWFroomId: any;
  myTurn: boolean = false;
  message: any;
  myColor: string = "";
  sixArrayRecived: boolean = false;
  sixArray = [];
  allGottis = {};
  gottisInside = [];
  GottiMovementAmounts = {};
  isConnected = true;  
  noInternetConnection: boolean = false;  
  @ViewChild(MessagepopupComponent)
  messagePopUp: MessagepopupComponent = new MessagepopupComponent;
  @ViewChild(LudoWinnerPopUpComponent)
  LudoWinnerPopUp: LudoWinnerPopUpComponent = new LudoWinnerPopUpComponent;
  constructor(private global1: GlobalDetails, private router: Router, private shareService: ShareonmobileService,private soundService: SoundServiceService, public langModel: LanguageModel, private connectionService: ConnectionService) {
    GAMEDATA = {
      playerIds: [],
      playerIndex: '',
      movableGottis: [],
      currentPlayerColor: '',
    };
    global = {
      user: [],
      myName: null,
      myId: null,
      opponentName: null,
      opponentName1: null,
      opponentName2: null,
      points: 1000,
      lobbyPlayers: [],
      players: [{}, {}],
      myself: {},
      gameCards: [],
      player1Id: null,
      player2ID: null,
      playercount: 0,
      mySessionID: null,
      myPiece: 0,
      otherPiece: 0,
      gameRoom: null,
      lobbyRoom: null,
    };
    console.log('player no.', this.global1.gottiId);
    this.myName = this.global1.userName;
    console.log('player name.', this.global1.userName);
    console.log('gameType = >', this.global1.createOrJoin , " ", this.global1.LudoGameType);
    try {
      if(this.global1.createOrJoin == 'join'){
        this.global1.roomCode;
      }
      this.joinLobby(this.global1.gottiId);
    } catch (e) {
      console.log(e);
    }
    this.connectionService.monitor().subscribe(isConnected => {  
      this.isConnected = isConnected;  
      if (this.isConnected) {  
        alert("Internet is back");
        if(global.gameRoom != null){
          try {
            const room = client.reconnect(global.gameRoom.id, global.myId);
            console.log("joined successfully", room);
          } catch (e) {
            console.error("join error", e);
          }
        }
        this.noInternetConnection=false;  
      }  
      else {  
        alert("No InternetConnection");
        this.noInternetConnection=true;  
      }  
    });
    // document.addEventListener('pause', (evt) => this.bgmode(evt));
    // document.addEventListener('resume', (evt) => this.bgmodeback(evt));
    
  }

  ngOnInit(): void {}
  ngAfterViewInit(): void {
    // document.querySelector('.current-numbers')!.classList.add('hidden');
    //will monitor internet connection.
    if(this.global1.LudoGameType == 'PWF' && this.global1.createOrJoin == 'create'){
      document.querySelector('.game-wrapInviteFriends')!.classList.remove('hidden');
      document.querySelector('.ludo-wrap')!.classList.add('hidden');
    }else if(this.global1.LudoGameType == 'PWF' && this.global1.createOrJoin == 'join'){
      console.log("join Game");
      document.querySelector('.oppOne')!.classList.add('hidden');
      document.querySelector('.oppThree')!.classList.add('hidden');
    }
    else {
      var myavatar = document.getElementById('myAvatar')! as HTMLImageElement;
    myavatar.src =
      '../../assets/img/profile/Avatar' + this.global1.avatar + '.png';
    if (this.global1.gottiId == 2) {
      document.querySelector('.oppTwo')!.classList.add('heartbeat');
      document.querySelector('.oppOne')!.classList.add('hidden');
      document.querySelector('.oppThree')!.classList.add('hidden');
    } else if (this.global1.gottiId == 3) {
      document.querySelector('.oppOne')!.classList.add('heartbeat');
      document.querySelector('.oppThree')!.classList.add('heartbeat');
      document.querySelector('.oppTwo')!.classList.add('hidden');
    } else if (this.global1.gottiId == 4) {
      document.querySelector('.oppTwo')!.classList.add('heartbeat');
      document.querySelector('.oppOne')!.classList.add('heartbeat');
      document.querySelector('.oppThree')!.classList.add('heartbeat');
    } else {
      this.router.navigateByUrl('homePage');
    }

    this.LudoWinnerPopUp.langModel = this.langModel;
    }
    
  }
  // bgmode(evt:any){
  //   // on background mode
  // }
  // bgmodeback(evt:any){
  //   this.messagePopUp.isVisible= true;
  //   this.messagePopUp.popupMessage = this.langModel.componentLang.popups.gameOver[this.langModel.lang];
  //   this.messagePopUp.closetxt = this.langModel.componentLang.popups.close[this.langModel.lang];
  //   //this.router.navigateByUrl('homePage');
  //   // resume from bg mode
  // }
  // checkConnectivity(){
  //   if (window.navigator.onLine) {
  //     console.log("Back online");
  //   }
  //   else{
  //     alert("Check your connection.");
  //   }
  // }
  
  endGame1(){
    //this.router.navigateByUrl('ludoRandomPlay');
    this.messagePopUp.isVisible= true;
    this.messagePopUp.popupMessage = this.langModel.componentLang.popups.roomRemove[this.langModel.lang];
     this.messagePopUp.closetxt = this.langModel.componentLang.popups.no[this.langModel.lang];
     this.messagePopUp.btnText = this.langModel.componentLang.popups.yes[this.langModel.lang];
     this.messagePopUp.type = 'option';
    //this.leaveLobbyRoom();
  }
  onClaim1(type:any){
    console.log("type -> " + type);
    if(type == "goToLobby"){
      console.log("inside gotoLobby");
      this.soundService.playAudio('click');
      this.LudoWinnerPopUp.isVisible = false;
      //window.location.reload();
      this.router.navigateByUrl("ludoRandomPlay");
      console.log("inside gotoLobby1");
    }else if(type == "goToHome"){
      console.log("inside goToHome");
      this.soundService.playAudio('click');
      this.LudoWinnerPopUp.isVisible = false;
      this.router.navigateByUrl("homePage");
    }
  }
  onClaim(type:any){
    this.soundService.playAudio('click');
    if(type == 'yes'){
      if(global.gameRoom != null){
        global.gameRoom.leave();
      }
      
      this.leaveLobbyRoom();
        this.router.navigateByUrl('ludoLandingPage');
     
    }
    else{
      }
      this.messagePopUp.isVisible= false;
      if(type == 'close' && this.messagePopUp.type != 'option'){
        this.router.navigateByUrl('ludoLandingPage');
      }

    // if(type == 'close'){

    //     // if(this.isFail == 'successfull') this.router.navigateByUrl('homePage');
    //     // else if(this.isFail == 'error')this.router.navigateByUrl('landingPage');
    //   this.isFail = '';
    //   }
    }
  leaveLobbyRoom(){
    if(global.lobbyRoom != null){
      console.log("leaving lobby room");
      global.lobbyRoom.leave();
      this.router.navigateByUrl('homePage');
    }
  }
  back(num: any) {
    if (num == 0) {
      
      
      if(this.global1.LudoGameType == 'PWF'){
        this.router.navigateByUrl("ludoLandingPage")
      }else{
        this.messagePopUp.isVisible =true;
        this.messagePopUp.popupMessage = this.langModel.componentLang.popups.gameQuit[this.langModel.lang];
     this.messagePopUp.closetxt = this.langModel.componentLang.popups.no[this.langModel.lang];
     this.messagePopUp.btnText = this.langModel.componentLang.popups.yes[this.langModel.lang];
        this.messagePopUp.type = 'option';
       // this.router.navigateByUrl('ludoRandomPlay');
      }
      
    } else if (num == 1) {
      if(this.global1.LudoGameType == 'PWF'){
        this.router.navigateByUrl("ludoLandingPage")
      }else{
        this.router.navigateByUrl('ludoLandingPage');
      }
    } else if (num == 2) {
      global.lobbyRoom.leave();
      if(this.global1.LudoGameType == 'PWF'){
        this.router.navigateByUrl("ludoLandingPage")
      }else{
        this.router.navigateByUrl('ludoLandingPage');
      }
    }
  }
  Gotticlicked(event: any) {
    console.log('event---------------->', event);
    //this.checkConnectivity();
    let gottiId = event.target.id;

    console.log("gottiId", gottiId, " sixArrayRecived-> ", this.sixArrayRecived);
    if(this.sixArrayRecived == false){
      if (event.srcElement.className.includes('gotti')) {
        console.log('hereee ', this.eventListenerdone);
        if (this.eventListenerdone == true) {
          console.log('hereee2 ');
          this.eventListenerdone = false;
          global.gameRoom.send('gottiClicked', { id: gottiId });
        }
      }
    }else if(this.sixArrayRecived == true){
      this.sixArrayRecived = false;
      console.log("six Array recived write the logic here ", gottiId);
      if(this.gottisInside.length >= 1){
        this.gottisInside.forEach((id: string) => {
          console.log(id);
          if(this.eventListenerdone == true){
            if(gottiId == id){
              this.eventListenerdone = false;
              console.log('sending gotti to move');
              var divChild: HTMLElement;
      for (const [key1, value1] of Object.entries(this.GottiMovementAmounts)) {
        console.log(key1, value1);
        var postionforPopup: string;
        for (const [key, value] of Object.entries(this.allGottis)) {
          console.log(key, value);
          if(key1 == key){
            postionforPopup = String(value);
            console.log('position for popup -> ', postionforPopup);
            divChild = document.getElementById(postionforPopup)!.children[1] as HTMLElement;
            divChild.style.display = 'none';
            console.log("divChild -> ", divChild);
          }
        }
      }
              global.gameRoom.send('gottiClicked1', { id: gottiId , movementAmount: 6});
            }
          }
        });
      }
      if(this.eventListenerdone == true){
        this.eventListenerdone = false;
        
        console.log("Inside eventListenerDone:");
        if(gottiId == 'firstNumber' || gottiId == 'secondNumber' || gottiId == 'thirdNumber')
        //|| event.target.firstChild.id == 'firstNumber'
        {
          var movementAmount = parseInt(event.target.innerText);
          var gottiId1 = "";
          console.log("Inside first or second or third:");
          if(event.path[0].localName =='span'){
            console.log("Inside span:");
            for (const [key, value] of Object.entries(this.allGottis)) {
              console.log("key and event path: ", Number(value), Number(event.path[3].id));
              if(Number(value) == Number(event.path[3].id)){
                gottiId1 = key;
              }
            }
            //gottiId1 = event.target.parentElement.parentElement.parentElement.lastChild.id;
          }else if(event.path[0].localName =='div'){
            //gottiId1 = event.target.parentElement.parentElement.lastChild.id;
            console.log("Inside div:");
            for (const [key, value] of Object.entries(this.allGottis)) {
              console.log("key and event path: ", Number(value), Number(event.path[3].id));
              if(Number(value) == Number(event.path[2].id)){
                gottiId1 = key;
              }
            }
          }
          console.log("gottiId => ", gottiId1 , " movementAmount => ", movementAmount);
          
          if(gottiId1.includes('yellow') || gottiId1.includes('red') || gottiId1.includes('green') || gottiId1.includes('blue')){
            global.gameRoom.send('gottiClicked1', { id: gottiId1 , movementAmount: movementAmount});
          }
          var divChild: HTMLElement;
      for (const [key1, value1] of Object.entries(this.GottiMovementAmounts)) {
        console.log(key1, value1);
        var postionforPopup: string;
        for (const [key, value] of Object.entries(this.allGottis)) {
          console.log(key, value);
          if(key1 == key){
            postionforPopup = String(value);
            console.log('position for popup -> ', postionforPopup);
            divChild = document.getElementById(postionforPopup)!.children[1] as HTMLElement;
            divChild.style.display = 'none';
            console.log("divChild -> ", divChild);
          }
        }
      }
        }
        else {
          console.log("Inside else of firstNumber secondNumber thirdNumber:");
          this.eventListenerdone = true;
          this.sixArrayRecived = true;
        }
      }
    }
    
  }
  DiceClicked(e: any) {
    //this.checkConnectivity();
    //this.soundService.playAudio('Dicesound');
    if (
      e.target.className == 'roll1' ||
      e.target.className == 'roll2' ||
      e.target.className == 'roll3' ||
      e.target.className == 'roll4' ||
      e.target.className.includes('gif')
    ) {
      
        console.log('roll please');
        global.gameRoom.send('roll', 'hey');
      
      
    }
  }
  playAgain() {
    this.soundService.playAudio('click');
    document.querySelector('#endGameDialogue div')!.innerHTML = '';
    document.querySelector('#endGameDialogue')!.classList.add('hidden');
    // document.querySelector("#startGameDialogue")!.classList.remove("hidden");
    this.router.navigateByUrl('ludoRandomPlay');
  }
  shareCode(){
    if(this.PWFroomId != ""){
      this.shareService.openSharePvtRoom(this.PWFroomId);
    }
  }
  startGamePWF(){
    global.lobbyRoom.send("startGame", "Start");
    global.lobbyRoom.leave();
    global.lobbyRoom = null;
    this.joinGameRoom(this.message)
  }
  async joinLobby(playerCount: any) {
    
      //global.userName = prompt("Please enter your name:");
      global.userName = this.global1.userName;
      if (global.userName == null) {
        this.router.navigateByUrl('ludoRandomPlay');
        return;
      }
      global.dbId = this.getRndInteger(1000, 100000);
      global.lobbyRoom = null;
      
      if (this.global1.LudoGameType == 'RP') {
        try{
        if (playerCount == 2) {
          await client.joinOrCreate('ludo2PlayerLobbyRoom', {
              userName: global.userName,
              dbId: global.dbId,
              avatar: this.global1.avatar,
              playerCount: playerCount,
              coin: 1000,
            })
            .then((room) => {
              console.log('here in lobby');
              global.lobbyRoom = room;
              room.onMessage("broadcasted", (message) => {
                console.log("broadcasted by different rooms");
              });
              room.onMessage('waitingForPlayers', (message) => {
                console.log(message.num);
                console.log('mySession Id', message.sessionId);
                global.myId = message.sessionId;
              });

              room.onMessage('ROOMCONNECT', (message) => {
                //gamePlay();
                var roomid = message.roomId;
                console.log('room Id ------->', roomid);
                console.log('playerCount ------->', message.playerCount);

                if (message.playerCount == 2) {
                  var oppopnentName = message.oppName;
                  console.log('oppopnentName ------->', oppopnentName);
                  this.oppTwo = oppopnentName;
                  var myavatar = document.getElementById(
                    'oppTwoAvatar'
                  )! as HTMLImageElement;
                  myavatar.src =
                    '../../assets/img/profile/Avatar' +
                    message.oppAvatar +
                    '.png';
                  global.opponentName = oppopnentName;
                }
                var sessionId = message.oppSessionId;
                console.log('sessionId ------->', sessionId);
                var matchedTimeout = setInterval(() => {
                
                global.lobbyRoom = null;
                this.joinGameRoom(message);
                room.leave();
                clearInterval(matchedTimeout);
                },1500);
              });
            });
        } else if (playerCount == 3) {
          await client.joinOrCreate('ludo3PlayerLobbyRoom', {
              userName: global.userName,
              dbId: global.dbId,
              avatar: this.global1.avatar,
              playerCount: playerCount,
              coin: 1000,
            })
            .then((room) => {
              console.log('here in lobby');
              global.lobbyRoom = room;
              room.onMessage('waitingForPlayers', (message) => {
                console.log(message.num);
                console.log('mySession Id', message.sessionId);
                global.myId = message.sessionId;
              });
              room.onMessage("broadcasted", (message) => {
                console.log("broadcasted by different rooms2");
              });
              room.onMessage('ROOMCONNECT', (message) => {
                //gamePlay();
                var roomid = message.roomId;
                console.log('room Id ------->', roomid);
                console.log('playerCount ------->', message.playerCount);

                if (message.playerCount == 3) {
                  var oppopnentName = message.oppName;
                  console.log('oppopnentName ------->', oppopnentName);
                  var oppopnentName1 = message.oppName1;
                  console.log('oppopnentName ------->', oppopnentName1);
                  this.oppOne = oppopnentName;
                  this.oppThree = oppopnentName1;
                  var myavatar = document.getElementById(
                    'oppOneAvatar'
                  )! as HTMLImageElement;
                  myavatar.src =
                    '../../assets/img/profile/Avatar' +
                    message.oppAvatar +
                    '.png';
                  var myavatar1 = document.getElementById(
                    'oppThreeAvatar'
                  )! as HTMLImageElement;
                  myavatar1.src =
                    '../../assets/img/profile/Avatar' +
                    message.oppAvatar1 +
                    '.png';
                  global.opponentName = oppopnentName;
                  global.opponentName1 = oppopnentName1;
                } 
                var sessionId = message.oppSessionId;
                console.log('sessionId ------->', sessionId);
                var matchedTimeout = setInterval(() => {
                
                  global.lobbyRoom = null;
                  this.joinGameRoom(message);
                  room.leave();
                  clearInterval(matchedTimeout);
                  },1500);
              });
            });
        } else if (playerCount == 4) {
          await client.joinOrCreate('ludo4PlayerLobbyRoom', {
              userName: global.userName,
              dbId: global.dbId,
              avatar: this.global1.avatar,
              playerCount: playerCount,
              coin: 1000,
            })
            .then((room) => {
              console.log('here in lobby');
              global.lobbyRoom = room;
              room.onMessage('waitingForPlayers', (message) => {
                console.log(message.num);
                console.log('mySession Id', message.sessionId);
                global.myId = message.sessionId;
              });

              room.onMessage('ROOMCONNECT', (message) => {
                //gamePlay();
                var roomid = message.roomId;
                console.log('room Id ------->', roomid);
                console.log('playerCount ------->', message.playerCount);

                 if (message.playerCount == 4) {
                  var oppopnentName = message.oppName;
                  console.log('oppopnentName ------->', oppopnentName);
                  var oppopnentName1 = message.oppName1;
                  console.log('oppopnentName ------->', oppopnentName1);
                  var oppopnentName2 = message.oppName2;
                  console.log('oppopnentName ------->', oppopnentName2);
                  this.oppOne = oppopnentName;
                  this.oppTwo = oppopnentName1;
                  this.oppThree = oppopnentName2;
                  var myavatar = document.getElementById(
                    'oppOneAvatar'
                  )! as HTMLImageElement;
                  myavatar.src =
                    '../../assets/img/profile/Avatar' +
                    message.oppAvatar +
                    '.png';
                  var myavatar1 = document.getElementById(
                    'oppTwoAvatar'
                  )! as HTMLImageElement;
                  myavatar1.src =
                    '../../assets/img/profile/Avatar' +
                    message.oppAvatar1 +
                    '.png';
                  var myavatar2 = document.getElementById(
                    'oppThreeAvatar'
                  )! as HTMLImageElement;
                  myavatar2.src =
                    '../../assets/img/profile/Avatar' +
                    message.oppAvatar2 +
                    '.png';
                  global.opponentName = oppopnentName;
                  global.opponentName1 = oppopnentName1;
                  global.opponentName2 = oppopnentName2;
                }
                var sessionId = message.oppSessionId;
                console.log('sessionId ------->', sessionId);
                var matchedTimeout = setInterval(() => {
                
                  global.lobbyRoom = null;
                  this.joinGameRoom(message);
                  room.leave();
                  clearInterval(matchedTimeout);
                  },1500);
              });
            });
        }} catch (e) {
          console.log(e);
        }
      }
      if (this.global1.LudoGameType == 'PWF') {
        if (this.global1.createOrJoin == 'create') {
          try{
          console.log("create Room");
          await client.create('playWithFriends', {
              userName: global.userName,
              dbId: global.dbId,
              avatar: this.global1.avatar,
              playerCount: playerCount,
              coin: 1000,
            })
            .then((room) => {
              console.log('here in lobby');
              global.lobbyRoom = room;
              global.lobbyRoom.onMessage('roomId', (message: any) => {
                this.PWFroomId = JSON.stringify(message.roomCode);
                document.getElementById('roomCode')!.textContent =
                  this.PWFroomId;
                console.log('Room Id -> ', this.PWFroomId);
              });
              room.onMessage('waitingForPlayers', (message) => {
                console.log(message.num);
                console.log('mySession Id', message.sessionId);
                global.myId = message.sessionId;
              });

              room.onMessage('ROOMCONNECT', (message) => {
                //gamePlay();
                // document.querySelector('.game-wrapInviteFriends')!.classList.add('hidden');
                // document.querySelector('.ludo-wrap')!.classList.remove('hidden');
                document.querySelector('.startGamePWF')!.classList.remove('hidden');
                this.message = message;
                var roomid = message.roomId;
                console.log('room Id ------->', roomid);
                console.log('playerCount ------->', message.playerCount);

                if (message.playerCount == 2) {
                  var oppopnentName = message.oppName;
                  console.log('oppopnentName ------->', oppopnentName);
                  this.oppTwo = oppopnentName;
                  global.opponentName = oppopnentName;
                } else if (message.playerCount == 3) {
                  var oppopnentName = message.oppName;
                  console.log('oppopnentName ------->', oppopnentName);
                  var oppopnentName1 = message.oppName1;
                  console.log('oppopnentName ------->', oppopnentName1);
                  this.oppOne = oppopnentName;
                  this.oppThree = oppopnentName1;
                  global.opponentName = oppopnentName;
                  global.opponentName1 = oppopnentName1;
                } else if (message.playerCount == 4) {
                  var oppopnentName = message.oppName;
                  console.log('oppopnentName ------->', oppopnentName);
                  var oppopnentName1 = message.oppName1;
                  console.log('oppopnentName ------->', oppopnentName1);
                  var oppopnentName2 = message.oppName2;
                  console.log('oppopnentName ------->', oppopnentName2);
                  this.oppOne = oppopnentName;
                  this.oppTwo = oppopnentName1;
                  this.oppThree = oppopnentName2;
                  global.opponentName = oppopnentName;
                  global.opponentName1 = oppopnentName1;
                  global.opponentName2 = oppopnentName2;
                }
                var sessionId = message.oppSessionId;
                console.log('sessionId ------->', sessionId);
                // room.leave();
                // global.lobbyRoom = null;
                // this.joinGameRoom(message);
              });
            });
          } catch (e) {
            console.log(e);
          }
        } else if (this.global1.createOrJoin == 'join') {
          try{
            console.log("roomCodeonJoin", this.global1.roomCode)
          const room = await client.joinById(String(this.global1.roomCode), {
            userName: global.userName,
            dbId: global.dbId,
            avatar: this.global1.avatar,
            playerCount: playerCount,
            coin: 1000,
          });
          room.onMessage('roomId', (message) => {
            this.PWFroomId = JSON.stringify(message.roomCode);
            // document.getElementById('waiting').textContent = "Room Code - " + PWFroomId;
            console.log('Room Id -> ', this.PWFroomId);
          });
          room.onMessage('playerJoined', (message) => {
            console.log("PlayerJoinedInLobby");
            if (message.playerCount == 2) {
              var oppopnentName = message.oppName;
              console.log('oppopnentName ------->', oppopnentName);
              this.oppTwo = oppopnentName;
              global.opponentName = oppopnentName;
              var myavatar = document.getElementById(
                'oppTwoAvatar'
              )! as HTMLImageElement;
              myavatar.src =
                '../../assets/img/profile/Avatar' +
                message.oppAvatar +
                '.png';
                document.querySelector('.oppOne')!.classList.add('hidden');
                document.querySelector('.oppThree')!.classList.add('hidden');
            } else if (message.playerCount == 3) {
              var oppopnentName = message.oppName;
              console.log('oppopnentName ------->', oppopnentName);
              var oppopnentName1 = message.oppName1;
              console.log('oppopnentName ------->', oppopnentName1);
              this.oppOne = oppopnentName;
              this.oppThree = oppopnentName1;
              global.opponentName = oppopnentName;
              global.opponentName1 = oppopnentName1;
              var myavatar = document.getElementById(
                'oppOneAvatar'
              )! as HTMLImageElement;
              myavatar.src =
                '../../assets/img/profile/Avatar' +
                message.oppAvatar +
                '.png';
              var myavatar1 = document.getElementById(
                'oppThreeAvatar'
              )! as HTMLImageElement;
              myavatar1.src =
                '../../assets/img/profile/Avatar' +
                message.oppAvatar1 +
                '.png';
                document.querySelector('.oppTwo')!.classList.add('hidden');
                document.querySelector('.oppOne')!.classList.remove('hidden');
                document.querySelector('.oppThree')!.classList.remove('hidden');
            } else if (message.playerCount == 4) {
              var oppopnentName = message.oppName;
              console.log('oppopnentName ------->', oppopnentName);
              var oppopnentName1 = message.oppName1;
              console.log('oppopnentName ------->', oppopnentName1);
              var oppopnentName2 = message.oppName2;
              console.log('oppopnentName ------->', oppopnentName2);
              this.oppOne = oppopnentName;
              this.oppTwo = oppopnentName1;
              this.oppThree = oppopnentName2;
              global.opponentName = oppopnentName;
              global.opponentName1 = oppopnentName1;
              global.opponentName2 = oppopnentName2;
              var myavatar = document.getElementById(
                'oppOneAvatar'
              )! as HTMLImageElement;
              myavatar.src =
                '../../assets/img/profile/Avatar' +
                message.oppAvatar +
                '.png';
              var myavatar1 = document.getElementById(
                'oppTwoAvatar'
              )! as HTMLImageElement;
              myavatar1.src =
                '../../assets/img/profile/Avatar' +
                message.oppAvatar1 +
                '.png';
              var myavatar2 = document.getElementById(
                'oppThreeAvatar'
              )! as HTMLImageElement;
              myavatar2.src =
                '../../assets/img/profile/Avatar' +
                message.oppAvatar2 +
                '.png';
            }
            document.querySelector('.oppTwo')!.classList.remove('hidden');
            document.querySelector('.oppOne')!.classList.remove('hidden');
            document.querySelector('.oppThree')!.classList.remove('hidden');
          });
          room.onMessage('waitingForPlayers', (message) => {
            console.log(message.num);
            console.log('mySession Id', message.sessionId);
            global.myId = message.sessionId;
          });
          room.onMessage('startgame', ()=> {
            room.leave();
            global.lobbyRoom = null;
            this.joinGameRoom(this.message);
          });
          room.onMessage('ROOMCONNECT', (message) => {
            //gamePlay();
            this.message = message;
            document.querySelector('.waitingForCreaterTostart')!.textContent = "Waiting for Creater to start the game."
            document.querySelector('.waitingForCreaterTostart')!.classList.remove('hidden');
            var roomid = message.roomId;
            console.log('room Id ------->', roomid);
            console.log('playerCount ------->', message.playerCount);

            if (message.playerCount == 2) {
              var oppopnentName = message.oppName;
              console.log('oppopnentName ------->', oppopnentName);
              this.oppTwo = oppopnentName;
              global.opponentName = oppopnentName;
              var myavatar = document.getElementById(
                'oppTwoAvatar'
              )! as HTMLImageElement;
              myavatar.src =
                '../../assets/img/profile/Avatar' +
                message.oppAvatar +
                '.png';
                document.querySelector('.oppOne')!.classList.add('hidden');
                document.querySelector('.oppThree')!.classList.add('hidden');
            } else if (message.playerCount == 3) {
              var oppopnentName = message.oppName;
              console.log('oppopnentName ------->', oppopnentName);
              var oppopnentName1 = message.oppName1;
              console.log('oppopnentName ------->', oppopnentName1);
              this.oppOne = oppopnentName;
              this.oppThree = oppopnentName1;
              global.opponentName = oppopnentName;
              global.opponentName1 = oppopnentName1;
              var myavatar = document.getElementById(
                'oppOneAvatar'
              )! as HTMLImageElement;
              myavatar.src =
                '../../assets/img/profile/Avatar' +
                message.oppAvatar +
                '.png';
              var myavatar1 = document.getElementById(
                'oppThreeAvatar'
              )! as HTMLImageElement;
              myavatar1.src =
                '../../assets/img/profile/Avatar' +
                message.oppAvatar1 +
                '.png';
                document.querySelector('.oppTwo')!.classList.add('hidden');
            } else if (message.playerCount == 4) {
              var oppopnentName = message.oppName;
              console.log('oppopnentName ------->', oppopnentName);
              var oppopnentName1 = message.oppName1;
              console.log('oppopnentName ------->', oppopnentName1);
              var oppopnentName2 = message.oppName2;
              console.log('oppopnentName ------->', oppopnentName2);
              this.oppOne = oppopnentName;
              this.oppTwo = oppopnentName1;
              this.oppThree = oppopnentName2;
              global.opponentName = oppopnentName;
              global.opponentName1 = oppopnentName1;
              global.opponentName2 = oppopnentName2;
              var myavatar = document.getElementById(
                'oppOneAvatar'
              )! as HTMLImageElement;
              myavatar.src =
                '../../assets/img/profile/Avatar' +
                message.oppAvatar +
                '.png';
              var myavatar1 = document.getElementById(
                'oppTwoAvatar'
              )! as HTMLImageElement;
              myavatar1.src =
                '../../assets/img/profile/Avatar' +
                message.oppAvatar1 +
                '.png';
              var myavatar2 = document.getElementById(
                'oppThreeAvatar'
              )! as HTMLImageElement;
              myavatar2.src =
                '../../assets/img/profile/Avatar' +
                message.oppAvatar2 +
                '.png';
            }
            var sessionId = message.oppSessionId;
            console.log('sessionId ------->', sessionId);
            
          });
        } catch (e) {
          console.log(e);
        }
        }
      }
  }
  getRndInteger(min: any, max: any) {
    return Math.floor(Math.random() * (max - min)) + min;
  }
  async joinGameRoom(message: any) {
    try{
    global.playercount += 1;
    global.gameRoom = null;
    
      const room = await client.consumeSeatReservation(message.seat);
      global.gameRoom = room;
      console.log('joined successfully', room);

    
    
    
    //this.setGameRoom(room);
    //   client.joinOrCreate("game", {
    //     dbid: global.dbid,
    //     userName: global.userName,
    //   }).then(room => {

    //   room.onStateChange((state) => {
    //     console.log(room.name, "has new state:", state);
    //   });

    //});
    //powerUps, availablePlayers, gottisInside, playerIds, names
    room.onMessage('yourId', (message) => {
      global.myId = message.id;
      console.log('this is my id', global.myId);
      //room.send("giveUserArray", {userName: global.userName});
    });
    //   room.onMessage("userArraysent",(message) => {

    //     console.log("userArraysent");

    // })
    // let ind = 0;
    room.onMessage("userColor", (message) => {
      
        this.myColor = message.playerColor;
      console.log("myColor - > ", this.myColor);
      
      
      // var parElement = document.getElementById('play3')!;
      //   var name = message.userName;
      //   var textToAdd = document.createTextNode(name);
      //   parElement.appendChild(textToAdd);

        // document.getElementById('player3')!.style.border = '3px solid #feff02';
        // var avatar = document.getElementById('player3')! as HTMLImageElement;
        // avatar.src =
        //   '../../assets/img/profile/Avatar' + message.avatar + '.png';
        var dice = document.getElementById('player3dice')! as HTMLImageElement;
        dice.src = '../../assets/images/initial.png';

      if(message.playerColor === 'blue'){
        document.getElementById("Canvas")!.style.transform = 'rotate(270deg)';
        document.querySelector("#Canvas")!.classList.add('rotateBoard270');
      }else if(message.playerColor === 'red'){
        document.getElementById("Canvas")!.style.transform = 'rotate(180deg)';
        document.querySelector("#Canvas")!.classList.add('rotateBoard180');
        }else if(message.playerColor === 'green'){
          document.getElementById("Canvas")!.style.transform = 'rotate(90deg)';
          document.querySelector("#Canvas")!.classList.add('rotateBoard90');
          }
    });
    let redDoneOrNot = false;
    let yellowDoneOrNot = false;
    let GreenDoneOrNot = false;
    let BlueDoneOrNot = false;
    room.onMessage('userarray', (message) => {
      console.log('userarray------->', message);
      // if(message.playerColor != 'green'){
      //   document.querySelector('.properties2')!.classList.add('hidden');
      // }
      // if(message.playerColor != 'blue'){
      //   document.querySelector('.properties3')!.classList.add('hidden');
      // }
      if(this.myColor == 'yellow'){
        console.log("my player color blue");
        if (yellowDoneOrNot == false && message.playerColor === 'yellow') {
          console.log('here in yellow');
          var parElement = document.getElementById('play4')!;
          var name = message.userName;
          var textToAdd = document.createTextNode(name);
          parElement.appendChild(textToAdd);
          yellowDoneOrNot = true;
          document.getElementById('player4')!.style.border = '3px solid #feff02';
          var avatar = document.getElementById('player4')! as HTMLImageElement;
          avatar.src =
            '../../assets/img/profile/Avatar' + message.avatar + '.png';
          var dice = document.getElementById('player4dice')! as HTMLImageElement;
          dice.src = '../../assets/images/initial.png';
          console.log("myUsername -> ", global.myId, " ", message.id);
        } else if (redDoneOrNot == false && message.playerColor === 'red') {
          console.log('here in red');
          var parElement = document.getElementById('play1')!;
          var name = message.userName;
          var textToAdd = document.createTextNode(name);
          parElement.appendChild(textToAdd);
  
          redDoneOrNot = true;
          document.getElementById('player1')!.style.border = '3px solid #feff02';
          var avatar = document.getElementById('player1')! as HTMLImageElement;
          avatar.src =
            '../../assets/img/profile/Avatar' + message.avatar + '.png';
          var dice = document.getElementById('player1dice')! as HTMLImageElement;
          dice.src = '../../assets/images/initial.png';
          console.log("myUsername -> ", global.myId, " ", message.id);
          
          
        } else if (GreenDoneOrNot == false && message.playerColor === 'green') {
          console.log('here in green');
          var parElement = document.getElementById('play2')!;
          var name = message.userName;
          var textToAdd = document.createTextNode(name);
          parElement.appendChild(textToAdd);
          GreenDoneOrNot = true;
  
          document.getElementById('player2')!.style.border = '3px solid #feff02';
          var avatar = document.getElementById('player2')! as HTMLImageElement;
          avatar.src =
            '../../assets/img/profile/Avatar' + message.avatar + '.png';
          var dice = document.getElementById('player2dice')! as HTMLImageElement;
          dice.src = '../../assets/images/initial.png';
          console.log("myUsername -> ", global.myId, " ", message.id);
          
          
         }
          else if (BlueDoneOrNot == false && message.playerColor === 'blue') {
          console.log('here in blue');
          var parElement = document.getElementById('play3')!;
          var name = message.userName;
          var textToAdd = document.createTextNode(name);
          parElement.appendChild(textToAdd);
             BlueDoneOrNot = true;
  
          document.getElementById('player3')!.style.border = '3px solid #feff02';
          var avatar = document.getElementById('player3')! as HTMLImageElement;
          avatar.src =
            '../../assets/img/profile/Avatar' + message.avatar + '.png';
        //   var dice = document.getElementById('player3dice')! as HTMLImageElement;
        //   dice.src = '../../assets/images/initial.png';
          
         }
      }
      else if(this.myColor == 'green'){
        console.log("my player color yellow");
         if (yellowDoneOrNot == false && message.playerColor === 'yellow') {
          var parElement = document.getElementById('play3')!;
        var name = message.userName;
        var textToAdd = document.createTextNode(name);
        parElement.appendChild(textToAdd);
        yellowDoneOrNot = true;

        document.getElementById('player3')!.style.border = '3px solid #feff02';
        var avatar = document.getElementById('player3')! as HTMLImageElement;
        avatar.src =
          '../../assets/img/profile/Avatar' + message.avatar + '.png';
        // var dice = document.getElementById('player3dice')! as HTMLImageElement;
        // dice.src = '../../assets/images/initial.png';
           console.log('here in yellow');
         } else
         if (redDoneOrNot == false && message.playerColor === 'red') {
          var parElement = document.getElementById('play2')!;
          var name = message.userName;
          var textToAdd = document.createTextNode(name);
          parElement.appendChild(textToAdd);
          redDoneOrNot = true;
  
          document.getElementById('player2')!.style.border = '3px solid #feff02';
          var avatar = document.getElementById('player2')! as HTMLImageElement;
          avatar.src =
            '../../assets/img/profile/Avatar' + message.avatar + '.png';
          var dice = document.getElementById('player2dice')! as HTMLImageElement;
          dice.src = '../../assets/images/initial.png';
          console.log("myUsername -> ", global.myId, " ", message.id);
          console.log('here in red');
          
          
          
        } else if (GreenDoneOrNot == false && message.playerColor === 'green') {
          var parElement = document.getElementById('play4')!;
          var name = message.userName;
          var textToAdd = document.createTextNode(name);
          parElement.appendChild(textToAdd);
          GreenDoneOrNot = true;
          document.getElementById('player4')!.style.border = '3px solid #feff02';
          var avatar = document.getElementById('player4')! as HTMLImageElement;
          avatar.src =
            '../../assets/img/profile/Avatar' + message.avatar + '.png';
          var dice = document.getElementById('player4dice')! as HTMLImageElement;
          dice.src = '../../assets/images/initial.png';
          console.log("myUsername -> ", global.myId, " ", message.id);
          console.log('here in green');
        } else if (BlueDoneOrNot == false && message.playerColor === 'blue') {
          var parElement = document.getElementById('play1')!;
          var name = message.userName;
          var textToAdd = document.createTextNode(name);
          parElement.appendChild(textToAdd);
  
          BlueDoneOrNot = true;
          document.getElementById('player1')!.style.border = '3px solid #feff02';
          var avatar = document.getElementById('player1')! as HTMLImageElement;
          avatar.src =
            '../../assets/img/profile/Avatar' + message.avatar + '.png';
          var dice = document.getElementById('player1dice')! as HTMLImageElement;
          dice.src = '../../assets/images/initial.png';
          console.log("myUsername -> ", global.myId, " ", message.id);
          console.log('here in blue');
        }
      }
      else if(this.myColor == 'blue'){
        console.log("my player color red");
        if (yellowDoneOrNot == false && message.playerColor === 'yellow') {
          var parElement = document.getElementById('play2')!;
          var name = message.userName;
          var textToAdd = document.createTextNode(name);
          parElement.appendChild(textToAdd);
          yellowDoneOrNot = true;
  
          document.getElementById('player2')!.style.border = '3px solid #feff02';
          var avatar = document.getElementById('player2')! as HTMLImageElement;
          avatar.src =
            '../../assets/img/profile/Avatar' + message.avatar + '.png';
          var dice = document.getElementById('player2dice')! as HTMLImageElement;
          dice.src = '../../assets/images/initial.png';
          console.log("myUsername -> ", global.myId, " ", message.id);
          console.log('here in yellow');
          
          
         
        } 
        else if (redDoneOrNot == false && message.playerColor === 'red') {
          var parElement = document.getElementById('play3')!;
          var name = message.userName;
          var textToAdd = document.createTextNode(name);
          parElement.appendChild(textToAdd);
        redDoneOrNot = true;
  
          document.getElementById('player3')!.style.border = '3px solid #feff02';
          var avatar = document.getElementById('player3')! as HTMLImageElement;
          avatar.src =
            '../../assets/img/profile/Avatar' + message.avatar + '.png';
        //   var dice = document.getElementById('player3dice')! as HTMLImageElement;
        //   dice.src = '../../assets/images/initial.png';
           console.log('here in red');
          
          
          
         } 
        else if (GreenDoneOrNot == false && message.playerColor === 'green') {
          var parElement = document.getElementById('play1')!;
          var name = message.userName;
          var textToAdd = document.createTextNode(name);
          parElement.appendChild(textToAdd);
  
          GreenDoneOrNot = true;
          document.getElementById('player1')!.style.border = '3px solid #feff02';
          var avatar = document.getElementById('player1')! as HTMLImageElement;
          avatar.src =
            '../../assets/img/profile/Avatar' + message.avatar + '.png';
          var dice = document.getElementById('player1dice')! as HTMLImageElement;
          dice.src = '../../assets/images/initial.png';
          console.log("myUsername -> ", global.myId, " ", message.id);
          console.log('here in green');
          
          
          
        } else if (BlueDoneOrNot == false && message.playerColor === 'blue') {
          console.log('here in blue');
          var parElement = document.getElementById('play4')!;
          var name = message.userName;
          var textToAdd = document.createTextNode(name);
          parElement.appendChild(textToAdd);
          BlueDoneOrNot = true;
          document.getElementById('player4')!.style.border = '3px solid #feff02';
          var avatar = document.getElementById('player4')! as HTMLImageElement;
          avatar.src =
            '../../assets/img/profile/Avatar' + message.avatar + '.png';
          var dice = document.getElementById('player4dice')! as HTMLImageElement;
          dice.src = '../../assets/images/initial.png';
          console.log("myUsername -> ", global.myId, " ", message.id);
          
        }
      } 
      else if(this.myColor == 'red'){
        console.log("my player color green");
        if (yellowDoneOrNot == false && message.playerColor == 'yellow') {
          var parElement = document.getElementById('play1')!;
          var name = message.userName;
          var textToAdd = document.createTextNode(name);
          parElement.appendChild(textToAdd);
  
          yellowDoneOrNot = true;
          document.getElementById('player1')!.style.border = '3px solid #feff02';
          var avatar = document.getElementById('player1')! as HTMLImageElement;
          avatar.src =
            '../../assets/img/profile/Avatar' + message.avatar + '.png';
          var dice = document.getElementById('player1dice')! as HTMLImageElement;
          dice.src = '../../assets/images/initial.png';
          console.log("myUsername -> ", global.myId, " ", message.id);
          console.log('here in yellow');
          
          
         
        } else if (redDoneOrNot == false && message.playerColor == 'red') {
          console.log('here in red');
          var parElement = document.getElementById('play4')!;
          var name = message.userName;
          var textToAdd = document.createTextNode(name);
          parElement.appendChild(textToAdd);
          redDoneOrNot = true;
          document.getElementById('player4')!.style.border = '3px solid #feff02';
          var avatar = document.getElementById('player4')! as HTMLImageElement;
          avatar.src =
            '../../assets/img/profile/Avatar' + message.avatar + '.png';
          var dice = document.getElementById('player4dice')! as HTMLImageElement;
          dice.src = '../../assets/images/initial.png';
          console.log("myUsername -> ", global.myId, " ", message.id);
          
          
        } 
        else if (GreenDoneOrNot == false && message.playerColor == 'green') {
          var parElement = document.getElementById('play3')!;
          var name = message.userName;
          var textToAdd = document.createTextNode(name);
          parElement.appendChild(textToAdd);
          GreenDoneOrNot = true;
  
          document.getElementById('player3')!.style.border = '3px solid #feff02';
          var avatar = document.getElementById('player3')! as HTMLImageElement;
          avatar.src =
            '../../assets/img/profile/Avatar' + message.avatar + '.png';
        //   var dice = document.getElementById('player3dice')! as HTMLImageElement;
        //   dice.src = '../../assets/images/initial.png';
          console.log('here in green');
          
          
          
        } 
        else if (BlueDoneOrNot == false && message.playerColor === 'blue') {
          console.log('here in blue');
          var parElement = document.getElementById('play2')!;
          var name = message.userName;
          var textToAdd = document.createTextNode(name);
          parElement.appendChild(textToAdd);
          BlueDoneOrNot = true;
  
          document.getElementById('player2')!.style.border = '3px solid #feff02';
          var avatar = document.getElementById('player2')! as HTMLImageElement;
          avatar.src =
            '../../assets/img/profile/Avatar' + message.avatar + '.png';
          var dice = document.getElementById('player2dice')! as HTMLImageElement;
          dice.src = '../../assets/images/initial.png';
          console.log("myUsername -> ", global.myId, " ", message.id);
          
        }
      }
      
    });
    var ifOnMessageRunOnce = true;
    room.onMessage('startGame', (message) => {
      // this.LudoWinnerPopUp.isVisible = true;
      //this.checkConnectivity();
      console.log('Start Game Recieved', message.player, message.names);
      room.send('giveUserArray', {
        userName: global.userName,
        avatar: this.global1.avatar,
        userId: this.global1.userId,
      });

      if (ifOnMessageRunOnce) {
        //document.querySelector("#startGameDialogue")!.classList.add("hidden");
        // document.querySelector(".waitingForPlayers")!.classList.add("hidden");
        //document.querySelector(".toppanel2")!.classList.add("hidden");
        document.querySelector('.game-wrap-search-player')!.classList.add('hidden');
          if(this.global1.LudoGameType == 'PWF' && this.global1.createOrJoin == 'create'){
            document.querySelector('.game-wrapInviteFriends')!.classList.add('hidden');
            document.querySelector('.ludo-wrap')!.classList.remove('hidden');
          }
        GAMEDATA.playerIds = message.playerIds;
        document.querySelector('#Canvas')!.classList.remove('hidden');
        document.querySelector('.toppanel')!.classList.remove('hidden');
        document.querySelector('#upperPlayer')!.classList.remove('hidden');
        document.querySelector('#lowerPlayer')!.classList.remove('hidden');
        // document.querySelector('.properties1')!.classList.remove('hidden');
        // document.querySelector('.properties2')!.classList.remove('hidden');
        // document.querySelector('.properties3')!.classList.remove('hidden');
        // document.querySelector('.properties4')!.classList.remove('hidden');
        var avatars = [];
        console.log('availablePlayers Length => ', message.availablePlayers);
          
        for (let i = 0; i <= message.availablePlayers.length; i++) {
          if (message.availablePlayers.includes(i)) {
            //adding profile pictures
            let profilePic = document.createElement('img');
            let name = document.createElement('h1');
            name.innerText = message.names[i];
            profilePic.src = '';
            profilePic.classList.add('profilePic');
            console.log(CONSTANTS.defaultColors[i]);
            document
              .querySelector('.' + CONSTANTS.defaultColors[i] + '.home')!
              .appendChild(profilePic);
            document
              .querySelector('.' + CONSTANTS.defaultColors[i] + '.home')!
              .appendChild(name);
            //placing gottis in positions
            for (let j = 0; j < 4; j++) {
              let gotti = document.createElement('img');
              name.classList.add('name');
              gotti.classList.add('gotti');
              console.log('--', message.gottisInside[i][j], '--');
              gotti.id = message.gottisInside[i][j];
              let col = gotti.id.slice(0, gotti.id.length - 1);
              gotti.src = '../../assets/images/gottis/' + col + '.png ';
              let pnt = document.querySelectorAll(
                '.home_' + col + '.inner_space'
              );
              pnt[j].appendChild(gotti);
             
            }
          }
        }
      }
      ifOnMessageRunOnce = false;

      //placing powerUps in positions
      for (var key in message.powerUps) {
        if (message.powerUps.hasOwnProperty(key)) {
          let location = document.getElementById(key);
          let powerup = new createPowerup(message.powerUps[key]);
          location!.appendChild(powerup.image);
        }
      }
    });
    room.onMessage('removeShakeAnimation', (message) => {
      console.log('inside removeShakeAnimation ', message);
      this.removeShakeAnimation(message.gottisInside, message.gottisOutside);
    });

    room.onMessage('playerIndicator1', (message) => {
      console.log('inside playerIndicator1 ', message);
      var divChild: HTMLElement;
      for (const [key1, value1] of Object.entries(this.GottiMovementAmounts)) {
        console.log(key1, value1);
        var postionforPopup: string;
        for (const [key, value] of Object.entries(this.allGottis)) {
          console.log(key, value);
          if(key1 == key){
            postionforPopup = String(value);
            console.log('position for popup -> ', postionforPopup);
            divChild = document.getElementById(postionforPopup)!.children[1] as HTMLElement;
            divChild.style.display = 'none';
            console.log("divChild -> ", divChild);
          }
        }
      }
      var playerTimer4 = document.getElementById('playerTimer4')! as HTMLImageElement;
      playerTimer4.src = "";
      document.getElementById('playerTimer4')!.style.display = 'none';
      var playerTimer3 = document.getElementById('playerTimer3')! as HTMLImageElement;
      playerTimer3.src = "";
      document.getElementById('playerTimer3')!.style.display = 'none';
      var playerTimer2 = document.getElementById('playerTimer2')! as HTMLImageElement;
      playerTimer2.src = "";
      document.getElementById('playerTimer2')!.style.display = 'none';
      var playerTimer1 = document.getElementById('playerTimer1')! as HTMLImageElement;
      playerTimer1.src = "";
      document.getElementById('playerTimer1')!.style.display = 'none';
      var image = new Image();
      image.src = "../../assets/images/Timer_15sec.gif"+"?a="+Math.random();
      if(this.myColor == 'yellow'){
        if (message.currentPlayerColor == 'yellow') {
          document.querySelector('.gif4')!.classList.add('heartBeat');
          document.querySelector('.gif3')!.classList.remove('heartBeat');
          document.querySelector('.gif2')!.classList.remove('heartBeat');
          document.querySelector('.gif1')!.classList.remove('heartBeat');
          document.querySelector('.properties4')!.classList.remove('dice-visibility');
          document.querySelector('.properties2')!.classList.add('dice-visibility');
          document.querySelector('.properties1')!.classList.add('dice-visibility');
          document.querySelector('.properties3')!.classList.add('dice-visibility');
          var playerTimer4 = document.getElementById('playerTimer4')! as HTMLImageElement;
          playerTimer4.src = image.src;
          document.getElementById('playerTimer4')!.style.display = 'block';
        }
        if (message.currentPlayerColor == 'green') {
          document.querySelector('.gif2')!.classList.add('heartBeat');
          document.querySelector('.gif3')!.classList.remove('heartBeat');
          document.querySelector('.gif4')!.classList.remove('heartBeat');
          document.querySelector('.gif1')!.classList.remove('heartBeat');
          document.querySelector('.properties2')!.classList.remove('dice-visibility');
          document.querySelector('.properties3')!.classList.add('dice-visibility');
          document.querySelector('.properties1')!.classList.add('dice-visibility');
          document.querySelector('.properties4')!.classList.add('dice-visibility');
          var playerTimer2 = document.getElementById('playerTimer2')! as HTMLImageElement;
          playerTimer2.src = image.src;
          document.getElementById('playerTimer2')!.style.display = 'block';
        }
        if (message.currentPlayerColor == 'red') {
          document.querySelector('.gif1')!.classList.add('heartBeat');
          document.querySelector('.gif3')!.classList.remove('heartBeat');
          document.querySelector('.gif2')!.classList.remove('heartBeat');
          document.querySelector('.gif4')!.classList.remove('heartBeat');
          document.querySelector('.properties1')!.classList.remove('dice-visibility');
          document.querySelector('.properties2')!.classList.add('dice-visibility');
          document.querySelector('.properties3')!.classList.add('dice-visibility');
          document.querySelector('.properties4')!.classList.add('dice-visibility');
          var playerTimer1 = document.getElementById('playerTimer1')! as HTMLImageElement;
          playerTimer1.src = image.src;
          document.getElementById('playerTimer1')!.style.display = 'block';
        }
        if (message.currentPlayerColor == 'blue') {
          document.querySelector('.gif3')!.classList.add('heartBeat');
          document.querySelector('.gif4')!.classList.remove('heartBeat');
          document.querySelector('.gif2')!.classList.remove('heartBeat');
          document.querySelector('.gif1')!.classList.remove('heartBeat');
          document.querySelector('.properties3')!.classList.remove('dice-visibility');
          document.querySelector('.properties2')!.classList.add('dice-visibility');
          document.querySelector('.properties1')!.classList.add('dice-visibility');
          document.querySelector('.properties4')!.classList.add('dice-visibility');
          var playerTimer3 = document.getElementById('playerTimer3')! as HTMLImageElement;
          playerTimer3.src = image.src;
          document.getElementById('playerTimer3')!.style.display = 'block';
        }
      }else
      if(this.myColor == 'green'){
        if (message.currentPlayerColor == 'yellow') {
          document.querySelector('.gif3')!.classList.add('heartBeat');
          document.querySelector('.gif4')!.classList.remove('heartBeat');
          document.querySelector('.gif2')!.classList.remove('heartBeat');
          document.querySelector('.gif1')!.classList.remove('heartBeat');
          document.querySelector('.properties3')!.classList.remove('dice-visibility');
          document.querySelector('.properties2')!.classList.add('dice-visibility');
          document.querySelector('.properties1')!.classList.add('dice-visibility');
          document.querySelector('.properties4')!.classList.add('dice-visibility');
          var playerTimer3 = document.getElementById('playerTimer3')! as HTMLImageElement;
          playerTimer3.src = image.src;
          document.getElementById('playerTimer3')!.style.display = 'block';
          
        }
        if (message.currentPlayerColor == 'green') {
          document.querySelector('.gif4')!.classList.add('heartBeat');
          document.querySelector('.gif3')!.classList.remove('heartBeat');
          document.querySelector('.gif2')!.classList.remove('heartBeat');
          document.querySelector('.gif1')!.classList.remove('heartBeat');
          document.querySelector('.properties4')!.classList.remove('dice-visibility');
          document.querySelector('.properties2')!.classList.add('dice-visibility');
          document.querySelector('.properties1')!.classList.add('dice-visibility');
          document.querySelector('.properties3')!.classList.add('dice-visibility');
          var playerTimer4 = document.getElementById('playerTimer4')! as HTMLImageElement;
          playerTimer4.src = image.src;
          document.getElementById('playerTimer4')!.style.display = 'block';

          
        }
        if (message.currentPlayerColor == 'red') {
          document.querySelector('.gif2')!.classList.add('heartBeat');
          document.querySelector('.gif3')!.classList.remove('heartBeat');
          document.querySelector('.gif4')!.classList.remove('heartBeat');
          document.querySelector('.gif1')!.classList.remove('heartBeat');
          document.querySelector('.properties2')!.classList.remove('dice-visibility');
          document.querySelector('.properties3')!.classList.add('dice-visibility');
          document.querySelector('.properties1')!.classList.add('dice-visibility');
          document.querySelector('.properties4')!.classList.add('dice-visibility');
          var playerTimer2 = document.getElementById('playerTimer2')! as HTMLImageElement;
          playerTimer2.src = image.src;
          document.getElementById('playerTimer2')!.style.display = 'block';
        }
        if (message.currentPlayerColor == 'blue') {
          document.querySelector('.gif1')!.classList.add('heartBeat');
          document.querySelector('.gif3')!.classList.remove('heartBeat');
          document.querySelector('.gif2')!.classList.remove('heartBeat');
          document.querySelector('.gif4')!.classList.remove('heartBeat');
          document.querySelector('.properties1')!.classList.remove('dice-visibility');
          document.querySelector('.properties2')!.classList.add('dice-visibility');
          document.querySelector('.properties3')!.classList.add('dice-visibility');
          document.querySelector('.properties4')!.classList.add('dice-visibility');
          var playerTimer1 = document.getElementById('playerTimer1')! as HTMLImageElement;
          playerTimer1.src = image.src;
          document.getElementById('playerTimer1')!.style.display = 'block';
        }
      }else
      if(this.myColor == 'red'){
        if (message.currentPlayerColor == 'yellow') {
          document.querySelector('.gif1')!.classList.add('heartBeat');
          document.querySelector('.gif3')!.classList.remove('heartBeat');
          document.querySelector('.gif2')!.classList.remove('heartBeat');
          document.querySelector('.gif4')!.classList.remove('heartBeat');
          document.querySelector('.properties1')!.classList.remove('dice-visibility');
          document.querySelector('.properties2')!.classList.add('dice-visibility');
          document.querySelector('.properties3')!.classList.add('dice-visibility');
          document.querySelector('.properties4')!.classList.add('dice-visibility');
          var playerTimer1 = document.getElementById('playerTimer1')! as HTMLImageElement;
          playerTimer1.src = image.src;
          document.getElementById('playerTimer1')!.style.display = 'block';

          
        }
        if (message.currentPlayerColor == 'green') {
          document.querySelector('.gif3')!.classList.add('heartBeat');
          document.querySelector('.gif4')!.classList.remove('heartBeat');
          document.querySelector('.gif2')!.classList.remove('heartBeat');
          document.querySelector('.gif1')!.classList.remove('heartBeat');
          document.querySelector('.properties3')!.classList.remove('dice-visibility');
          document.querySelector('.properties2')!.classList.add('dice-visibility');
          document.querySelector('.properties1')!.classList.add('dice-visibility');
          document.querySelector('.properties4')!.classList.add('dice-visibility');
          var playerTimer3 = document.getElementById('playerTimer3')! as HTMLImageElement;
          playerTimer3.src = image.src;
          document.getElementById('playerTimer3')!.style.display = 'block';

          
        }
        if (message.currentPlayerColor == 'red') {
          document.querySelector('.gif4')!.classList.add('heartBeat');
          document.querySelector('.gif3')!.classList.remove('heartBeat');
          document.querySelector('.gif2')!.classList.remove('heartBeat');
          document.querySelector('.gif1')!.classList.remove('heartBeat');
          document.querySelector('.properties4')!.classList.remove('dice-visibility');
          document.querySelector('.properties2')!.classList.add('dice-visibility');
          document.querySelector('.properties1')!.classList.add('dice-visibility');
          document.querySelector('.properties3')!.classList.add('dice-visibility');
          var playerTimer4 = document.getElementById('playerTimer4')! as HTMLImageElement;
          playerTimer4.src = image.src;
          document.getElementById('playerTimer4')!.style.display = 'block';
        }
        if (message.currentPlayerColor == 'blue') {
          document.querySelector('.gif2')!.classList.add('heartBeat');
          document.querySelector('.gif3')!.classList.remove('heartBeat');
          document.querySelector('.gif4')!.classList.remove('heartBeat');
          document.querySelector('.gif1')!.classList.remove('heartBeat');
          document.querySelector('.properties2')!.classList.remove('dice-visibility');
          document.querySelector('.properties3')!.classList.add('dice-visibility');
          document.querySelector('.properties1')!.classList.add('dice-visibility');
          document.querySelector('.properties4')!.classList.add('dice-visibility');
          var playerTimer2 = document.getElementById('playerTimer2')! as HTMLImageElement;
          playerTimer2.src = image.src;
          document.getElementById('playerTimer2')!.style.display = 'block';
        }
      }else
      if(this.myColor == 'blue'){
        if (message.currentPlayerColor == 'yellow') {
          document.querySelector('.gif2')!.classList.add('heartBeat');
          document.querySelector('.gif3')!.classList.remove('heartBeat');
          document.querySelector('.gif4')!.classList.remove('heartBeat');
          document.querySelector('.gif1')!.classList.remove('heartBeat');
          document.querySelector('.properties2')!.classList.remove('dice-visibility');
          document.querySelector('.properties3')!.classList.add('dice-visibility');
          document.querySelector('.properties1')!.classList.add('dice-visibility');
          document.querySelector('.properties4')!.classList.add('dice-visibility');
          var playerTimer2 = document.getElementById('playerTimer2')! as HTMLImageElement;
          playerTimer2.src = image.src;
          document.getElementById('playerTimer2')!.style.display = 'block';

          
        }
        if (message.currentPlayerColor == 'green') {
          document.querySelector('.gif1')!.classList.add('heartBeat');
          document.querySelector('.gif3')!.classList.remove('heartBeat');
          document.querySelector('.gif2')!.classList.remove('heartBeat');
          document.querySelector('.gif4')!.classList.remove('heartBeat');
          document.querySelector('.properties1')!.classList.remove('dice-visibility');
          document.querySelector('.properties2')!.classList.add('dice-visibility');
          document.querySelector('.properties3')!.classList.add('dice-visibility');
          document.querySelector('.properties4')!.classList.add('dice-visibility');
          var playerTimer1 = document.getElementById('playerTimer1')! as HTMLImageElement;
          playerTimer1.src = image.src;
          document.getElementById('playerTimer1')!.style.display = 'block';

          
        }
        if (message.currentPlayerColor == 'red') {
          document.querySelector('.gif3')!.classList.add('heartBeat');
          document.querySelector('.gif4')!.classList.remove('heartBeat');
          document.querySelector('.gif2')!.classList.remove('heartBeat');
          document.querySelector('.gif1')!.classList.remove('heartBeat');
          document.querySelector('.properties3')!.classList.remove('dice-visibility');
          document.querySelector('.properties2')!.classList.add('dice-visibility');
          document.querySelector('.properties1')!.classList.add('dice-visibility');
          document.querySelector('.properties4')!.classList.add('dice-visibility');
          var playerTimer3 = document.getElementById('playerTimer3')! as HTMLImageElement;
          playerTimer3.src = image.src;
          document.getElementById('playerTimer3')!.style.display = 'block';

          
        }
        if (message.currentPlayerColor == 'blue') {
          document.querySelector('.gif4')!.classList.add('heartBeat');
          document.querySelector('.gif3')!.classList.remove('heartBeat');
          document.querySelector('.gif2')!.classList.remove('heartBeat');
          document.querySelector('.gif1')!.classList.remove('heartBeat');
          document.querySelector('.properties4')!.classList.remove('dice-visibility');
          document.querySelector('.properties2')!.classList.add('dice-visibility');
          document.querySelector('.properties1')!.classList.add('dice-visibility');
          document.querySelector('.properties3')!.classList.add('dice-visibility');
          var playerTimer4 = document.getElementById('playerTimer4')! as HTMLImageElement;
          playerTimer4.src = image.src;
          document.getElementById('playerTimer4')!.style.display = 'block';
        }
      }
      // if (global.myId === message.id) {
      //   //this.myTurn = true;
      //   //alert("this is your turn to play");
      //   if (message.currentPlayerColor == 'yellow') {
      //     document.querySelector('.gif4')!.classList.add('heartBeat');
      //     //document.querySelector('#player4')!.classList.add('heartBeat');
      //     //document.querySelector('#player3')!.classList.remove('heartBeat');
      //     //document.querySelector('#player2')!.classList.remove('heartBeat');
      //     //document.querySelector('#player1')!.classList.remove('heartBeat');
      //     document.querySelector('.gif3')!.classList.remove('heartBeat');
      //     document.querySelector('.gif2')!.classList.remove('heartBeat');
      //     document.querySelector('.gif1')!.classList.remove('heartBeat');
      //     document.querySelector('.properties4')!.classList.remove('dice-visibility');
      //     document.querySelector('.properties2')!.classList.add('dice-visibility');
      //     document.querySelector('.properties1')!.classList.add('dice-visibility');
      //     document.querySelector('.properties3')!.classList.add('dice-visibility');
      //     var playerTimer4 = document.getElementById('playerTimer4')! as HTMLImageElement;
      //     playerTimer4.src = image.src;
      //     document.getElementById('playerTimer4')!.style.display = 'block';
      //   }
      //   else if (message.currentPlayerColor == 'green') {
      //     document.querySelector('.gif2')!.classList.add('heartBeat');
      //     //document.querySelector('#player2')!.classList.add('heartBeat');
      //     //document.querySelector('#player4')!.classList.remove('heartBeat');
      //     //document.querySelector('#player3')!.classList.remove('heartBeat');
      //     //document.querySelector("#player2")!.classList.remove("heartBeat");
      //     //document.querySelector('#player1')!.classList.remove('heartBeat');
      //     document.querySelector('.gif3')!.classList.remove('heartBeat');
      //     document.querySelector('.gif4')!.classList.remove('heartBeat');
      //     document.querySelector('.gif1')!.classList.remove('heartBeat');
      //     document.querySelector('.properties2')!.classList.remove('dice-visibility');
      //     document.querySelector('.properties3')!.classList.add('dice-visibility');
      //     document.querySelector('.properties1')!.classList.add('dice-visibility');
      //     document.querySelector('.properties4')!.classList.add('dice-visibility');
      //     var playerTimer2 = document.getElementById('playerTimer2')! as HTMLImageElement;
      //     playerTimer2.src = image.src;
      //     document.getElementById('playerTimer2')!.style.display = 'block';
      //   }
      //   else if (message.currentPlayerColor == 'red') {
      //     document.querySelector('.gif1')!.classList.add('heartBeat');
      //     //document.querySelector('#player1')!.classList.add('heartBeat');
      //     //document.querySelector('#player4')!.classList.remove('heartBeat');
      //     //document.querySelector('#player3')!.classList.remove('heartBeat');
      //     //document.querySelector('#player2')!.classList.remove('heartBeat');
      //     document.querySelector('.gif3')!.classList.remove('heartBeat');
      //     document.querySelector('.gif2')!.classList.remove('heartBeat');
      //     document.querySelector('.gif4')!.classList.remove('heartBeat');
      //     document.querySelector('.properties1')!.classList.remove('dice-visibility');
      //     document.querySelector('.properties2')!.classList.add('dice-visibility');
      //     document.querySelector('.properties3')!.classList.add('dice-visibility');
      //     document.querySelector('.properties4')!.classList.add('dice-visibility');
      //     var playerTimer1 = document.getElementById('playerTimer1')! as HTMLImageElement;
      //     playerTimer1.src = image.src;
      //     document.getElementById('playerTimer1')!.style.display = 'block';
      //   }
      //   else if (message.currentPlayerColor == 'blue') {
      //     document.querySelector('.gif3')!.classList.add('heartBeat');
      //     //document.querySelector('#player3')!.classList.add('heartBeat');
      //     //document.querySelector('#player4')!.classList.remove('heartBeat');
      //     //document.querySelector("#player3")!.classList.remove("heartBeat");
      //     //document.querySelector('#player2')!.classList.remove('heartBeat');
      //     //document.querySelector('#player1')!.classList.remove('heartBeat');
      //     document.querySelector('.gif4')!.classList.remove('heartBeat');
      //     document.querySelector('.gif2')!.classList.remove('heartBeat');
      //     document.querySelector('.gif1')!.classList.remove('heartBeat');
      //     document.querySelector('.properties3')!.classList.remove('dice-visibility');
      //     document.querySelector('.properties2')!.classList.add('dice-visibility');
      //     document.querySelector('.properties1')!.classList.add('dice-visibility');
      //     document.querySelector('.properties4')!.classList.add('dice-visibility');
      //     var playerTimer3 = document.getElementById('playerTimer3')! as HTMLImageElement;
      //     playerTimer3.src = image.src;
      //     document.getElementById('playerTimer3')!.style.display = 'block';
      //   }
      // } 
      // else {
      //   //this.myTurn = false;
      //   //alert("this is other player turn "+ message.currentPlayerColor);
      //   if (message.currentPlayerColor == 'yellow') {
      //     document.querySelector('.gif4')!.classList.add('heartBeat');
      //     //document.querySelector('#player4')!.classList.add('heartBeat');
      //     //document.querySelector("#player4")!.classList.remove("heartBeat");
      //     //document.querySelector('#player3')!.classList.remove('heartBeat');
      //     //document.querySelector('#player2')!.classList.remove('heartBeat');
      //     //document.querySelector('#player1')!.classList.remove('heartBeat');
      //     document.querySelector('.gif3')!.classList.remove('heartBeat');
      //     document.querySelector('.gif2')!.classList.remove('heartBeat');
      //     document.querySelector('.gif1')!.classList.remove('heartBeat');
      //     document.querySelector('.properties4')!.classList.remove('dice-visibility');
      //     document.querySelector('.properties2')!.classList.add('dice-visibility');
      //     document.querySelector('.properties1')!.classList.add('dice-visibility');
      //     document.querySelector('.properties3')!.classList.add('dice-visibility');
      //     var playerTimer4 = document.getElementById('playerTimer4')! as HTMLImageElement;
      //     playerTimer4.src = image.src;
      //     document.getElementById('playerTimer4')!.style.display = 'block';
      //   }
      //   else if (message.currentPlayerColor == 'green') {
      //     document.querySelector('.gif2')!.classList.add('heartBeat');
      //     //document.querySelector('#player2')!.classList.add('heartBeat');
      //     //document.querySelector('#player4')!.classList.remove('heartBeat');
      //     //document.querySelector('#player3')!.classList.remove('heartBeat');
      //     //document.querySelector("#player2")!.classList.remove("heartBeat");
      //     //document.querySelector('#player1')!.classList.remove('heartBeat');
      //     document.querySelector('.gif3')!.classList.remove('heartBeat');
      //     document.querySelector('.gif4')!.classList.remove('heartBeat');
      //     document.querySelector('.gif1')!.classList.remove('heartBeat');
      //     document.querySelector('.properties2')!.classList.remove('dice-visibility');
      //     document.querySelector('.properties3')!.classList.add('dice-visibility');
      //     document.querySelector('.properties1')!.classList.add('dice-visibility');
      //     document.querySelector('.properties4')!.classList.add('dice-visibility');
      //     var playerTimer2 = document.getElementById('playerTimer2')! as HTMLImageElement;
      //     playerTimer2.src = image.src;
      //     document.getElementById('playerTimer2')!.style.display = 'block';
      //   }
      //   else if (message.currentPlayerColor == 'red') {
      //     document.querySelector('.gif1')!.classList.add('heartBeat');
      //     //document.querySelector('#player1')!.classList.add('heartBeat');
      //     //document.querySelector('#player4')!.classList.remove('heartBeat');
      //     //document.querySelector('#player3')!.classList.remove('heartBeat');
      //     //document.querySelector('#player2')!.classList.remove('heartBeat');
      //     //document.querySelector("#player1")!.classList.remove("heartBeat");
      //     document.querySelector('.gif3')!.classList.remove('heartBeat');
      //     document.querySelector('.gif2')!.classList.remove('heartBeat');
      //     document.querySelector('.gif4')!.classList.remove('heartBeat');
      //     document.querySelector('.properties1')!.classList.remove('dice-visibility');
      //     document.querySelector('.properties2')!.classList.add('dice-visibility');
      //     document.querySelector('.properties3')!.classList.add('dice-visibility');
      //     document.querySelector('.properties4')!.classList.add('dice-visibility');
      //     var playerTimer1 = document.getElementById('playerTimer1')! as HTMLImageElement;
      //     playerTimer1.src = image.src;
      //     document.getElementById('playerTimer1')!.style.display = 'block';
      //   }
      //   else if (message.currentPlayerColor == 'blue') {
      //     document.querySelector('.gif3')!.classList.add('heartBeat');
      //     //document.querySelector('#player3')!.classList.add('heartBeat');
      //     //document.querySelector('#player4')!.classList.remove('heartBeat');
      //     //document.querySelector("#player3")!.classList.remove("heartBeat");
      //     //document.querySelector('#player2')!.classList.remove('heartBeat');
      //     //document.querySelector('#player1')!.classList.remove('heartBeat');
      //     document.querySelector('.gif4')!.classList.remove('heartBeat');
      //     document.querySelector('.gif2')!.classList.remove('heartBeat');
      //     document.querySelector('.gif1')!.classList.remove('heartBeat');
      //     document.querySelector('.properties3')!.classList.remove('dice-visibility');
      //     document.querySelector('.properties2')!.classList.add('dice-visibility');
      //     document.querySelector('.properties1')!.classList.add('dice-visibility');
      //     document.querySelector('.properties4')!.classList.add('dice-visibility');
      //     var playerTimer3 = document.getElementById('playerTimer3')! as HTMLImageElement;
      //     playerTimer3.src = image.src;
      //     document.getElementById('playerTimer3')!.style.display = 'block';
      //   }
      // }
    });
    
    room.onMessage('playerIndicator', (message) => {
      this.sixArrayRecived = false;
      var divChild: HTMLElement;
      for (const [key1, value1] of Object.entries(this.GottiMovementAmounts)) {
        console.log(key1, value1);
        var postionforPopup: string;
        for (const [key, value] of Object.entries(this.allGottis)) {
          console.log(key, value);
          if(key1 == key){
            postionforPopup = String(value);
            console.log('position for popup -> ', postionforPopup);
            divChild = document.getElementById(postionforPopup)!.children[1] as HTMLElement;
            divChild.style.display = 'none';
            console.log("divChild -> ", divChild);
          }
        }
      }
      var playerTimer4 = document.getElementById('playerTimer4')! as HTMLImageElement;
      playerTimer4.src = "";
      document.getElementById('playerTimer4')!.style.display = 'none';
      var playerTimer3 = document.getElementById('playerTimer3')! as HTMLImageElement;
      playerTimer3.src = "";
      document.getElementById('playerTimer3')!.style.display = 'none';
      var playerTimer2 = document.getElementById('playerTimer2')! as HTMLImageElement;
      playerTimer2.src = "";
      document.getElementById('playerTimer2')!.style.display = 'none';
      var playerTimer1 = document.getElementById('playerTimer1')! as HTMLImageElement;
      playerTimer1.src = "";
      document.getElementById('playerTimer1')!.style.display = 'none';
      redDoneOrNot = false;
      yellowDoneOrNot = false;
      GreenDoneOrNot = false;
      BlueDoneOrNot = false;
      var image = new Image();
      image.src = "../../assets/images/Timer_15sec.gif"+"?a="+Math.random();
      console.log(
        'currentPlayerColor--->',
        message.currentPlayerColor,
        ' id-->',
        message.id,
        'clientId-->',
        global.myId
      );
      console.log('adding highlight');
      let all = document.querySelectorAll('.home .profilePic');
      for (let i = 0; i < all.length; i++) {
        if (all[i].className.includes('highLight')) {
          all[i].classList.remove('highLight');
          break;
        }
      }
      GAMEDATA.currentPlayerColor = message.currentPlayerColor;
      // let home = document.querySelector(
      //   '.' + message.currentPlayerColor + '.home .profilePic'
      // );
      // home!.classList.add('highLight');
      
        //this.myTurn = true;
        //alert("this is your turn to play");
        if(this.myColor == 'yellow'){
          if (message.currentPlayerColor == 'yellow') {
            document.querySelector('.gif4')!.classList.add('heartBeat');
            document.querySelector('.gif3')!.classList.remove('heartBeat');
            document.querySelector('.gif2')!.classList.remove('heartBeat');
            document.querySelector('.gif1')!.classList.remove('heartBeat');
            document.querySelector('.properties4')!.classList.remove('dice-visibility');
            document.querySelector('.properties2')!.classList.add('dice-visibility');
            document.querySelector('.properties1')!.classList.add('dice-visibility');
            document.querySelector('.properties3')!.classList.add('dice-visibility');
            var playerTimer4 = document.getElementById('playerTimer4')! as HTMLImageElement;
            playerTimer4.src = image.src;
            document.getElementById('playerTimer4')!.style.display = 'block';
          }
          if (message.currentPlayerColor == 'green') {
            document.querySelector('.gif2')!.classList.add('heartBeat');
            document.querySelector('.gif3')!.classList.remove('heartBeat');
            document.querySelector('.gif4')!.classList.remove('heartBeat');
            document.querySelector('.gif1')!.classList.remove('heartBeat');
            document.querySelector('.properties2')!.classList.remove('dice-visibility');
            document.querySelector('.properties3')!.classList.add('dice-visibility');
            document.querySelector('.properties1')!.classList.add('dice-visibility');
            document.querySelector('.properties4')!.classList.add('dice-visibility');
            var playerTimer2 = document.getElementById('playerTimer2')! as HTMLImageElement;
            playerTimer2.src = image.src;
            document.getElementById('playerTimer2')!.style.display = 'block';
          }
          if (message.currentPlayerColor == 'red') {
            document.querySelector('.gif1')!.classList.add('heartBeat');
            document.querySelector('.gif3')!.classList.remove('heartBeat');
            document.querySelector('.gif2')!.classList.remove('heartBeat');
            document.querySelector('.gif4')!.classList.remove('heartBeat');
            document.querySelector('.properties1')!.classList.remove('dice-visibility');
            document.querySelector('.properties2')!.classList.add('dice-visibility');
            document.querySelector('.properties3')!.classList.add('dice-visibility');
            document.querySelector('.properties4')!.classList.add('dice-visibility');
            var playerTimer1 = document.getElementById('playerTimer1')! as HTMLImageElement;
            playerTimer1.src = image.src;
            document.getElementById('playerTimer1')!.style.display = 'block';
          }
          if (message.currentPlayerColor == 'blue') {
            document.querySelector('.gif3')!.classList.add('heartBeat');
            document.querySelector('.gif4')!.classList.remove('heartBeat');
            document.querySelector('.gif2')!.classList.remove('heartBeat');
            document.querySelector('.gif1')!.classList.remove('heartBeat');
            document.querySelector('.properties3')!.classList.remove('dice-visibility');
            document.querySelector('.properties2')!.classList.add('dice-visibility');
            document.querySelector('.properties1')!.classList.add('dice-visibility');
            document.querySelector('.properties4')!.classList.add('dice-visibility');
            var playerTimer3 = document.getElementById('playerTimer3')! as HTMLImageElement;
            playerTimer3.src = image.src;
            document.getElementById('playerTimer3')!.style.display = 'block';
          }
        }else
        if(this.myColor == 'green'){
          if (message.currentPlayerColor == 'yellow') {
            document.querySelector('.gif3')!.classList.add('heartBeat');
            document.querySelector('.gif4')!.classList.remove('heartBeat');
            document.querySelector('.gif2')!.classList.remove('heartBeat');
            document.querySelector('.gif1')!.classList.remove('heartBeat');
            document.querySelector('.properties3')!.classList.remove('dice-visibility');
            document.querySelector('.properties2')!.classList.add('dice-visibility');
            document.querySelector('.properties1')!.classList.add('dice-visibility');
            document.querySelector('.properties4')!.classList.add('dice-visibility');
            var playerTimer3 = document.getElementById('playerTimer3')! as HTMLImageElement;
            playerTimer3.src = image.src;
            document.getElementById('playerTimer3')!.style.display = 'block';
            
          }
          if (message.currentPlayerColor == 'green') {
            document.querySelector('.gif4')!.classList.add('heartBeat');
            document.querySelector('.gif3')!.classList.remove('heartBeat');
            document.querySelector('.gif2')!.classList.remove('heartBeat');
            document.querySelector('.gif1')!.classList.remove('heartBeat');
            document.querySelector('.properties4')!.classList.remove('dice-visibility');
            document.querySelector('.properties2')!.classList.add('dice-visibility');
            document.querySelector('.properties1')!.classList.add('dice-visibility');
            document.querySelector('.properties3')!.classList.add('dice-visibility');
            var playerTimer4 = document.getElementById('playerTimer4')! as HTMLImageElement;
            playerTimer4.src = image.src;
            document.getElementById('playerTimer4')!.style.display = 'block';

            
          }
          if (message.currentPlayerColor == 'red') {
            document.querySelector('.gif2')!.classList.add('heartBeat');
            document.querySelector('.gif3')!.classList.remove('heartBeat');
            document.querySelector('.gif4')!.classList.remove('heartBeat');
            document.querySelector('.gif1')!.classList.remove('heartBeat');
            document.querySelector('.properties2')!.classList.remove('dice-visibility');
            document.querySelector('.properties3')!.classList.add('dice-visibility');
            document.querySelector('.properties1')!.classList.add('dice-visibility');
            document.querySelector('.properties4')!.classList.add('dice-visibility');
            var playerTimer2 = document.getElementById('playerTimer2')! as HTMLImageElement;
            playerTimer2.src = image.src;
            document.getElementById('playerTimer2')!.style.display = 'block';
          }
          if (message.currentPlayerColor == 'blue') {
            document.querySelector('.gif1')!.classList.add('heartBeat');
            document.querySelector('.gif3')!.classList.remove('heartBeat');
            document.querySelector('.gif2')!.classList.remove('heartBeat');
            document.querySelector('.gif4')!.classList.remove('heartBeat');
            document.querySelector('.properties1')!.classList.remove('dice-visibility');
            document.querySelector('.properties2')!.classList.add('dice-visibility');
            document.querySelector('.properties3')!.classList.add('dice-visibility');
            document.querySelector('.properties4')!.classList.add('dice-visibility');
            var playerTimer1 = document.getElementById('playerTimer1')! as HTMLImageElement;
            playerTimer1.src = image.src;
            document.getElementById('playerTimer1')!.style.display = 'block';
          }
        }else
        if(this.myColor == 'red'){
          if (message.currentPlayerColor == 'yellow') {
            document.querySelector('.gif1')!.classList.add('heartBeat');
            document.querySelector('.gif3')!.classList.remove('heartBeat');
            document.querySelector('.gif2')!.classList.remove('heartBeat');
            document.querySelector('.gif4')!.classList.remove('heartBeat');
            document.querySelector('.properties1')!.classList.remove('dice-visibility');
            document.querySelector('.properties2')!.classList.add('dice-visibility');
            document.querySelector('.properties3')!.classList.add('dice-visibility');
            document.querySelector('.properties4')!.classList.add('dice-visibility');
            var playerTimer1 = document.getElementById('playerTimer1')! as HTMLImageElement;
            playerTimer1.src = image.src;
            document.getElementById('playerTimer1')!.style.display = 'block';

            
          }
          if (message.currentPlayerColor == 'green') {
            document.querySelector('.gif3')!.classList.add('heartBeat');
            document.querySelector('.gif4')!.classList.remove('heartBeat');
            document.querySelector('.gif2')!.classList.remove('heartBeat');
            document.querySelector('.gif1')!.classList.remove('heartBeat');
            document.querySelector('.properties3')!.classList.remove('dice-visibility');
            document.querySelector('.properties2')!.classList.add('dice-visibility');
            document.querySelector('.properties1')!.classList.add('dice-visibility');
            document.querySelector('.properties4')!.classList.add('dice-visibility');
            var playerTimer3 = document.getElementById('playerTimer3')! as HTMLImageElement;
            playerTimer3.src = image.src;
            document.getElementById('playerTimer3')!.style.display = 'block';

            
          }
          if (message.currentPlayerColor == 'red') {
            document.querySelector('.gif4')!.classList.add('heartBeat');
            document.querySelector('.gif3')!.classList.remove('heartBeat');
            document.querySelector('.gif2')!.classList.remove('heartBeat');
            document.querySelector('.gif1')!.classList.remove('heartBeat');
            document.querySelector('.properties4')!.classList.remove('dice-visibility');
            document.querySelector('.properties2')!.classList.add('dice-visibility');
            document.querySelector('.properties1')!.classList.add('dice-visibility');
            document.querySelector('.properties3')!.classList.add('dice-visibility');
            var playerTimer4 = document.getElementById('playerTimer4')! as HTMLImageElement;
            playerTimer4.src = image.src;
            document.getElementById('playerTimer4')!.style.display = 'block';
          }
          if (message.currentPlayerColor == 'blue') {
            document.querySelector('.gif2')!.classList.add('heartBeat');
            document.querySelector('.gif3')!.classList.remove('heartBeat');
            document.querySelector('.gif4')!.classList.remove('heartBeat');
            document.querySelector('.gif1')!.classList.remove('heartBeat');
            document.querySelector('.properties2')!.classList.remove('dice-visibility');
            document.querySelector('.properties3')!.classList.add('dice-visibility');
            document.querySelector('.properties1')!.classList.add('dice-visibility');
            document.querySelector('.properties4')!.classList.add('dice-visibility');
            var playerTimer2 = document.getElementById('playerTimer2')! as HTMLImageElement;
            playerTimer2.src = image.src;
            document.getElementById('playerTimer2')!.style.display = 'block';
          }
        }else
        if(this.myColor == 'blue'){
          if (message.currentPlayerColor == 'yellow') {
            document.querySelector('.gif2')!.classList.add('heartBeat');
            document.querySelector('.gif3')!.classList.remove('heartBeat');
            document.querySelector('.gif4')!.classList.remove('heartBeat');
            document.querySelector('.gif1')!.classList.remove('heartBeat');
            document.querySelector('.properties2')!.classList.remove('dice-visibility');
            document.querySelector('.properties3')!.classList.add('dice-visibility');
            document.querySelector('.properties1')!.classList.add('dice-visibility');
            document.querySelector('.properties4')!.classList.add('dice-visibility');
            var playerTimer2 = document.getElementById('playerTimer2')! as HTMLImageElement;
            playerTimer2.src = image.src;
            document.getElementById('playerTimer2')!.style.display = 'block';

            
          }
          if (message.currentPlayerColor == 'green') {
            document.querySelector('.gif1')!.classList.add('heartBeat');
            document.querySelector('.gif3')!.classList.remove('heartBeat');
            document.querySelector('.gif2')!.classList.remove('heartBeat');
            document.querySelector('.gif4')!.classList.remove('heartBeat');
            document.querySelector('.properties1')!.classList.remove('dice-visibility');
            document.querySelector('.properties2')!.classList.add('dice-visibility');
            document.querySelector('.properties3')!.classList.add('dice-visibility');
            document.querySelector('.properties4')!.classList.add('dice-visibility');
            var playerTimer1 = document.getElementById('playerTimer1')! as HTMLImageElement;
            playerTimer1.src = image.src;
            document.getElementById('playerTimer1')!.style.display = 'block';

            
          }
          if (message.currentPlayerColor == 'red') {
            document.querySelector('.gif3')!.classList.add('heartBeat');
            document.querySelector('.gif4')!.classList.remove('heartBeat');
            document.querySelector('.gif2')!.classList.remove('heartBeat');
            document.querySelector('.gif1')!.classList.remove('heartBeat');
            document.querySelector('.properties3')!.classList.remove('dice-visibility');
            document.querySelector('.properties2')!.classList.add('dice-visibility');
            document.querySelector('.properties1')!.classList.add('dice-visibility');
            document.querySelector('.properties4')!.classList.add('dice-visibility');
            var playerTimer3 = document.getElementById('playerTimer3')! as HTMLImageElement;
            playerTimer3.src = image.src;
            document.getElementById('playerTimer3')!.style.display = 'block';

            
          }
          if (message.currentPlayerColor == 'blue') {
            document.querySelector('.gif4')!.classList.add('heartBeat');
            document.querySelector('.gif3')!.classList.remove('heartBeat');
            document.querySelector('.gif2')!.classList.remove('heartBeat');
            document.querySelector('.gif1')!.classList.remove('heartBeat');
            document.querySelector('.properties4')!.classList.remove('dice-visibility');
            document.querySelector('.properties2')!.classList.add('dice-visibility');
            document.querySelector('.properties1')!.classList.add('dice-visibility');
            document.querySelector('.properties3')!.classList.add('dice-visibility');
            var playerTimer4 = document.getElementById('playerTimer4')! as HTMLImageElement;
            playerTimer4.src = image.src;
            document.getElementById('playerTimer4')!.style.display = 'block';
          }
        }
       
      
      // else {
      //   //this.myTurn = false;
      //   //alert("this is other player turn "+ message.currentPlayerColor);
      //   if (message.currentPlayerColor == 'yellow') {
      //     document.querySelector('.gif4')!.classList.add('heartBeat');
      //     //document.querySelector('#player4')!.classList.add('heartBeat');
      //     //document.querySelector("#player4")!.classList.remove("heartBeat");
      //     //document.querySelector('#player3')!.classList.remove('heartBeat');
      //     //document.querySelector('#player2')!.classList.remove('heartBeat');
      //     //document.querySelector('#player1')!.classList.remove('heartBeat');
      //     document.querySelector('.gif3')!.classList.remove('heartBeat');
      //     document.querySelector('.gif2')!.classList.remove('heartBeat');
      //     document.querySelector('.gif1')!.classList.remove('heartBeat');
      //     document.querySelector('.properties4')!.classList.remove('dice-visibility');
      //     document.querySelector('.properties2')!.classList.add('dice-visibility');
      //     document.querySelector('.properties1')!.classList.add('dice-visibility');
      //     document.querySelector('.properties3')!.classList.add('dice-visibility');
      //     var playerTimer4 = document.getElementById('playerTimer4')! as HTMLImageElement;
      //     playerTimer4.src = image.src;
      //     document.getElementById('playerTimer4')!.style.display = 'block';
      //   }
      //   if (message.currentPlayerColor == 'green') {
      //     document.querySelector('.gif2')!.classList.add('heartBeat');
      //     //document.querySelector('#player2')!.classList.add('heartBeat');
      //     //document.querySelector('#player4')!.classList.remove('heartBeat');
      //     //document.querySelector('#player3')!.classList.remove('heartBeat');
      //     //document.querySelector("#player2")!.classList.remove("heartBeat");
      //     //document.querySelector('#player1')!.classList.remove('heartBeat');
      //     document.querySelector('.gif3')!.classList.remove('heartBeat');
      //     document.querySelector('.gif4')!.classList.remove('heartBeat');
      //     document.querySelector('.gif1')!.classList.remove('heartBeat');
      //     document.querySelector('.properties2')!.classList.remove('dice-visibility');
      //     document.querySelector('.properties3')!.classList.add('dice-visibility');
      //     document.querySelector('.properties1')!.classList.add('dice-visibility');
      //     document.querySelector('.properties4')!.classList.add('dice-visibility');
      //     var playerTimer2 = document.getElementById('playerTimer2')! as HTMLImageElement;
      //     playerTimer2.src = image.src;
      //     document.getElementById('playerTimer2')!.style.display = 'block';
      //   }
      //   if (message.currentPlayerColor == 'red') {
      //     document.querySelector('.gif1')!.classList.add('heartBeat');
      //     //document.querySelector('#player1')!.classList.add('heartBeat');
      //     //document.querySelector('#player4')!.classList.remove('heartBeat');
      //     //document.querySelector('#player3')!.classList.remove('heartBeat');
      //     //document.querySelector('#player2')!.classList.remove('heartBeat');
      //     //document.querySelector("#player1")!.classList.remove("heartBeat");
      //     document.querySelector('.gif3')!.classList.remove('heartBeat');
      //     document.querySelector('.gif2')!.classList.remove('heartBeat');
      //     document.querySelector('.gif4')!.classList.remove('heartBeat');
      //     document.querySelector('.properties1')!.classList.remove('dice-visibility');
      //     document.querySelector('.properties2')!.classList.add('dice-visibility');
      //     document.querySelector('.properties3')!.classList.add('dice-visibility');
      //     document.querySelector('.properties4')!.classList.add('dice-visibility');
      //     var playerTimer1 = document.getElementById('playerTimer1')! as HTMLImageElement;
      //     playerTimer1.src = image.src;
      //     document.getElementById('playerTimer1')!.style.display = 'block';
      //   }
      //   if (message.currentPlayerColor == 'blue') {
      //     document.querySelector('.gif3')!.classList.add('heartBeat');
      //     //document.querySelector('#player3')!.classList.add('heartBeat');
      //     //document.querySelector('#player4')!.classList.remove('heartBeat');
      //     //document.querySelector("#player3")!.classList.remove("heartBeat");
      //     //document.querySelector('#player2')!.classList.remove('heartBeat');
      //     //document.querySelector('#player1')!.classList.remove('heartBeat');
      //     document.querySelector('.gif4')!.classList.remove('heartBeat');
      //     document.querySelector('.gif2')!.classList.remove('heartBeat');
      //     document.querySelector('.gif1')!.classList.remove('heartBeat');
      //     document.querySelector('.properties3')!.classList.remove('dice-visibility');
      //     document.querySelector('.properties2')!.classList.add('dice-visibility');
      //     document.querySelector('.properties1')!.classList.add('dice-visibility');
      //     document.querySelector('.properties4')!.classList.add('dice-visibility');
      //     var playerTimer3 = document.getElementById('playerTimer3')! as HTMLImageElement;
      //     playerTimer3.src = image.src;
      //     document.getElementById('playerTimer3')!.style.display = 'block';
      //   }
      // }
    });
    room.onMessage('rollTheDice', async (message) => {
      console.log('message in roll the dice', message);
      this.soundService.playAudio('Dicesound');
      var playerTimer4 = document.getElementById('playerTimer4')! as HTMLImageElement;
      playerTimer4.src = "";
      document.getElementById('playerTimer4')!.style.display = 'none';
      var playerTimer3 = document.getElementById('playerTimer3')! as HTMLImageElement;
      playerTimer3.src = "";
      document.getElementById('playerTimer3')!.style.display = 'none';
      var playerTimer2 = document.getElementById('playerTimer2')! as HTMLImageElement;
      playerTimer2.src = "";
      document.getElementById('playerTimer2')!.style.display = 'none';
      var playerTimer1 = document.getElementById('playerTimer1')! as HTMLImageElement;
      playerTimer1.src = "";
      document.getElementById('playerTimer1')!.style.display = 'none';
      if(this.myColor == 'yellow'){
        if (message.currentPlayerColor == 'yellow') {
          let gif: HTMLImageElement = document.querySelector('.gif4')!;
          gif.src = '../../assets/images/GIFS/' + message.movementAmount + '.gif';
        } else if (message.currentPlayerColor == 'red') {
          let gif: HTMLImageElement = document.querySelector('.gif1')!;
          gif.src = '../../assets/images/GIFS/' + message.movementAmount + '.gif';
        } else if (message.currentPlayerColor == 'green') {
          let gif: HTMLImageElement = document.querySelector('.gif2')!;
          gif.src = '../../assets/images/GIFS/' + message.movementAmount + '.gif';
        } else if (message.currentPlayerColor == 'blue') {
          let gif: HTMLImageElement = document.querySelector('.gif3')!;
          gif.src = '../../assets/images/GIFS/' + message.movementAmount + '.gif';
        }
      }
      if(this.myColor == 'green'){
        if (message.currentPlayerColor == 'yellow') {
          let gif: HTMLImageElement = document.querySelector('.gif3')!;
          gif.src = '../../assets/images/GIFS/' + message.movementAmount + '.gif';
          
        } else if (message.currentPlayerColor == 'red') {
          let gif: HTMLImageElement = document.querySelector('.gif2')!;
          gif.src = '../../assets/images/GIFS/' + message.movementAmount + '.gif';
          
        } else if (message.currentPlayerColor == 'green') {
          let gif: HTMLImageElement = document.querySelector('.gif4')!;
          gif.src = '../../assets/images/GIFS/' + message.movementAmount + '.gif';
          
        } else if (message.currentPlayerColor == 'blue') {
          let gif: HTMLImageElement = document.querySelector('.gif1')!;
          gif.src = '../../assets/images/GIFS/' + message.movementAmount + '.gif';
        }
      }
      if(this.myColor == 'red'){
        if (message.currentPlayerColor == 'yellow') {
          let gif: HTMLImageElement = document.querySelector('.gif1')!;
          gif.src = '../../assets/images/GIFS/' + message.movementAmount + '.gif';
          
        } else if (message.currentPlayerColor == 'red') {
          let gif: HTMLImageElement = document.querySelector('.gif4')!;
          gif.src = '../../assets/images/GIFS/' + message.movementAmount + '.gif';
        } else if (message.currentPlayerColor == 'green') {
          let gif: HTMLImageElement = document.querySelector('.gif3')!;
          gif.src = '../../assets/images/GIFS/' + message.movementAmount + '.gif';
          
        } else if (message.currentPlayerColor == 'blue') {
          let gif: HTMLImageElement = document.querySelector('.gif2')!;
          gif.src = '../../assets/images/GIFS/' + message.movementAmount + '.gif';
        }
      }
      if(this.myColor == 'blue'){
        if (message.currentPlayerColor == 'yellow') {
          let gif: HTMLImageElement = document.querySelector('.gif2')!;
          gif.src = '../../assets/images/GIFS/' + message.movementAmount + '.gif';
          
        } else if (message.currentPlayerColor == 'red') {
          let gif: HTMLImageElement = document.querySelector('.gif3')!;
          gif.src = '../../assets/images/GIFS/' + message.movementAmount + '.gif';
          
        } else if (message.currentPlayerColor == 'green') {
          let gif: HTMLImageElement = document.querySelector('.gif1')!;
          gif.src = '../../assets/images/GIFS/' + message.movementAmount + '.gif';
          
        } else if (message.currentPlayerColor == 'blue') {
          let gif: HTMLImageElement = document.querySelector('.gif4')!;
          gif.src = '../../assets/images/GIFS/' + message.movementAmount + '.gif';
        }
      }
      var diceValueSoundTime = setTimeout(()=> {
        clearTimeout(diceValueSoundTime);
        if(message.movementAmount == 1) this.soundService.playAudio('Dice1');
        else if(message.movementAmount == 2) this.soundService.playAudio('Dice4');
        else if(message.movementAmount == 6) this.soundService.playAudio('Dice6');
      },1300);
      // let gif: HTMLImageElement = document.querySelector(".gif")!;
      // gif.src = '../../assets/images/GIFS/' + message.movementAmount + ".gif";
    });

    room.onMessage('moveGotti', async (message) => {
      console.log('inside moveGotti', message);
     
      GAMEDATA.playerIndex = message.playerIndex;
      this.removeShakeAnimation(message.gottisInside, message.gottisOutside);
      let g = document.getElementById(message.id);
      let fd;
      for (let i = 0; i < message.positions.length - 1; ) {
        
        fd = document.getElementById(message.positions[i]);
        //if two gottis incountered in the way removes the classes that makes them smaller
        let fdGottis = fd!.getElementsByClassName('gotti');
        if (fdGottis.length <= 2) {
          fd!.classList.remove('twoGotti');
        } else if (fdGottis.length == 3) {
          fd!.classList.remove('multipleGotti');
        }
        //if the gotti has reached the finish line
        i++;
        fd = document.getElementById(message.positions[i]);
        if (fd) {
          fdGottis = fd.getElementsByClassName('gotti');
          //checks the position for any opponents or powerups
          await new Promise((r) => setTimeout(r, 200));
          if (fdGottis.length === 2) fd.classList.add('twoGotti');
          else if (fdGottis.length > 2) fd.classList.add('multipleGotti');
          fd.appendChild(g!);
        }
        if (i == message.positions.length - 1) {
          if(Number(message.positions[i])==18 || Number(message.positions[i])==1 ||
            Number(message.positions[i]==35) ||Number(message.positions[i])==52 ||
              Number(message.positions[i])==14 ||Number(message.positions[i])==65 ||
                Number(message.positions[i])==48 ||Number(message.positions[i])==31 )
            this.soundService.playAudio('F_square');
          if (message.result['killed'])
            this.killGotti(message.result['killed']);
          // if (result['powerUp']) addPowerUp(result['powerUp'])
          if (message.result['gottiHome'])
            this.gottiHome(message.result['gottiHome']);
          if (message.result['gameFinished'])
            this.gottiHome(message.result['gottiHome']);
        }
      }
      console.log(
        'GAME--------> ',
        global.myId,
        ' --------client.id------- ',
        message.currentPlayerId
      );
      if (global.myId == message.currentPlayerId && message.sixOrnot == 1) {
        room.send('finishedmovingOnechance',{ result: message.result });
      }
      if (global.myId == message.currentPlayerId && message.sixOrnot == 0) {
        room.send('finishedMoving', { result: message.result });
      }
      //this.eventListenerdone = true;
    });

    room.onMessage('getGottiOut', (message) => {
      console.log('inside getGottiOut');
     
      this.soundService.playAudio('F_square');
      this.removeShakeAnimation(message.gottisInside, message.gottisOutside);
      let fd = document.getElementById(message.position)!;
      let g = document.getElementById(message.id)!;
      fd.appendChild(g);
      //nikalda kheri position ma multiple gotti check
      let fdLen = fd.getElementsByClassName('gotti');
      if (fdLen.length == 2) {
        fd.classList.add('twoGotti');
      } else if (fdLen.length > 2) {
        fd.classList.add('multipleGotti');
      }
      if (global.myId == message.currentPlayerId && message.sixOrnot == 1) {
        room.send('finishedmovingOnechance',{ result: message.result });
      }
      if (global.myId == message.currentPlayerId && message.sixOrnot == 0) {
        room.send('finishedMoving', { result: null });
      }
      //this.eventListenerdone = true;
    });
    room.onMessage("moveAgain" , () => {
      this.eventListenerdone = true;
    });
    room.onMessage('removePowerUp', (message) => {
      let pp = document.querySelector('.powerUps');
      pp!.classList.remove('timer');
      let p = document.querySelector('.powerUps');
      let c = p!.querySelector('.' + message.type);
      p!.removeChild(c!);
    });

    room.onMessage('addShakeAnimation', (message) => {
      this.eventListenerdone = true;
      console.log('inside addShakeAnimation', message);
      message.movableGottis.forEach((element: any) => {
        console.log('element---', element);
        var d = document.getElementById(element);
        console.log(d);
        d!.classList.add('useMe');
        //d.className += " useMe";
        console.log(d);
      });
    });

    room.onMessage('removeGottiShake', () => {
      this.eventListenerdone = false;
      console.log('removeGottiShake--------');
      if (document.querySelector('.gif1')!.className.includes('heartBeat')) {
        document.querySelector('.gif1')!.classList.remove('heartBeat');
      } else if (
        document.querySelector('.gif2')!.className.includes('heartBeat')
      ) {
        document.querySelector('.gif2')!.classList.remove('heartBeat');
      } else if (
        document.querySelector('.gif3')!.className.includes('heartBeat')
      ) {
        document.querySelector('.gif3')!.classList.remove('heartBeat');
      } else if (
        document.querySelector('.gif4')!.className.includes('heartBeat')
      ) {
        document.querySelector('.gif4')!.classList.remove('heartBeat');
      }
    });

    room.onMessage('gameOver', (message) => {
      console.log("Game has ended. rank 1 => ", message.rank1);
      // console.log("Game has ended. rank 2 => ", message.rank2);
      // console.log("Game has ended. rank 3 => ", message.rank3);
      this.LudoWinnerPopUp.isVisible = true;
      this.LudoWinnerPopUp.winnerName = message.rank1;
      var avtarPic = setTimeout(()=> {
        clearTimeout(avtarPic);
        this.LudoWinnerPopUp.winnerAvatar = document.getElementById('winnerPopupAvatar')! as HTMLImageElement;
        this.LudoWinnerPopUp.winnerAvatar.src = '../../assets/img/profile/Avatar'+ this.global1.avatar + '.png';
      },100);
      //var winnerAvatar = document.getElementById('winnerPopupAvatar')! as HTMLImageElement;
      //this.LudoWinnerPopUp.winnerAvatar.src = '../../../assets/img1/Winner_Screen/Avatar'+ message.rank1Avatar + '.png';
      room.leave();
      if(String(message.rank1) == String(this.global1.userName)) this.soundService.playAudio('winner');
      else this.soundService.playAudio('Loose');
      
      // document.querySelector('#Canvas')!.classList.add('hidden');
      // document.querySelector('.toppanel')!.classList.add('hidden');
      // document.querySelector('#upperPlayer')!.classList.add('hidden');
      // document.querySelector('#lowerPlayer')!.classList.add('hidden');
      // document.querySelector('.properties')!.classList.add('hidden');
      //document.querySelector('#endGameDialogue')!.classList.remove('hidden');
      //document.querySelector("#toppanel1")!.classList.remove("hidden");
      // message.winner.forEach((element: any, index: any) => {
      //   let e = document.createElement('button');
      //   e.innerText = index + 1 + '.  ' + element;
      //   document.querySelector('#endGameDialogue div')!.appendChild(e);
      // });
    });

    room.onMessage('killGotti', (message) => {
      this.killGotti(message);
    });
    room.onMessage('playerLeft', (message) => {
      
        for(var i = 4; i>=1; i--){
          console.log('inside playerLeft = ', message.playerColor + String(i));
          document.getElementById(message.playerColor + String(i))!.style.display = 'none';
        }
        if(this.myColor == 'yellow'){
          //console.log("my player color blue");
          if (message.playerColor === 'yellow') {
            console.log('here in yellow');
            var parElement = document.getElementById('play4')!;
            parElement.textContent = "";
            var name1: string = "Player Left...";
            var textToAdd = document.createTextNode(name1);
            parElement.appendChild(textToAdd);
            document.getElementById('player4')!.style.border = '3px solid #feff02';
            var avatar = document.getElementById('player4')! as HTMLImageElement;
            avatar.src =
              '../../assets/img/profile/Avatar' + '1' + '.png';
            console.log("myUsername -> ", global.myId, " ", message.id);
          } else if (message.playerColor === 'red') {
            console.log('here in red');
            var parElement = document.getElementById('play1')!;
            parElement.textContent = "";
            var name1: string = "Player Left...";
            var textToAdd = document.createTextNode(name1);
            parElement.appendChild(textToAdd);
            document.getElementById('player1')!.style.border = '3px solid #feff02';
            var avatar = document.getElementById('player1')! as HTMLImageElement;
            avatar.src =
            '../../assets/img/profile/Avatar' + '1' + '.png';
          } else if (message.playerColor === 'green') {
            console.log('here in green');
            var parElement = document.getElementById('play2')!;
            parElement.textContent = "";
            var name1: string = "Player Left ...";
            var textToAdd = document.createTextNode(name1);
            parElement.appendChild(textToAdd);
            document.getElementById('player2')!.style.border = '3px solid #feff02';
            var avatar = document.getElementById('player2')! as HTMLImageElement;
            avatar.src =
              '../../assets/img/profile/Avatar' + message.avatar + '.png';
          } else if (message.playerColor === 'blue') {
            console.log('here in blue');
            var parElement = document.getElementById('play3')!;
            parElement.textContent = "";
            var name1: string = "Player Left...";
            var textToAdd = document.createTextNode(name1);
            parElement.appendChild(textToAdd);
               BlueDoneOrNot = true;
    
            document.getElementById('player3')!.style.border = '3px solid #feff02';
            var avatar = document.getElementById('player3')! as HTMLImageElement;
            avatar.src =
            '../../assets/img/profile/Avatar' + '1' + '.png';
            
          }
        }
        else if(this.myColor == 'green'){
          console.log("my player color yellow");
           if (message.playerColor === 'yellow') {
            var parElement = document.getElementById('play3')!;
            parElement.textContent = "";
            var name1: string = "Player Left...";
          var textToAdd = document.createTextNode(name1);
          parElement.appendChild(textToAdd);
          document.getElementById('player3')!.style.border = '3px solid #feff02';
          var avatar = document.getElementById('player3')! as HTMLImageElement;
          avatar.src =
            '../../assets/img/profile/Avatar' + '1' + '.png';
             console.log('here in yellow');
           } 
           else if (message.playerColor === 'red') {
            var parElement = document.getElementById('play2')!;
            parElement.textContent = "";
            var name1: string = "Player Left...";
            var textToAdd = document.createTextNode(name1);
            parElement.appendChild(textToAdd);
            
    
            document.getElementById('player2')!.style.border = '3px solid #feff02';
            var avatar = document.getElementById('player2')! as HTMLImageElement;
            avatar.src =
              '../../assets/img/profile/Avatar' + '1' + '.png';
            console.log("myUsername -> ", global.myId, " ", message.id);
            console.log('here in red');
            
            
            
          } else if (message.playerColor === 'green') {
            var parElement = document.getElementById('play4')!;
            parElement.textContent = "";
            var name1: string = "Player Left...";
            var textToAdd = document.createTextNode(name1);
            parElement.appendChild(textToAdd);
            document.getElementById('player4')!.style.border = '3px solid #feff02';
            var avatar = document.getElementById('player4')! as HTMLImageElement;
            avatar.src =
              '../../assets/img/profile/Avatar' + '1' + '.png';
            console.log("myUsername -> ", global.myId, " ", message.id);
            console.log('here in green');
          } else if (message.playerColor === 'blue') {
            var parElement = document.getElementById('play1')!;
            parElement.textContent = "";
            var name1: string = "Player Left...";
            var textToAdd = document.createTextNode(name1);
            parElement.appendChild(textToAdd);
    
            
            document.getElementById('player1')!.style.border = '3px solid #feff02';
            var avatar = document.getElementById('player1')! as HTMLImageElement;
            avatar.src =
              '../../assets/img/profile/Avatar' + '1' + '.png';
            console.log("myUsername -> ", global.myId, " ", message.id);
            console.log('here in blue');
          }
        }
        else if(this.myColor == 'blue'){
          console.log("my player color red");
          if (message.playerColor === 'yellow') {
            var parElement = document.getElementById('play2')!;
            parElement.textContent = "";
            var name1: string = "Player Left...";
            var textToAdd = document.createTextNode(name1);
            parElement.appendChild(textToAdd);
            document.getElementById('player2')!.style.border = '3px solid #feff02';
            var avatar = document.getElementById('player2')! as HTMLImageElement;
            avatar.src =
              '../../assets/img/profile/Avatar' + '1' + '.png';
            console.log("myUsername -> ", global.myId, " ", message.id);
            console.log('here in yellow');
          } 
          else if (message.playerColor === 'red') {
            var parElement = document.getElementById('play3')!;
            parElement.textContent = "";
            var name1: string = "Player Left...";
            var textToAdd = document.createTextNode(name1);
            parElement.appendChild(textToAdd);
          
    
            document.getElementById('player3')!.style.border = '3px solid #feff02';
            var avatar = document.getElementById('player3')! as HTMLImageElement;
            avatar.src =
              '../../assets/img/profile/Avatar' + '1' + '.png';
             console.log('here in red');
            
            
            
           } 
          else if (message.playerColor === 'green') {
            var parElement = document.getElementById('play1')!;
            parElement.textContent = "";
            var name1: string = "Player Left...";
            var textToAdd = document.createTextNode(name1);
            parElement.appendChild(textToAdd);
    
            
            document.getElementById('player1')!.style.border = '3px solid #feff02';
            var avatar = document.getElementById('player1')! as HTMLImageElement;
            avatar.src =
              '../../assets/img/profile/Avatar' + '1' + '.png';
            console.log("myUsername -> ", global.myId, " ", message.id);
            console.log('here in green');
            
            
            
          } else if (message.playerColor === 'blue') {
            console.log('here in blue');
            var parElement = document.getElementById('play4')!;
            parElement.textContent = "";
            var name1: string = "Player Left...";
            var textToAdd = document.createTextNode(name1);
            parElement.appendChild(textToAdd);
            document.getElementById('player4')!.style.border = '3px solid #feff02';
            var avatar = document.getElementById('player4')! as HTMLImageElement;
            avatar.src =
              '../../assets/img/profile/Avatar' + '1' + '.png';
            console.log("myUsername -> ", global.myId, " ", message.id);
            
          }
        } 
        else if(this.myColor == 'red'){
          console.log("my player color green");
          if (message.playerColor == 'yellow') {
            var parElement = document.getElementById('play1')!;
            parElement.textContent = "";
            var name1: string = "Player Left...";
            var textToAdd = document.createTextNode(name1);
            parElement.appendChild(textToAdd);
    
            
            document.getElementById('player1')!.style.border = '3px solid #feff02';
            var avatar = document.getElementById('player1')! as HTMLImageElement;
            avatar.src =
              '../../assets/img/profile/Avatar' + '1' + '.png';
            console.log("myUsername -> ", global.myId, " ", message.id);
            console.log('here in yellow');
            
            
           
          } else if (message.playerColor == 'red') {
            console.log('here in red');
            var parElement = document.getElementById('play4')!;
            parElement.textContent = "";
            var name1: string = "Player Left...";
            var textToAdd = document.createTextNode(name1);
            parElement.appendChild(textToAdd);
            
            document.getElementById('player4')!.style.border = '3px solid #feff02';
            var avatar = document.getElementById('player4')! as HTMLImageElement;
            avatar.src =
              '../../assets/img/profile/Avatar' + '1' + '.png';
            console.log("myUsername -> ", global.myId, " ", message.id);
            
            
          } 
          else if (message.playerColor == 'green') {
            var parElement = document.getElementById('play3')!;
            parElement.textContent = "";
            var name1: string = "Player Left...";
            var textToAdd = document.createTextNode(name1);
            parElement.appendChild(textToAdd);
    
            document.getElementById('player3')!.style.border = '3px solid #feff02';
            var avatar = document.getElementById('player3')! as HTMLImageElement;
            avatar.src =
              '../../assets/img/profile/Avatar' + '1' + '.png';
          
            console.log('here in green');
            
            
            
          } 
          else if (message.playerColor === 'blue') {
            console.log('here in blue');
            var parElement = document.getElementById('play2')!;
            parElement.textContent = "";
            var name1: string = "Player Left...";
            var textToAdd = document.createTextNode(name1);
            parElement.appendChild(textToAdd);
            
    
            document.getElementById('player2')!.style.border = '3px solid #feff02';
            var avatar = document.getElementById('player2')! as HTMLImageElement;
            avatar.src =
              '../../assets/img/profile/Avatar' + '1' + '.png';
            console.log("myUsername -> ", global.myId, " ", message.id);
            
          }
        }
      //alert('One of Players has Left the game!');
      
      
    });
    room.onMessage('allPlayerLeft', (message) => {
      // console.log("Game has ended. rank 1 username => ", message.rank1);
      // console.log("Game has ended. rank 1 Avvatar => ", message.rank1Avatar);
      // console.log("Game has ended. rank 2 => ", message.rank2);
      // console.log("Game has ended. rank 3 => ", message.rank3);
      this.LudoWinnerPopUp.isVisible = true;
      this.LudoWinnerPopUp.winnerName = this.global1.userName;
      //this.LudoWinnerPopUp.image = '../../assets/img1/Winner_Screen/Avatar'+ this.global1.avatar + '.png';
      console.log("winnerPopupAvatar-> ", this.LudoWinnerPopUp.winnerAvatar,this.global1.avatar);
      //var winnerAvatar = document.getElementById('winnerPopupAvatar')! as HTMLImageElement;
      var avtarPic = setTimeout(()=> {
        clearTimeout(avtarPic);
        this.LudoWinnerPopUp.winnerAvatar = document.getElementById('winnerPopupAvatar')! as HTMLImageElement;
        this.LudoWinnerPopUp.winnerAvatar.src = '../../assets/img/profile/Avatar'+ this.global1.avatar + '.png';
      },100);
      
      room.leave();
      this.soundService.playAudio('winner');
    //   room.leave();
    //   this.messagePopUp.isVisible= true;
    //   this.messagePopUp.popupMessage = this.langModel.componentLang.popups.gameOver[this.langModel.lang];
    //  this.messagePopUp.closetxt = this.langModel.componentLang.popups.close[this.langModel.lang];
    });
    room.onMessage('waitingForRejoin', (message) => {
      if(this.myColor == 'yellow'){
        //console.log("my player color blue");
        if (message.playerColor === 'yellow') {
          console.log('here in yellow');
          var parElement = document.getElementById('play4')!;
          parElement.textContent = "";
          var name1: string = "Player Left...";
          var textToAdd = document.createTextNode(name1);
          parElement.appendChild(textToAdd);
          document.getElementById('player4')!.style.border = '3px solid #feff02';
          var avatar = document.getElementById('player4')! as HTMLImageElement;
          avatar.src =
            '../../assets/img/profile/Avatar' + '1' + '.png';
          console.log("myUsername -> ", global.myId, " ", message.id);
        } else if (message.playerColor === 'red') {
          console.log('here in red');
          var parElement = document.getElementById('play1')!;
          parElement.textContent = "";
          var name1: string = "Player Left...";
          var textToAdd = document.createTextNode(name1);
          parElement.appendChild(textToAdd);
          document.getElementById('player1')!.style.border = '3px solid #feff02';
          var avatar = document.getElementById('player1')! as HTMLImageElement;
          avatar.src =
          '../../assets/img/profile/Avatar' + '1' + '.png';
        } else if (message.playerColor === 'green') {
          console.log('here in green');
          var parElement = document.getElementById('play2')!;
          parElement.textContent = "";
          var name1: string = "Player Left ...";
          var textToAdd = document.createTextNode(name1);
          parElement.appendChild(textToAdd);
          document.getElementById('player2')!.style.border = '3px solid #feff02';
          var avatar = document.getElementById('player2')! as HTMLImageElement;
          avatar.src =
            '../../assets/img/profile/Avatar' + message.avatar + '.png';
        } else if (message.playerColor === 'blue') {
          console.log('here in blue');
          var parElement = document.getElementById('play3')!;
          parElement.textContent = "";
          var name1: string = "Player Left...";
          var textToAdd = document.createTextNode(name1);
          parElement.appendChild(textToAdd);
             BlueDoneOrNot = true;
  
          document.getElementById('player3')!.style.border = '3px solid #feff02';
          var avatar = document.getElementById('player3')! as HTMLImageElement;
          avatar.src =
          '../../assets/img/profile/Avatar' + '1' + '.png';
          
        }
      }
      else if(this.myColor == 'green'){
        console.log("my player color yellow");
         if (message.playerColor === 'yellow') {
          var parElement = document.getElementById('play3')!;
          parElement.textContent = "";
          var name1: string = "Player Left...";
        var textToAdd = document.createTextNode(name1);
        parElement.appendChild(textToAdd);
        document.getElementById('player3')!.style.border = '3px solid #feff02';
        var avatar = document.getElementById('player3')! as HTMLImageElement;
        avatar.src =
          '../../assets/img/profile/Avatar' + '1' + '.png';
           console.log('here in yellow');
         } 
         else if (message.playerColor === 'red') {
          var parElement = document.getElementById('play2')!;
          parElement.textContent = "";
          var name1: string = "Player Left...";
          var textToAdd = document.createTextNode(name1);
          parElement.appendChild(textToAdd);
          
  
          document.getElementById('player2')!.style.border = '3px solid #feff02';
          var avatar = document.getElementById('player2')! as HTMLImageElement;
          avatar.src =
            '../../assets/img/profile/Avatar' + '1' + '.png';
          console.log("myUsername -> ", global.myId, " ", message.id);
          console.log('here in red');
          
          
          
        } else if (message.playerColor === 'green') {
          var parElement = document.getElementById('play4')!;
          parElement.textContent = "";
          var name1: string = "Player Left...";
          var textToAdd = document.createTextNode(name1);
          parElement.appendChild(textToAdd);
          document.getElementById('player4')!.style.border = '3px solid #feff02';
          var avatar = document.getElementById('player4')! as HTMLImageElement;
          avatar.src =
            '../../assets/img/profile/Avatar' + '1' + '.png';
          console.log("myUsername -> ", global.myId, " ", message.id);
          console.log('here in green');
        } else if (message.playerColor === 'blue') {
          var parElement = document.getElementById('play1')!;
          parElement.textContent = "";
          var name1: string = "Player Left...";
          var textToAdd = document.createTextNode(name1);
          parElement.appendChild(textToAdd);
  
          
          document.getElementById('player1')!.style.border = '3px solid #feff02';
          var avatar = document.getElementById('player1')! as HTMLImageElement;
          avatar.src =
            '../../assets/img/profile/Avatar' + '1' + '.png';
          console.log("myUsername -> ", global.myId, " ", message.id);
          console.log('here in blue');
        }
      }
      else if(this.myColor == 'blue'){
        console.log("my player color red");
        if (message.playerColor === 'yellow') {
          var parElement = document.getElementById('play2')!;
          parElement.textContent = "";
          var name1: string = "Player Left...";
          var textToAdd = document.createTextNode(name1);
          parElement.appendChild(textToAdd);
          document.getElementById('player2')!.style.border = '3px solid #feff02';
          var avatar = document.getElementById('player2')! as HTMLImageElement;
          avatar.src =
            '../../assets/img/profile/Avatar' + '1' + '.png';
          console.log("myUsername -> ", global.myId, " ", message.id);
          console.log('here in yellow');
        } 
        else if (message.playerColor === 'red') {
          var parElement = document.getElementById('play3')!;
          parElement.textContent = "";
          var name1: string = "Player Left...";
          var textToAdd = document.createTextNode(name1);
          parElement.appendChild(textToAdd);
        
  
          document.getElementById('player3')!.style.border = '3px solid #feff02';
          var avatar = document.getElementById('player3')! as HTMLImageElement;
          avatar.src =
            '../../assets/img/profile/Avatar' + '1' + '.png';
           console.log('here in red');
          
          
          
         } 
        else if (message.playerColor === 'green') {
          var parElement = document.getElementById('play1')!;
          parElement.textContent = "";
          var name1: string = "Player Left...";
          var textToAdd = document.createTextNode(name1);
          parElement.appendChild(textToAdd);
  
          
          document.getElementById('player1')!.style.border = '3px solid #feff02';
          var avatar = document.getElementById('player1')! as HTMLImageElement;
          avatar.src =
            '../../assets/img/profile/Avatar' + '1' + '.png';
          console.log("myUsername -> ", global.myId, " ", message.id);
          console.log('here in green');
          
          
          
        } else if (message.playerColor === 'blue') {
          console.log('here in blue');
          var parElement = document.getElementById('play4')!;
          parElement.textContent = "";
          var name1: string = "Player Left...";
          var textToAdd = document.createTextNode(name1);
          parElement.appendChild(textToAdd);
          document.getElementById('player4')!.style.border = '3px solid #feff02';
          var avatar = document.getElementById('player4')! as HTMLImageElement;
          avatar.src =
            '../../assets/img/profile/Avatar' + '1' + '.png';
          console.log("myUsername -> ", global.myId, " ", message.id);
          
        }
      } 
      else if(this.myColor == 'red'){
        console.log("my player color green");
        if (message.playerColor == 'yellow') {
          var parElement = document.getElementById('play1')!;
          parElement.textContent = "";
          var name1: string = "Player Left...";
          var textToAdd = document.createTextNode(name1);
          parElement.appendChild(textToAdd);
  
          
          document.getElementById('player1')!.style.border = '3px solid #feff02';
          var avatar = document.getElementById('player1')! as HTMLImageElement;
          avatar.src =
            '../../assets/img/profile/Avatar' + '1' + '.png';
          console.log("myUsername -> ", global.myId, " ", message.id);
          console.log('here in yellow');
          
          
         
        } else if (message.playerColor == 'red') {
          console.log('here in red');
          var parElement = document.getElementById('play4')!;
          parElement.textContent = "";
          var name1: string = "Player Left...";
          var textToAdd = document.createTextNode(name1);
          parElement.appendChild(textToAdd);
          
          document.getElementById('player4')!.style.border = '3px solid #feff02';
          var avatar = document.getElementById('player4')! as HTMLImageElement;
          avatar.src =
            '../../assets/img/profile/Avatar' + '1' + '.png';
          console.log("myUsername -> ", global.myId, " ", message.id);
          
          
        } 
        else if (message.playerColor == 'green') {
          var parElement = document.getElementById('play3')!;
          parElement.textContent = "";
          var name1: string = "Player Left...";
          var textToAdd = document.createTextNode(name1);
          parElement.appendChild(textToAdd);
  
          document.getElementById('player3')!.style.border = '3px solid #feff02';
          var avatar = document.getElementById('player3')! as HTMLImageElement;
          avatar.src =
            '../../assets/img/profile/Avatar' + '1' + '.png';
        
          console.log('here in green');
          
          
          
        } 
        else if (message.playerColor === 'blue') {
          console.log('here in blue');
          var parElement = document.getElementById('play2')!;
          parElement.textContent = "";
          var name1: string = "Player Left...";
          var textToAdd = document.createTextNode(name1);
          parElement.appendChild(textToAdd);
          
  
          document.getElementById('player2')!.style.border = '3px solid #feff02';
          var avatar = document.getElementById('player2')! as HTMLImageElement;
          avatar.src =
            '../../assets/img/profile/Avatar' + '1' + '.png';
          console.log("myUsername -> ", global.myId, " ", message.id);
          
        }
      }
    });
    room.onMessage('sixArray', (message) => {
      console.log("sixArray reciceved gotti movement Amount-> ", message.GottiMovementAmounts);
      console.log("sixArray reciceved allGottis-> ", message.allGottis);
      // [yellow1: 62, 
      //
      this.eventListenerdone = true;
      this.sixArrayRecived = true;
      this.sixArray = message.sixArray;
      this.GottiMovementAmounts = message.GottiMovementAmounts;
      this.allGottis = message.allGottis;
      this.gottisInside = message.gottisInside;

      var divChild: HTMLElement;
      for (const [key1, value1] of Object.entries(message.GottiMovementAmounts)) {
        console.log(key1, value1);
        var postionforPopup: string;
        for (const [key, value] of Object.entries(message.allGottis)) {
          console.log(key, value);
          // for(const [keysobject, valueObject] of Object.keys(message.GottiMovementAmounts[key1])){
          //   console.log(keysobject, valueObject);
          // }
          console.log("value in GottiMovementAmounts -> ",Object.keys(message.GottiMovementAmounts[key1]).length);
          if(Object.keys(message.GottiMovementAmounts[key1]).length > 0){
            if(key1 == key){
              postionforPopup = String(value);
              console.log('position for popup -> ', postionforPopup);
              divChild = document.getElementById(postionforPopup)!.children[1] as HTMLElement;
              divChild.style.display = 'flex';
              console.log("divChild -> ", divChild);
            }
          }
          // if(value1 != null){
            
          // }
          
        }
        if(Object.keys(message.GottiMovementAmounts[key1]).length > 0){
        var current_number_child0: HTMLElement = divChild!.children[0] as HTMLElement;
          if(current_number_child0!=null)
              current_number_child0.style.display = 'none';
        var current_number_child1: HTMLElement = divChild!.children[1] as HTMLElement;
          if(current_number_child1!=null)
              current_number_child1.style.display = 'none';
        var current_number_child2: HTMLElement = divChild!.children[2] as HTMLElement;
          if(current_number_child2!=null)
              current_number_child2.style.display = 'none';
        console.log("value in GottiMovementAmounts -> ",Object.keys(message.GottiMovementAmounts[key1]).length);
        var current_number_child: HTMLElement ;
        var current_number_spanChild: HTMLElement;
        
        for(const [keysobject, valueObject] of Object.keys(message.GottiMovementAmounts[key1])){
            var i = parseInt(keysobject);
            current_number_child = divChild!.children[i] as HTMLElement;
            current_number_spanChild = current_number_child!.children[0] as HTMLElement;

            var current_number_child0: HTMLElement = divChild!.children[i] as HTMLElement;
              if(current_number_child0!=null)
                current_number_child0.style.display = 'block';
            console.log("current_number_child -> ", current_number_child);
            console.log("current_number_spanChild -> ", current_number_spanChild);
            current_number_spanChild.innerHTML = message.GottiMovementAmounts[key1][i];
          }
        }
      }
      
      
        // console.log("sixArray reciceved allGottis1-> ", idPossition);
        // message.GottiMovementAmounts.forEach((idMovementAmount: any) => {
        //   console.log("sixArray reciceved gotti movement Amount1-> ", idMovementAmount);
        //   // if(idMovementAmount == idPossition){
        //   //   document.getElementById()
        //   // }
        // });
      

      // if(message.sixArray.length != 0){

        // for(let index = 0; index < message.sixArray.length; index++){
          message.gottisInside.forEach((element: any) => {
            // console.log('element---', element);
            var d = document.getElementById(element);
            console.log(d);
            d!.classList.add('useMe');
            //d.className += " useMe";
            console.log(d);
          });
          // message.gottisOutside.forEach((element: any) => {
          //   // console.log('element---', element);
          //   var d = document.getElementById(element);
          //   console.log(d);
          //   d!.classList.add('useMe');
          //   //d.className += " useMe";
          //   // console.log(d);
          // });
        // }
      //}
      
    });
    // room.onStateChange((state: any) => {
    //   if (state.MyConnect != true) {
    //    // Do something ...
    //    console.log("inside onStateChange");
    //    //room.leave(false);
    //   }
    //       });

    
  }catch(e){
    console.log(e);
    this.router.navigateByUrl("homePage");
  }
  //end of function
  }
  // afterSixGameplay(movableGottis){
  //   if (this.movableGottis.length == 0) {
  //     if (this.movementAmount == 6) {
  //       // this.movePlayerGottis();
  //     } else {
  //       // this.sixCount = 0;
  //       // this.playerIndicator();
  //     }
  //   } else if (this.movableGottis.length == 1) {
  //     // console.log(
  //     //   "moving if only one piece could be moved ",
  //     //   this.movableGottis[0]
  //     // );

  //     //await this.moveGotti(this.movableGottis[0]);
  //   } else {
  //     let movableGottisPositions = [];
  //     this.movableGottis.forEach((id) => {
  //       movableGottisPositions.push(this.allGottis[this.playerIndex][id]);
  //     });
  //     if (this.gottisOutside[this.playerIndex].length == 0) {
  //       // console.log(
  //       //   "moveGotti when this.gottisOutside[this.playerIndex].length == 0"
  //       // );
  //       // await this.moveGotti(this.movableGottis[0]);
  //     }
  //     //checks if all the available gottis are in the same position
  //     else if (movableGottisPositions.every((val, i, arr) => val === arr[0])) {
  //       console.log(
  //         "moveGotti when movableGottisPositions.every((val, i, arr) => val === arr[0])"
  //       );
  //       // await this.moveGotti(this.movableGottis[0]);
  //     }
  //   }
  // }
  removeShakeAnimation(gottisInside: any, gottisOutside: any) {
    for (let i = 0; i < gottisOutside.length; i++) {
      for (let j = 0; j < gottisOutside[i].length; j++) {
        let gotti = document.querySelector('#' + gottisOutside[i][j]);
        if (gotti) gotti.classList.remove('useMe');
      }
    }
    for (let i = 0; i < gottisInside.length; i++) {
      for (let j = 0; j < gottisInside[i].length; j++) {
        let gotti = document.querySelector('#' + gottisInside[i][j]);
        if (gotti) gotti.classList.remove('useMe');
      }
    }
  }
  killGotti(killed: any) {
    this.soundService.playAudio('Killed');
    let color = killed.substr(0, killed.length - 1);
    let spots = document.getElementsByClassName('home_' + color);
    for (let j = 0; j < spots.length; j++) {
      if (spots[j].children.length == 0) {
        spots[j].appendChild(document.querySelector('#' + killed)!);
        break;
      }
    }
  }

  gottiHome(id: any) {
    let col = id.replace(/[0-9]/g, '');
    let gotti = document.querySelector('#' + id)!;
    console.log("Gotti reached home -> ", gotti.id);
    if(id.includes("yellow")){
      document.querySelector('.finished_blue')!.appendChild(gotti);
      console.log(document.querySelector('.finished_blue'));
      
    }else if(id.includes("red")){
      document.querySelector('.finished_green')!.appendChild(gotti);
      console.log(document.querySelector('.finished_green'));
    }
    else if(id.includes("green")){
      document.querySelector('.finished_yellow')!.appendChild(gotti);
      console.log(document.querySelector('.finished_yellow'));
    }else if(id.includes("blue")){
      document.querySelector('.finished_red')!.appendChild(gotti);
      console.log(document.querySelector('.finished_red'));
    }
    
    console.log(gotti);
    
  }

  boardColour(type: any) {
    switch (type) {
      case 'red':
        if (this.global1.boardType == 'Board_1') {
          return {
            'background':
              'url(../../assets/images/Ludo_Gameplay_Assets/Pin_placeholder.png) 0/100% 100% no-repeat #1293eb',
          };
        } else if (this.global1.boardType == 'Board_2'){
          return {
            'background':
              'url(../../assets/images/Ludo_Gameplay_Assets/Pin_placeholder.png) 0/100% 100% no-repeat #1293eb',
          };
        }
        else {
          return {
            'background':
              'url(../../assets/images/Ludo_Gameplay_Assets/Pin_placeholder.png) 0/100% 100% no-repeat #000000',
          };
        }
        break;
      
      case 'blue':
        if (this.global1.boardType == 'Board_1') {
          return {
            'background':
              'url(../../assets/images/Ludo_Gameplay_Assets/green.png) 0/100% 100% no-repeat #00d806',
          };
        } else if (this.global1.boardType == 'Board_2'){
          return {
            'background':
              'url(../../assets/images/Ludo_Gameplay_Assets/green.png) 0/100% 100% no-repeat #00d806',
          };
        }
        else {
          return {
            'background':
              'url(../../assets/images/Ludo_Gameplay_Assets/green.png) 0/100% 100% no-repeat #000000',
          };
        }
        break;
      case 'green':
        if (this.global1.boardType == 'Board_1') {
          return {
            'background':
              'url(../../assets/images/Ludo_Gameplay_Assets/yellow.png) 0/100% 100% no-repeat #ffb000',
          };
        } else if (this.global1.boardType == 'Board_2'){
          return {
            'background':
              'url(../../assets/images/Ludo_Gameplay_Assets/yellow.png) 0/100% 100% no-repeat #ffb000',
          };
        }
        else {
          return {
            'background':
              'url(../../assets/images/Ludo_Gameplay_Assets/yellow.png) 0/100% 100% no-repeat #000000',
          };
        }
        break;
      case 'yellow':
        if (this.global1.boardType == 'Board_1') {
          return {
            'background':
              'url(../../assets/images/Ludo_Gameplay_Assets/red.png) 0/100% 100% no-repeat #fa1501',
          };
        } else if (this.global1.boardType == 'Board_2'){
          return {
            'background':
              'url(../../assets/images/Ludo_Gameplay_Assets/red.png) 0/100% 100% no-repeat #fa1501',
          };
        }
        else {
          return {
            'background':
              'url(../../assets/images/Ludo_Gameplay_Assets/red.png) 0/100% 100% no-repeat #000000',
          };
        }
        break;
      default:
        return {
          'background':
            'url(../../assets/images/Ludo_Gameplay_Assets/House_image_Red.png)',
        };
    }
  }
  boardCheck(type: any) {
    switch (type) {
      case 'red':
        if (this.global1.boardType == 'Board_1') {
          return {
            'border': '1.5px white solid',
            'background-image':
              'url(../../assets/images/Ludo_Gameplay_Assets/House_Image_Blue.png)',
          };
        } else if (this.global1.boardType == 'Board_2'){
          return {
            'border': '1.5px white solid',
            'background-image':
              'url(../../assets/images/Ludo_Gameplay_Assets/Brand1.png)',
          };
        }
        else {
          return {
            'background-image':
              'url(../../assets/images/Ludo_Gameplay_Assets/BlueHouse.png)',
          };
        }
        break;
      
      case 'blue':
        if (this.global1.boardType == 'Board_1') {
          return {
            'border': '1.5px white solid',
            'background-image':
              'url(../../assets/images/Ludo_Gameplay_Assets/House_Image_Green.png)',
          };
        } else if (this.global1.boardType == 'Board_2'){
          return {
            'border': '1.5px white solid',
            'background-image':
              'url(../../assets/images/Ludo_Gameplay_Assets/Brand3.png)',
          };
        }
        else {
          return {
            'background-image':
              'url(../../assets/images/Ludo_Gameplay_Assets/GreenHouse.png)',
          };
        }
        break;
      case 'green':
        if (this.global1.boardType == 'Board_1') {
          return {
            'border': '1.5px white solid',
            'background-image':
              'url(../../assets/images/Ludo_Gameplay_Assets/House_image_Yellow.png)',
          };
        } else if (this.global1.boardType == 'Board_2'){
          return {
            'border': '1.5px white solid',
            'background-image':
              'url(../../assets/images/Ludo_Gameplay_Assets/Brand2.png)',
          };
        }
        else {
          return {
            'background-image':
              'url(../../assets/images/Ludo_Gameplay_Assets/YellowHouse.png)',
          };
        }
        break;
      case 'yellow':
        if (this.global1.boardType == 'Board_1') {
          return {
            'border': '1.5px white solid',
            'background-image':
              'url(../../assets/images/Ludo_Gameplay_Assets/House_image_Red.png)',
          };
        } else if (this.global1.boardType == 'Board_2'){
          return {
            'border': '1.5px white solid',
            'background-image':
              'url(../../assets/images/Ludo_Gameplay_Assets/Brand4.png)',
          };
        }
        else {
          return {
            'background-image':
              'url(../../assets/images/Ludo_Gameplay_Assets/RedHouse.png)',
          };
        }
        break;
      default:
        return {
          'background-image':
            'url(../../assets/images/Ludo_Gameplay_Assets/House_image_Red.png)',
        };
    }
  }

}
// server = client
// starting gotti
// yellow = red;
// green = yellow;
// red = blue;
// blue = green;
// at home 
// yellow- blue
// red- green
// blue-red
// green- yellow
