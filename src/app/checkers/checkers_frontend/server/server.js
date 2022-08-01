
//global variables for the game
var global = {
  dbId: null,
  avatar: null,
  oppAvatar: null,
  userName: null,
  opponentName: null,
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
  client: null,
  router: null,
  gameRoom: null,
  lobbyRoom: null
}
 // used for popups from checkers.component.ts
// var popup;
//var WinnerPopup ;
var popupFail; 
var PWFroomId; // play with friends room id
var createRoom = false;
var soundService1;
var langModel;
// to leave game room
    leaveGameRoom = function( ) {
      if(global.gameRoom != null) {
      global.gameRoom.send("Left");
       global.gameRoom.leave((code) => {
        console.log(client.id, "left", room.name);
      });
    }else {
      this.leaveLobbyRoom();
      console.log("lobbyleft");
    }
    }
  //to leave lobby room
    leaveLobbyRoom = function( ) {
      if(global.lobbyRoom != null){
        global.lobbyRoom.leave((code) => {
          console.log(client.id, "left", room.name);
        });
      }
    }
//var client = new Colyseus.Client("ws://localhost:3001");
// to join lobby room in colyseus
    joinLobby = async function ($, client, router, popup, userName, gameType, roomCodeonJoin, createOrJoin, myAvatar, userId, soundService, ludoWinnerPopup, langModel1) {
      // router.navigateByUrl('homePage');
      // this.popup = popup;
      try{
        // all the values for sending to the colyseus room while joining
      console.log('client----->', client);
      global.client = client;
      global.userName = userName;
      //global.dbId = this.getRndInteger(1000,100000);
      global.dbId = userId;
      global.lobbyRoom = null;
      global.router = router;
      global.avatar = myAvatar;
      // WinnerPopup = ludoWinnerPopup;
      soundService1 = soundService;
      langModel = langModel1;
      // Random play room join
      if(gameType == "RP"){
        await client.joinOrCreate("lobby", {
          userName: global.userName,
          dbId: global.dbId,
          avatar: myAvatar,
          coin: 1000
        }).then(room => {
    
          // alert("here");
          global.lobbyRoom = room;
          room.onMessage("ROOMCONNECT", (message) => {
            //gamePlay();
            var roomid = message.roomId;
            console.log("room Id ------->",roomid);
            var oppopnentName = message.oppName;
            console.log("oppopnentName ------->",oppopnentName);
            global.opponentName = oppopnentName;
            document.getElementById("oppTwo").textContent = global.opponentName;
            var oppAvatar = parseInt(message.oppAvatar);
            console.log("oppopnentAvatar ------->",oppAvatar);
            global.oppAvatar = oppAvatar;
            document.getElementById("oppTwoAvatar").src = 'assets/img/profile/Avatar' + global.oppAvatar + '.png';
            var oppopnentId = parseInt(message.oppdbId);
            console.log("oppopnentId ------->",oppopnentId);
            var sessionId = message.oppSessionId;
            console.log("sessionId ------->",sessionId);
            const timer = setTimeout(() => {
              clearTimeout(timer);
              room.leave();
              global.lobbyRoom = null;
              console.log("global client---->",global.client); 
              this.joinGameRoom(message, $, global.client, popup, ludoWinnerPopup);
            },1000);
            
            
            //this.display(gameScreen, true);
            //GamePlay.joinGameRoom(message);
          });
    
    
         }).catch((err)=> console.log("---"+JSON.stringify(err) + JSON.stringify(err, ["message", "arguments", "type", "name"])));
      }else if(gameType == "PWF"){
        //  play with friends ' create room
        console.log("Inside playwith friends");
        if(createOrJoin == "create"){
          createRoom = true;
          await client.create("playWithFriends", {
            userName: global.userName,
            dbId: global.dbId,
            avatar:myAvatar,
            coin: 1000,
            roomCode: roomCodeonJoin
          }).then(room => {
            global.lobbyRoom = room;
            global.lobbyRoom.onMessage("roomId",(message) => {
              PWFroomId = JSON.stringify(message.roomCode);
              document.getElementById('roomCode').textContent = PWFroomId;
              console.log("Room Id -> ", PWFroomId);
            });
            
            
            global.lobbyRoom.onMessage("ROOMCONNECT", (message) => {
              //gamePlay();
              var roomid = message.roomId;
              console.log("room Id ------->",roomid);
              var oppopnentName = message.oppName;
              console.log("oppopnentName ------->",oppopnentName);
              global.opponentName = oppopnentName;
              var oppAvatar = parseInt(message.oppAvatar);
            console.log("oppopnentAvatar ------->",oppAvatar);
            global.oppAvatar = oppAvatar;
              var oppopnentId = parseInt(message.oppdbId);
              console.log("oppopnentId ------->",oppopnentId);
              var sessionId = message.oppSessionId;
              console.log("sessionId ------->",sessionId);
              
              console.log("global client---->",global.client);
              document.getElementById("gameScreen").style.display = 'none';
              document.getElementById("searchingPlayers").style.display = 'block';
              document.getElementById("PWFcreate").style.display = 'none';
              document.getElementById("oppTwo").textContent = global.opponentName;
              document.getElementById("oppTwoAvatar").src = 'assets/img/profile/Avatar' + global.oppAvatar + '.png';
              
              const timer = setTimeout(() => {
                clearTimeout(timer);
                room.leave(true);
                global.lobbyRoom = null;
                this.joinGameRoom(message, $, global.client, popup, ludoWinnerPopup);
              },1000);
              //this.display(gameScreen, true);
              //GamePlay.joinGameRoom(message);
            })
          })
        }else{
          try {
            // play with friends ' create room
            const room = await client.joinById(roomCodeonJoin, { 
              userName: global.userName,
              dbId: global.dbId,
              avatar: myAvatar,
              coin: 1000,
              roomCode: roomCodeonJoin});
              room.onMessage("roomId",(message) => {
                PWFroomId = JSON.stringify(message.roomCode);
                // document.getElementById('waiting').textContent = "Room Code - " + PWFroomId;
                console.log("Room Id -> ", PWFroomId);
              });
              room.onMessage("ROOMCONNECT", (message) => {
                //gamePlay();
                var roomid = message.roomId;
                console.log("room Id ------->",roomid);
                var oppopnentName = message.oppName;
                console.log("oppopnentName ------->",oppopnentName);
                global.opponentName = oppopnentName;
                var oppAvatar = parseInt(message.oppAvatar);
              console.log("oppopnentAvatar ------->",oppAvatar);
              global.oppAvatar = oppAvatar;
                var oppopnentId = parseInt(message.oppdbId);
                console.log("oppopnentId ------->",oppopnentId);
                var sessionId = message.oppSessionId;
                console.log("sessionId ------->",sessionId);
                document.getElementById("oppTwo").textContent = global.opponentName;
                document.getElementById("oppTwoAvatar").src = 'assets/img/profile/Avatar' + global.oppAvatar + '.png';
                const timer = setTimeout(() => {
                  clearTimeout(timer);
                  room.leave(true);
                  global.lobbyRoom = null;
                  console.log("global client---->",global.client);
                  this.joinGameRoom(message, $, global.client, popup, ludoWinnerPopup);
                },1000);
                
                
                //this.display(gameScreen, true);
                //GamePlay.joinGameRoom(message);
              })
            console.log("joined successfully", room);
          
          } catch (e) {
            console.error("join Error ", e);
          }
        }
      }
      
    }catch(e){
      console.log(e);
      //alert(e);
      throw e;
    }
  },
  //generate dbid
    getRndInteger = function (min, max) {
      return Math.floor(Math.random() * (max - min)) + min;
    },
    // after lobby consume your seat for the game room which is reserved for you after you join other players in lobby room
    joinGameRoom = async function (message, $ ,client, popup, WinnerPopup){
      global.playercount+=1;
      global.gameRoom = null;
      console.log('client----->', client);
      try {
        const room = await client.consumeSeatReservation(message.seat);
        console.log("joined successfully", room);
        this.setGameRoom(room, $, popup, WinnerPopup);
      
      } catch (e) {
        console.error("join error", e);
      }
        // const room = await client.consumeSeatReservation(message.seat);
        // console.log("joined successfully", room);
        
    //   client.joinOrCreate("game", {
    //     dbid: global.dbid,
    //     userName: global.userName,
    //   }).then(room => {
        
    //   room.onStateChange((state) => {
    //     console.log(room.name, "has new state:", state);
    //   });
   
        
        
        //});
        
        
        
    },
    setGameRoom = function (room, $, popup, WinnerPopup) {

        global.gameRoom = room;
        global.roomSessionId = room.id;
        global.sessionId = room.sessionId;
        //var playerCount = 0;
        room.send("returnMypiece");
        room.state.listen(("board"), (currentValue, previousValue) => {

            
                        console.log( "board", currentValue, previousValue);
        });
      //   room.state.players.onChange = (player, key) => {
      //     global.myPiece = player.myPiece
      //     console.log(player, "have changes at", key);
      // };
        
        room.state.players.onAdd = (player, key) => {
            //console.log(player, "has been added at", key);
            //playerCount++;
            console.log("myUsername-->",global.userName);
            if(player.index == 1){
                global.players[0] = player;
                 //global.myPiece = player.myPiece;
            }else if(player.index == 2){
              global.players[1] = player;
               //global.myPiece = player.myPiece;
            }
            console.log(player.id + "--------------" + player.userName);
            console.log("my Session Id", global.players[0].id);
        };
        
        console.log("here");
        room.onMessage("gameStart", (message) => {
          
          if(message.playercount == 2){
            console.log("game Started");
            gamePlay(global.players[0],global.players[1],global.gameRoom, $, popup, WinnerPopup);
          }
        });
        room.onMessage("PlayerTurn", (message) =>{
          console.log("onMessage Player Turn",parseInt(message.playerTurn));
        });

        
        
        room.onMessage("yourPiece", (message) =>{
          console.log("myPiece",message.myPiece);
          global.myPiece = message.myPiece;
          var image = new Image();
          image.src = "assets/images/Timer_30sec.gif"+"?a="+Math.random();
          if(global.myPiece == 2){
                var playerTimer = document.getElementById('playerTimer1');
                playerTimer.src = image.src;
                document.getElementById('playerTimer1').style.display = 'block';
          }else if(global.myPiece == 1){
                var playerTimer = document.getElementById('playerTimer2');
                playerTimer.src = image.src;
                document.getElementById('playerTimer2').style.display = 'block';
          }
          console.log("myPiece",global.myPiece);
        });
        
    }

    gamePlay = function (myPlayer, otherPlayer, room, $, popup , WinnerPopup) {
      // global.router.navigateByUrl('homePage');
      console.log("gamePlay----->",room);
      //document.getElementById("waiting").style.display = 'none';
      document.getElementById("gameScreen").style.display = 'block';
      document.getElementById("searchingPlayers").style.display = 'none';
      if(createRoom == true){
        //document.getElementById("waiting1").style.display = 'none';
      }
      
      document.getElementById("avatar1").style.display = 'block';
      document.getElementById("avatar2").style.display = 'block';
      // document.getElementById('avatar1').style.border = '3px solid #feff02';
      // document.getElementById('avatar2').style.border = '3px solid #feff02';
      // document.getElementById('avatar1').style.borderRadius = '50px';
      // document.getElementById('avatar2').style.borderRadius = '50px';

      document.getElementById("myUserName").textContent = global.userName;
      
      document.getElementById("otherPlayerUserName").textContent = global.opponentName;
      
      // document.getElementById("myAvatar").src = "./../../../assets/img/profile/Avatar"+global.avatar+".png";
      // document.getElementById("otherPlayerAvatar").src = "./../../../assets/img/profile/Avatar"+global.oppAvatar+".png";
      console.log("global.myPiece inside gamePlay-------------->",global.myPiece);
     
    
      if(global.myPiece == 1){
        // alert("this is your chance");
        popup.isVisible= true;
        //popup.popupMessage = "This is your chance";
        popup.popupMessage = langModel.componentLang.popups.chance[langModel.lang];
        popup.closetxt = langModel.componentLang.popups.close[langModel.lang];
        console.log("popup.isVisible ", popup.isVisible);
        document.getElementById("myAvatar1").src = "assets/img/profile/Avatar"+global.oppAvatar+".png";
        document.getElementById("otherPlayerAvatar").src =  "assets/img/profile/Avatar"+global.avatar+".png";
        // document.getElementsByClassName("player2")[0].id = 'blink';
        // document.getElementsByClassName("player1")[0].id = '';
        //document.getElementById()
    
      }else if(global.myPiece == 2){
        // alert("this is "+ global.opponentName +"'s chance");
        
        popup.isVisible= true;
        popup.popupMessage = global.opponentName +"'s chance";
        popup.closetxt = langModel.componentLang.popups.close[langModel.lang];
        console.log("popup.isVisible ", popup.isVisible);
        document.getElementById("otherPlayerAvatar").src = "assets/img/profile/Avatar"+global.avatar+".png";
        document.getElementById("myAvatar1").src = "assets/img/profile/Avatar"+global.oppAvatar+".png";
        // document.getElementsByClassName("player1")[0].id = 'blink';
        //   document.getElementsByClassName("player2")[0].id = '';
      }
      

      // $x = $('#board').height();
      // $totalHeight = $(window).height() - $x;
      // console.log($totalHeight);
      // if ($totalHeight > 500) {
      //   $('.toppanel').innerHeight(((20 * $totalHeight) / 100));
      //   $('.stats').innerHeight(((40 * $totalHeight) / 100));
      //   $('.stats2').innerHeight(((40 * $totalHeight) / 100));
      // }
      // $('#board').css({"top": ($('.toppanel').height(((20  * $totalHeight)/100)) + $('.stats').height(((40  * $totalHeight)/100))}));
      var gameBoard = [];
      while(room.state.board.length){
        gameBoard.push(room.state.board.splice(0,8));
      }
      console.log("gameBoard--------->",gameBoard);
      
      
      //arrays to store the instances
      var pieces = [];
      var tiles = [];
      var myPiece = global.myPiece; 
      var playerTurn = 0;
      //distance formula
      var dist = function (x1, y1, x2, y2) {
        return Math.sqrt(Math.pow((x1 - x2), 2) + Math.pow((y1 - y2), 2));
      }
      //Piece object - there are 24 instances of them in a checkers game
      function Piece(element, position) {
        // when jump exist, regular move is not allowed
        // since there is no jump at round 1, all pieces are allowed to move initially
        this.allowedtomove = true;
        //linked DOM element
        this.element = element;
        //positions on gameBoard array in format row, column
        this.position = position;
        //which player's piece i it
        this.player = '';
        //figure out player by piece id
        if (this.element.attr("id") < 12)
          this.player = 1;
        else
          this.player = 2;
        //makes object a king
        this.king = false;
        this.makeKing = function () {
          this.element.css("backgroundImage", "url('assets/king" + this.player + ".png')");
          this.king = true;
        }
        //moves the piece
        this.move = function (tile) {
          soundService1.playAudio('piece_move');
          this.element.removeClass('selected');
          if (!Board.isValidPlacetoMove(tile.position[0], tile.position[1])) return false;
          //make sure piece doesn't go backwards if it's not a king
          console.log("tileposition---------->",tile.position[0], " ", tile.position[1]);
          if (this.player == 1 && this.king == false) {
            if (tile.position[0] < this.position[0]) return false;
          } else if (this.player == 2 && this.king == false) {
            if (tile.position[0] > this.position[0]) return false;
          }
          //remove the mark from Board.board and put it in the new spot
          console.log("position---------->",this.position[0], " ", this.position[1]);
          Board.board[this.position[0]][this.position[1]] = 0;
          Board.board[tile.position[0]][tile.position[1]] = this.player;
          room.send("boardUpdate",{position: this.position, tilePosition: tile.position, player: this.player,element: this.element});
          //console.log("position---------->",this.position);
          //console.log("tileposition---------->",tile.position);
          console.log("playerposition---------->",this.player);
          //console.log("element---------->",this.element);
          this.position = [tile.position[0], tile.position[1]];
          
          
          //change the css using board's dictionary
          this.element.css('top', Board.dictionary[this.position[0]]);
          this.element.css('left', Board.dictionary[this.position[1]]);
          //if piece reaches the end of the row on opposite side crown it a king (can move all directions)
          if (!this.king && (this.position[0] == 0 || this.position[0] == 7))
            this.makeKing();
          
    
          return true;
        };
        
    
        //tests if piece can jump anywhere
        this.canJumpAny = function () {
          return (this.canOpponentJump([this.position[0] + 2, this.position[1] + 2], false) ||
            this.canOpponentJump([this.position[0] + 2, this.position[1] - 2], false) ||
            this.canOpponentJump([this.position[0] - 2, this.position[1] + 2], false) ||
            this.canOpponentJump([this.position[0] - 2, this.position[1] - 2], false))
        };
    
        //tests if an opponent jump can be made to a specific place
        this.canOpponentJump = function (newPosition, bool) {
          //find what the displacement is
          //console.log("playerTurn -> ", Board.playerTurn)
          var dx = newPosition[1] - this.position[1];
          //console.log("displacementx -> ", dx, "newPosition-> ", newPosition[1], "position-> ", this.position[1])
          var dy = newPosition[0] - this.position[0];
          //console.log("displacementy -> ", dx, "newPosition-> ", newPosition[0], "position-> ", this.position[0])
          //make sure object doesn't go backwards if not a king
          if (this.player == 1 && this.king == false) {
            if (newPosition[0] < this.position[0]) return false;
          } else if (this.player == 2 && this.king == false) {
            if (newPosition[0] > this.position[0]) return false;
          }
          //must be in bounds
          if (newPosition[0] > 7 || newPosition[1] > 7 || newPosition[0] < 0 || newPosition[1] < 0) return false;
          if (this.position[0] > 7 || this.position[1] > 7 || this.position[0] < 0 || this.position[1] < 0) return false;
          if(this.king == true && bool == true){
            //check if row increase or decrease
            if(this.position[0] > newPosition[0]){
              //row decrease
              //check if column increase or decrease
              //console.log("row decrease");
                if(this.position[1] > newPosition[1]){
                  //column decrease // left upper
                  //console.log("row decrease column decrease");
                  for(var i = this.position[0] - 1, j = this.position[1] - 1; i>=newPosition[0]; i--, j--){
                    var tempRow = i ;
                    var tempColumn = j ;
                    //console.log("Row: ", tempRow, "Column: ", tempColumn);
                    if(Board.board[tempRow][tempColumn] == Board.playerTurn){
                      //if found your own piece 
                      //console.log("Found your own piece");
                      return false;
                    }else if(Board.board[tempRow][tempColumn] != Board.playerTurn && Board.board[tempRow][tempColumn] != 0){
                      //if found your opp. piece check if it's in bounds
                      //console.log("found your opp. piece check if it's in bounds");
                      if(tempRow == 0 || tempColumn == 0 ){
                        return false;
                      }
                      else if(Board.board[tempRow-1][tempColumn-1] == 0 ){
                        ////console.log("Found your opp piece check if next piece is empty"); 
                        //console.log("Row & column to match -> ", tempRow - 1," ", tempColumn - 1);
                        for (let pieceIndex in pieces) {
                          //console.log("Row & column matching -> ", pieces[pieceIndex].position[0]," ", pieces[pieceIndex].position[1] );
                          if (pieces[pieceIndex].position[0] == tempRow && pieces[pieceIndex].position[1] == tempColumn) {
                            
                              //return the piece sitting there
                              //console.log("returning piece to be cut");
                              return pieces[pieceIndex];
                            
                          }else{
                            //console.log("no piece found to cut");
                          }
                        }
                      }else{
                        //console.log("Found your opp piece but next piece is not empty"); 
                        return false;
                      }
                    }else {
                      //console.log("No piece found on Path"); 
                      if(i == newPosition[0]){
                        return 'moveWithoutRestriction';
                      }
                       
                    }
                  }
                  // var tileToChecky = newPosition[0] + 1 //row 
                  // var tileToCheckx = newPosition[1] + 1 // column
                 
                }else if(this.position[1] < newPosition[1]){
                  //column increase // right upper
                  //console.log("row decrease column increase");
                  for(var i = this.position[0] - 1, j = this.position[1] + 1; i>=newPosition[0]; i--, j++){
                    var tempRow = i ;
                    var tempColumn = j;
                    //console.log("Row: ", tempRow, "Column: ", tempColumn);
                    if(Board.board[tempRow][tempColumn] == Board.playerTurn){
                      //if found your own piece 
                      //console.log("Found your own piece");
                      return false;
                    }else if(Board.board[tempRow][tempColumn] != Board.playerTurn && Board.board[tempRow][tempColumn] != 0){
                      //if found your opp. piece check if it's in bounds
                      //console.log("found your opp. piece check if it's in bounds");
                      if(tempRow == 0 || tempColumn == 0 ){
                        return false;
                      }
                      else if(Board.board[tempRow-1][tempColumn+1] == 0 ){
                        ////console.log("Found your opp piece check if next piece is empty"); 
                        //console.log("Row & column to match -> ", tempRow - 1," ", tempColumn +1);
                        for (let pieceIndex in pieces) {
                          //console.log("Row & column matching -> ", pieces[pieceIndex].position[0]," ", pieces[pieceIndex].position[1] );
                          if (pieces[pieceIndex].position[0] == tempRow && pieces[pieceIndex].position[1] == tempColumn) {
                              //console.log("returning piece to be cut");
                              if (this.player != pieces[pieceIndex].player) {
                              //return the piece sitting there
                              return pieces[pieceIndex];
                              }
                          }else{
                            //console.log("no piece found to cut");
                          }
                        }
                      }else{
                        //console.log("Found your opp piece but next piece is not empty"); 
                        return false
                      }
                    }else {
                      //console.log("No piece found on Path");
                      if(i == newPosition[0]){
                        return 'moveWithoutRestriction';
                      }
                        
                    }
                  }
                  // var tileToChecky = newPosition[0] + 1 //row 
                  // var tileToCheckx = newPosition[1] - 1 // column
                }
            }else if(this.position[0] < newPosition[0]){
              //row increase
              //check if column increase or decrease
              //console.log("row increase");
              if(this.position[1] > newPosition[1]){
                //column decrease // left lower
                //console.log("row increase column decrease");
                for(var i = this.position[0]+1, j = this.position[1]-1; i<=newPosition[0]; i++, j--){
                  var tempRow = i ;
                  var tempColumn = j;
                  //console.log("Row: ", tempRow, "Column: ", tempColumn);
                  if(Board.board[tempRow][tempColumn] == Board.playerTurn){
                    //if found your own piece 
                    //console.log("Found your own piece");
                    return false;
                  }else if(Board.board[tempRow][tempColumn] != Board.playerTurn && Board.board[tempRow][tempColumn] != 0){
                    //if found your opp. piece check if it's in bounds
                    //console.log("found your opp. piece check if it's in bounds");
                    if(tempRow == 0 || tempColumn == 0 ){
                      return false;
                    }
                    else if(Board.board[tempRow+1][tempColumn-1] == 0 ){
                      ////console.log("Found your opp piece check if next piece is empty"); 
                      //console.log("Row & column to match -> ", tempRow + 1," ", tempColumn  - 1);
                      for (let pieceIndex in pieces) {
                        //console.log("Row & column matching -> ", pieces[pieceIndex].position[0]," ", pieces[pieceIndex].position[1] );
                        if (pieces[pieceIndex].position[0] == tempRow && pieces[pieceIndex].position[1] == tempColumn) {
                            //console.log("returning piece to be cut");
                            if (this.player != pieces[pieceIndex].player) {
                            //return the piece sitting there
                            return pieces[pieceIndex];
                            }
                        }else{
                          //console.log("no piece found to cut");
                        }
                      }
                    }else{
                      //console.log("Found your opp piece but next piece is not empty"); 
                      return false;
                    }
                  }else {
                    //console.log("No piece found on Path");
                    if(i == newPosition[0]){
                      return 'moveWithoutRestriction';
                    }
                      
                  }
                }
                // var tileToChecky = newPosition[0] + 1 //row 
                // var tileToCheckx = newPosition[1] - 1 // column
               
              }else if(this.position[1] < newPosition[1]){
                //column increase //right lower
                //console.log("row increase column increase");
                for(var i = this.position[0] + 1, j = this.position[1] + 1; i<=newPosition[0]; i++, j++){
                  var tempRow = i ;
                  var tempColumn = j;
                  //console.log("Row: ", tempRow, "Column: ", tempColumn);
                  if(Board.board[tempRow][tempColumn] == Board.playerTurn){
                    //if found your own piece 
                    //console.log("Found your own piece");
                    return false;
                  }else if(Board.board[tempRow][tempColumn] != Board.playerTurn && Board.board[tempRow][tempColumn] != 0){
                    //if found your opp. piece check if it's in bounds
                    //console.log("found your opp. piece check if it's in bounds");
                    if(tempRow == 0 || tempColumn == 0 ){
                      return false;
                    }
                    else if(Board.board[tempRow+1][tempColumn+1] == 0 ){
                      // //console.log("Found your opp piece check if next piece is empty"); 
                      //console.log("Row & column to match -> ", tempRow + 1," ", tempColumn +1);
                      for (let pieceIndex in pieces) {
                        //console.log("Row & column matching -> ", pieces[pieceIndex].position[0]," ", pieces[pieceIndex].position[1] );

                        if (pieces[pieceIndex].position[0] == tempRow && pieces[pieceIndex].position[1] == tempColumn) {
                          if (this.player != pieces[pieceIndex].player) {
                            //console.log("returning piece to be cut");
                            //return the piece sitting there
                            return pieces[pieceIndex];
                          }
                        }else{
                          //console.log("no piece found to cut");
                        }
                      }
                    }else{
                      //console.log("Found your opp piece but next piece is not empty"); 
                      return false;
                    }
                  }else {
                    //console.log("No piece found on Path");
                    if(i == newPosition[0])
                      return 'moveWithoutRestriction';
                  }
                }
                // var tileToChecky = newPosition[0] - 1 //row 
                // var tileToCheckx = newPosition[1] - 1 // column
              }
            }
          }
          else{
             //middle tile where the piece to be conquered sits
          var tileToCheckx = this.position[1] + dx / 2;
          //console.log("tileToCheckx -> ", tileToCheckx)
          var tileToChecky = this.position[0] + dy / 2;
          //console.log("tileToChecky -> ", tileToChecky)
          
         
          if (tileToCheckx > 7 || tileToChecky > 7 || tileToCheckx < 0 || tileToChecky < 0) return false;
          //if there is a piece there and there is no piece in the space after that
          if (!Board.isValidPlacetoMove(tileToChecky, tileToCheckx) && Board.isValidPlacetoMove(newPosition[0], newPosition[1])) {
            //find which object instance is sitting there
            for (let pieceIndex in pieces) {
              if (pieces[pieceIndex].position[0] == tileToChecky && pieces[pieceIndex].position[1] == tileToCheckx) {
                if (this.player != pieces[pieceIndex].player) {
                  //return the piece sitting there
                  //console.log("piece to remove - ", pieces[pieceIndex]);
                  
                  return pieces[pieceIndex];
                }
              }
            }
          }
          return false;
        }
          
        };
    
        this.opponentJump = function (tile) {
          var pieceToRemove = this.canOpponentJump(tile.position, true);
          //if there is a piece to be removed, remove it
          console.log("pieceToRemove: " + pieceToRemove);
          if (pieceToRemove == 'moveWithoutRestriction') {
            return 'moveWithoutRestriction';
          }else if(pieceToRemove){
            pieceToRemove.remove();
            return 'removePieceAndMove';
          }
          return false;
        };
    
        
    
    
        this.remove = function () {
          //remove it and delete it from the gameboard
          this.element.css("display", "none");
          if (this.player == 1) {
            $('#player2').append("<div class='capturedPiece'></div>");
            Board.score.player2 += 1;
          }
          if (this.player == 2) {
            $('#player1').append("<div class='capturedPiece'></div>");
            Board.score.player1 += 1;
          }
          Board.board[this.position[0]][this.position[1]] = 0;
          //reset position so it doesn't get picked up by the for loop in the canOpponentJump method
          this.position = [];
          var playerWon = Board.checkifAnybodyWon();
          if (playerWon) {
            if (playerWon == 1) {
              document.getElementsByClassName("player1name")[0].textContent = 'Winner';
              document.getElementsByClassName("player2name")[0].textContent = 'Loser';
              document.getElementsByClassName("player2")[0].id = 'none';
              document.getElementsByClassName("player1")[0].id = 'none';
            }
            else {
              document.getElementsByClassName("player2name")[0].textContent = 'Winner';
              document.getElementsByClassName("player1name")[0].textContent = 'Loser';
              document.getElementsByClassName("player2")[0].id = 'none';
              document.getElementsByClassName("player1")[0].id = 'none';
            }
          }
        }
        
      }
    
      function Tile(element, position) {
        //linked DOM element
        this.element = element;
        //position in gameboard
        this.position = position;
        //if tile is in range from the piece
        this.inRange = function (piece) {
          for (let k of pieces){
            if (k.position[0] == this.position[0] && k.position[1] == this.position[1]) return 'wrong';
            //console.log("k of pieces - > ", k);
          }
            
            if (!piece.king && piece.player == 1 && this.position[0] < piece.position[0]) return 'wrong';
            if (!piece.king && piece.player == 2 && this.position[0] > piece.position[0]) return 'wrong';

            console.log("positions of tile and piece inRange1 - > ", this.position[0], piece.position[0]);
            //if king move different
            if(piece.king){
              if (dist(this.position[0], this.position[1], piece.position[0], piece.position[1]) ==  Math.sqrt(2)) {
                //jump move
                console.log("positions of tile and piece when king inRange2 - > ", this.position[1], " ", piece.position[1]," ",Math.sqrt(2));
                return 'regular';
              } else{
                console.log("positions of tile and piece when king inRange3 - > ", this.position[1], " ", piece.position[1]," ",2 * Math.sqrt(2));
                return 'jump';
              }
            }
            else if (dist(this.position[0], this.position[1], piece.position[0], piece.position[1]) == Math.sqrt(2)) {
            //regular move
            console.log("positions of tile and piece inRange2 - > ", this.position[1], " ", piece.position[1]," ",Math.sqrt(2));
            return 'regular';
          } else if (dist(this.position[0], this.position[1], piece.position[0], piece.position[1]) == 2 * Math.sqrt(2)) {
            //jump move
            console.log("positions of tile and piece inRange3 - > ", this.position[1], " ", piece.position[1]," ",2 * Math.sqrt(2));
            return 'jump';
          }
        };
      }
    
      //Board object - controls logistics of game
      var Board = {
        board: gameBoard,
        score: {
          player1: 0,
          player2: 0
        },
        playerTurn: 1,
        jumpexist: false,
        continuousjump: false,
        tilesElement: $('div.tiles'),
        //dictionary to convert position in Board.board to the viewport units
        dictionary: ["0vmin", "12vmin", "24vmin", "36vmin", "48vmin", "60vmin", "72vmin", "84vmin", "96vmin", "108vmin"],
        //initialize the 8x8 board
        initalize: function () {
          var countPieces = 0;
          var countTiles = 0;
          for (let row in this.board) { //row is the index
            for (let column in this.board[row]) { //column is the index
              //whole set of if statements control where the tiles and pieces should be placed on the board
              if (row % 2 == 1) {
                if (column % 2 == 0) {
                  countTiles = this.tileRender(row, column, countTiles)
                }
              } else {
                if (column % 2 == 1) {
                  countTiles = this.tileRender(row, column, countTiles)
                }
              }
              if (this.board[row][column] == 1) {
                countPieces = this.playerPiecesRender(1, row, column, countPieces)
              } else if (this.board[row][column] == 2) {
                countPieces = this.playerPiecesRender(2, row, column, countPieces)
              }
    
            }
          }
          //rotate the board 180* for the first player
          if(myPiece == 1){
            //document.getElementsById("board").style.transform = 'rotate(20deg)';
            document.getElementById("board").style.transform = 'rotate(180deg)';
          }
        },
        tileRender: function (row, column, countTiles) {
          this.tilesElement.append("<div class='tile' id='tile" + countTiles + "' style='top:" + this.dictionary[row] + ";left:" + this.dictionary[column] + ";'></div>");
          tiles[countTiles] = new Tile($("#tile" + countTiles), [parseInt(row), parseInt(column)]);
          return countTiles + 1
        },
    
        playerPiecesRender: function (playerNumber, row, column, countPieces) {
          $(`.player${playerNumber}pieces`).append("<div class='piece' id='" + countPieces + "' style='top:" + this.dictionary[row] + ";left:" + this.dictionary[column] + ";'></div>");
          pieces[countPieces] = new Piece($("#" + countPieces), [parseInt(row), parseInt(column)]);
          console.log("countPieces======",countPieces);
          return countPieces + 1;
        },
        //check if the location has an object
        isValidPlacetoMove: function (row, column) {
          // console.log(row); console.log(column); console.log(this.board);
          console.log("Row - > " , row, " column ", column);
          if (row < 0 || row > 7 || column < 0 || column > 7) return false;
          if (this.board[row][column] == 0) {
            return true;
          }
          return false;
        },
        //change the active player - also changes div.turn's CSS
        changePlayerTurn: function (timerOrPlayed) {
          var playerTimer2 = document.getElementById('playerTimer2');
      playerTimer2.src = "";
      document.getElementById('playerTimer2').style.display = 'none';
      var playerTimer1 = document.getElementById('playerTimer1');
      playerTimer1.src = "";
      document.getElementById('playerTimer1').style.display = 'none';
          var image = new Image();
          image.src = "assets/images/Timer_30sec.gif"+"?a="+Math.random();
          if (this.playerTurn == 1) {
            this.checkNoWin();
            this.playerTurn = 2;
            this.checkNoWin();
            if(myPiece == 2){
              document.getElementsByClassName("player2")[0].id = '';
              document.getElementsByClassName("player1")[0].id = '';
              var playerTimer = document.getElementById('playerTimer2');
              playerTimer.src = image.src;
              document.getElementById('playerTimer2').style.display = 'block';
            }else if(myPiece == 1){
              document.getElementsByClassName("player1")[0].id = '';
              document.getElementsByClassName("player2")[0].id = '';
              var playerTimer = document.getElementById('playerTimer1');
              playerTimer.src = image.src;
              document.getElementById('playerTimer1').style.display = 'block';
            }
            
          } else {
            this.checkNoWin();
            this.playerTurn = 1;
            this.checkNoWin();
    
            if(myPiece == 1){
              document.getElementsByClassName("player2")[0].id = 'blink';
              document.getElementsByClassName("player1")[0].id = '';
              var playerTimer = document.getElementById('playerTimer2');
              playerTimer.src = image.src;
              document.getElementById('playerTimer2').style.display = 'block';
            }else if(myPiece ==2){
              document.getElementsByClassName("player1")[0].id = 'blink';
              document.getElementsByClassName("player2")[0].id = '';
              var playerTimer = document.getElementById('playerTimer1');
              playerTimer.src = image.src;
              document.getElementById('playerTimer1').style.display = 'block';
            }
           
          }
          this.check_if_jump_exist()
          room.send("playerTurnChange",{playerTurn: this.playerTurn, timerOrPlayed: timerOrPlayed, myPiece: myPiece});
          console.log("playerTurn senttoroom-------->", playerTurn);
          //return;
        },
        checkNoWin: function () {
          var noWin = true;
          for (var i = 0; i < 8; i++) {
            for (var j = (i % 2 == 0) ? 1 : 0; j < 8; j += 2) {
              if (gameBoard[i][j] == this.playerTurn) {
                if (this.playerTurn == 1 && gameBoard[i + 1] != undefined) {
                  if (gameBoard[i + 1][j + 1] != 0 && gameBoard[i + 1][j - 1] != 0) {}
                  else {noWin = false;}
                }
                else  if (this.playerTurn == 2 && gameBoard[i - 1] != undefined) {
                  if (gameBoard[i - 1][j + 1] != 0 && gameBoard[i - 1][j - 1] != 0) {}
                  else {noWin = false;}
                }
                else{
                  noWin = false;
                }
              }
            }
          }
          if (noWin) {
            console.log("playerTurn afterwIn-------",this.playerTurn);
            
            if (this.playerTurn == 2) {
              
              if(myPiece==2){
              document.getElementsByClassName("player1name")[0].textContent = 'Winner';
              document.getElementsByClassName("player2name")[0].textContent = 'Loser';
              document.getElementsByClassName("player2")[0].id = 'none';
              document.getElementsByClassName("player1")[0].id = 'none';
              room.send("Winner",{winner: global.opponentName, userid: global.oppopnentId});
              WinnerPopup.langModel = langModel;
              WinnerPopup.isVisible = true;
              WinnerPopup.winnerName = global.opponentName;
              // popup.isVisible= true;
              // popup.popupMessage = "The winner is " + global.opponentName + " in this game";
              // popupFail = 2;
              soundService1.playAudio('Loose');
              console.log("here01");
              //this.leaveGameRoom();
              }else if(myPiece == 1){
                document.getElementsByClassName("player2name")[0].textContent = 'Winner';
                document.getElementsByClassName("player1name")[0].textContent = 'Loser';
                document.querySelector('div').removeAttribute('id');
                document.getElementsByClassName("player2")[0].id = 'none';
                document.getElementsByClassName("player1")[0].id = 'none';
                // popup.isVisible= true;
                // popup.popupMessage = "The winner is " + global.userName + " in this game";
                // popupFail = 2;
                room.send("Winner",{winner: global.userName, userid: global.dbId});
                console.log("here02");
                WinnerPopup.langModel = langModel;
                WinnerPopup.isVisible = true;
                WinnerPopup.winnerName = global.userName;
                soundService1.playAudio('winner');
                //this.leaveGameRoom();
              }
            }
            else {
              if(myPiece == 2){
              document.getElementsByClassName("player2name")[0].textContent = 'Winner';
              document.getElementsByClassName("player1name")[0].textContent = 'Loser';
              document.querySelector('div').removeAttribute('id');
              document.getElementsByClassName("player2")[0].id = 'none';
              document.getElementsByClassName("player1")[0].id = 'none';
              // popup.isVisible= true;
              // popup.popupMessage = "The winner is " + global.userName + " in this game";
              // popupFail = 2;
              room.send("Winner",{winner: global.userName, userid: global.dbId});
              console.log("here03");
              WinnerPopup.langModel = langModel;
              WinnerPopup.isVisible = true;
              WinnerPopup.winnerName = global.userName;
              soundService1.playAudio('winner');
              //this.leaveGameRoom();
              }else if(myPiece==1){
                document.getElementsByClassName("player1name")[0].textContent = 'Winner';
                document.getElementsByClassName("player2name")[0].textContent = 'Loser';
                document.getElementsByClassName("player2")[0].id = 'none';
                document.getElementsByClassName("player1")[0].id = 'none';
                // popup.isVisible= true;
                // popup.popupMessage = "The winner is " + global.opponentName + " in this game";
                // popupFail = 2;
                room.send("Winner", {winner: global.opponentName, userid: global.oppopnentId});
                WinnerPopup.langModel = langModel;
                WinnerPopup.isVisible = true;
                WinnerPopup.winnerName = global.opponentName;
                console.log("here04");
                soundService1.playAudio('Loose');
                // this.leaveGameRoom();
              }
            }
            for(k of pieces){k.position=[]}
            
            
            //room.leave();
            console.log("roomLeft");
          }
        },
        checkifAnybodyWon: function () {
          if (this.score.player1 == 12) {
            return 1;
          } else if (this.score.player2 == 12) {
            return 2;
          }
          return false;
        },
        //reset the game
        clear: function () {
          location.reload();
        },
        check_if_jump_exist: function () {
          this.jumpexist = false
          this.continuousjump = false;
          for (let k of pieces) {
            k.allowedtomove = false;
            // if jump exist, only set those "jump" pieces "allowed to move"
            if (k.position.length != 0 && k.player == this.playerTurn && k.canJumpAny() && k.king==false) {
              this.jumpexist = true
              k.allowedtomove = true;
            }
            else if (k.position.length != 0 && k.player == this.playerTurn && k.king == true) {
              for(var i = k.position[0] -1, j = k.position[1]-1; i > 0 && j > 0 ; i--, j--){
                    var tempRow = i ;
                    var tempColumn = j ;
                    console.log("Row: ", tempRow, "Column: ", tempColumn);
                    if(this.board[tempRow][tempColumn] == this.playerTurn){
                      //if found your own piece 
                      console.log("Found your own piece");
                      break;
                    }else if(this.board[tempRow][tempColumn] != this.playerTurn && this.board[tempRow][tempColumn] != 0){
                      //if found your opp. piece check if it's in bounds
                      if(this.board[tempRow-1][tempColumn-1] == 0 ){
                        this.jumpexist = true;
                        k.allowedtomove = true;
                        console.log("Found your opp piece and next tile is empty"); 
                        break;
                      }else{
                        console.log("Found your opp piece but next piece is not empty"); 
                        break;
                        
                      }
                    }
              }for(var i = k.position[0] -1, j = k.position[1]+1; i > 0 && j < 7 ; i--, j++){
                var tempRow = i ;
                var tempColumn = j ;
                console.log("Row: ", tempRow, "Column: ", tempColumn);
                if(this.board[tempRow][tempColumn] == this.playerTurn){
                  //if found your own piece 
                  console.log("Found your own piece");
                  break;
                }else if(this.board[tempRow][tempColumn] != this.playerTurn && this.board[tempRow][tempColumn] != 0){
                  //if found your opp. piece check if it's in bounds
                  if(this.board[tempRow-1][tempColumn+1] == 0 ){
                    this.jumpexist = true
                    k.allowedtomove = true;
                    console.log("Found your opp piece and next tile is empty"); 
                    break;
                  }else{
                    console.log("Found your opp piece but next piece is not empty"); 
                    break;
                  }
                }else {
                  console.log("No piece found on Path");  
                }
              }for(var i = k.position[0] + 1, j = k.position[1] - 1; i < 7 && j > 0 ; i++, j--){
                var tempRow = i ;
                var tempColumn = j ;
                console.log("Row: ", tempRow, "Column: ", tempColumn);
                if(this.board[tempRow][tempColumn] == this.playerTurn){
                  //if found your own piece 
                  console.log("Found your own piece");
                  break;
                }else if(this.board[tempRow][tempColumn] != this.playerTurn && this.board[tempRow][tempColumn] != 0){
                  //if found your opp. piece check if it's in bounds
                  if(this.board[tempRow+1][tempColumn-1] == 0 ){
                    this.jumpexist = true
                    k.allowedtomove = true;
                    console.log("Found your opp piece and next tile is empty"); 
                    break;
                  }else{
                    console.log("Found your opp piece but next piece is not empty"); 
                    break;
                  }
                }else {
                  console.log("No piece found on Path");  
                }
              }for(var i = k.position[0] + 1, j = k.position[1] + 1; i < 7 && j < 7 ; i++, j++){
                var tempRow = i ;
                var tempColumn = j ;
                console.log("Row: ", tempRow, "Column: ", tempColumn);
                if(this.board[tempRow][tempColumn] == this.playerTurn){
                  //if found your own piece 
                  console.log("Found your own piece");
                  break;
                }else if(this.board[tempRow][tempColumn] != this.playerTurn && this.board[tempRow][tempColumn] != 0){
                  //if found your opp. piece check if it's in bounds
                  if(this.board[tempRow+1][tempColumn+1] == 0 ){
                    this.jumpexist = true
                    k.allowedtomove = true;
                    console.log("Found your opp piece and next tile is empty"); 
                    break;
                  }else{
                    console.log("Found your opp piece but next piece is not empty"); 
                    break;
                  }
                }else {
                  console.log("No piece found on Path");  
                }
              }
            
            }
          }
          // if jump doesn't exist, all pieces are allowed to move
          if (!this.jumpexist) {
            for (let k of pieces) k.allowedtomove = true;
          }
        },
        // Possibly helpful for communication with back-end.
        str_board: function () {
          ret = ""
          for (let i in this.board) {
            for (let j in this.board[i]) {
              var found = false
              for (let k of pieces) {
                if (k.position[0] == i && k.position[1] == j) {
                  if (k.king) ret += (this.board[i][j] + 2)
                  else ret += this.board[i][j]
                  found = true
                  break
                }
              }
              if (!found) ret += '0'
            }
          }
          return ret
        }
      }
    
      //initialize the board
      Board.initalize();
    
      /***
      Events
      ***/
    
      //select the piece on click if it is the player's turn
      $('.piece').on("click", function () {
        var selected;
        var isPlayersTurn = ($(this).parent().attr("class").split(' ')[0] == "player" + Board.playerTurn + "pieces");
        if (isPlayersTurn) {
          if (!Board.continuousjump && pieces[$(this).attr("id")].allowedtomove) {
            if ($(this).hasClass('selected')) selected = true;
            $('.piece').each(function (index) {
              $('.piece').eq(index).removeClass('selected')
            });
            if (!selected) {
              $(this).addClass('selected');
            }
          } else {
           
            let exist = langModel.componentLang.popups.exist[langModel.lang];
            let continuous = langModel.componentLang.popups.continuous[langModel.lang];
            let message = !Board.continuousjump ? exist : continuous
            popup.isVisible= true;
            popup.popupMessage = message;
            console.log(message);
            popup.closetxt = langModel.componentLang.popups.close[langModel.lang];
          }
        }
      });
    
      //reset game when clear button is pressed
      $('#cleargame').on("click", function () {
        Board.clear();
      });
    
      //move piece when tile is clicked
      $('.tile').on("click", function () {
        //make sure a piece is selected
        if ($('.selected').length != 0) {
          //find the tile object being clicked
          var tileID = $(this).attr("id").replace(/tile/, '');
          var tile = tiles[tileID];
          //find the piece being selected
          var pieceID = $('.selected').attr("id");
          var piece = pieces[pieceID];
          //check if the tile is in range from the object
          room.send("selectedPiece",{selectedPiece: pieceID,tileId: tileID});
          console.log("piece----->",piece);
          var inRange = tile.inRange(piece);
          console.log("inRange----->",inRange);
        if(piece.player == global.myPiece){
          if (inRange != 'wrong') {
            //if the move needed is jump, then move it but also check if another move can be made (double and triple jumps)
            if (inRange == 'jump') {
              // console.log("opponentJump - > ", piece.opponentJump(tile));
              //console.log("opponentJump - > ", piece.opponentJump(tile));
              var opponentKillormove = piece.opponentJump(tile);
              if(opponentKillormove == 'moveWithoutRestriction' && Board.jumpexist){
                popup.isVisible= true;
                popup.popupMessage = langModel.componentLang.popups.oblige[langModel.lang];
                popup.closetxt = langModel.componentLang.popups.close[langModel.lang];
              }
              else if (opponentKillormove ==  "removePieceAndMove") {
                console.log("It can jump");
                piece.move(tile);
                //soundService1.playAudio('Killed')
                if (piece.canJumpAny()) {
                  // Board.changePlayerTurn(false); //change back to original since another turn can be made
                  piece.element.addClass('selected');
                  // exist continuous jump, you are not allowed to de-select this piece or select other pieces
                  Board.continuousjump = true;
                } else {
                  Board.changePlayerTurn(false)
                }
              }else if(opponentKillormove == 'moveWithoutRestriction' && !Board.jumpexist){
                console.log("It can jump but do not check further moves2");
                piece.move(tile);
                Board.changePlayerTurn(false);
              }
              //if it's regular then move it if no jumping is available
            } else if (inRange == 'regular') {
              if(Board.jumpexist){
                popup.isVisible= true;
                popup.popupMessage = langModel.componentLang.popups.oblige[langModel.lang];
                popup.closetxt = langModel.componentLang.popups.close[langModel.lang];
              }
              else if(!Board.jumpexist){
                if (!piece.canJumpAny()) {
                  piece.move(tile);
                  Board.changePlayerTurn(false);
                } else {
                  // alert("You must jump when possible!");
                  popup.isVisible= true;
                  popup.popupMessage = langModel.componentLang.popups.jump[langModel.lang];
                popup.closetxt = langModel.componentLang.popups.close[langModel.lang];
                }
              }
              
            }
          }
        }else{
          // alert("This is not your Piece to move");
          popup.isVisible= true;
          popup.popupMessage = langModel.componentLang.popups.noMove[langModel.lang];
          popup.closetxt = langModel.componentLang.popups.close[langModel.lang];
        }
        }
      });
    
    
    
      //reciving room messages
      room.onMessage("boardUpdated", (message) =>{
        console.log("boardUpdating");
        // var position = message.position;
        // var tileposition = message.tilePosition;
        // var player = message.player;
        var piece = message.selectedPiece;
        var tileID = message.tileId;
        console.log("piece",piece);
        movetile(tileID,piece); 
        //var piece = message.piece;
        //var element = message.element;
        
      });
      room.onMessage("playerTurn", (message)=>{
        console.log("playerTurn---------->",message.playerTurn);
        playerTurn = message.playerTurn;
        
      });
      room.onMessage("winner", (message)=>{
        console.log("winner---------->",message.winner);
        room.leave();
        // var timer  = setTimeout(()=>{
        //   if(!message.winner){
        //     console.log("Winner's empty");
        //   }else{
        //   // alert("The winner is " + message.winner + " in this game");
        //   popup.isVisible= true;
        //   popup.popupMessage = "The winner is " + message.winner + " in this game";
        // }
        //   clearTimeout(timer);
        // },2000);
        // var timer2 = setTimeout(()=>{
        //   // alert("Game ended. Going back to Home Page");
        //   popup.isVisible= true;
        //   popup.popupMessage = "Game ended. Going back to Home Page";
        //   global.router.navigateByUrl('homePage');
        //   clearTimeout(timer2);            
        // },4000);
        
      })
      //listens for player state change
      room.state.players.onChange = (player, key) => {
        myPiece = player.myPiece
        console.log(player, "have changes at", key);
    };
    room.onLeave((code) => {
      // console.log(client.id, "left", room.name);
      
      console.log("onLeave called");
      
      
    });
    room.onMessage("turnChangeAfterTimeUp", ()=> {
      console.log("time up");
      Board.changePlayerTurn(true);
    });
    
    global.gameRoom.onMessage("DISCONNECT", (message)=>{
      //console.log("playerTurn---------->",message.playerTurn);
      // playerTurn = message.playerTurn;
      console.log("Other Player has left the game1", message.LeftPlayer);
      popup.isVisible= true;
      popup.popupMessage = global.opponentName + langModel.componentLang.popups.leftGame[langModel.lang];
      popup.closetxt = langModel.componentLang.popups.close[langModel.lang];
      popupFail = 1;
    });
    global.gameRoom.onMessage("Disconnect", (message)=>{
      //console.log("playerTurn---------->",message.playerTurn);
      // playerTurn = message.playerTurn;
      popup.isVisible= true;
      popup.popupMessage = global.opponentName + langModel.componentLang.popups.leftGame[langModel.lang];
      //popup.popupMessage = global.opponentName + " has left the game";
      popup.closetxt = langModel.componentLang.popups.close[langModel.lang];
      popupFail = 1;
      // setTimeout(() => {
        
      //   // self.model.loadingBar = false;
      // }, 2000);
      
      console.log("Other Player has left the game2", message.LeftPlayer);
    });
    
      // function for recieving other player move and sync the pieces
      function movetile(tile, piece){
        var tile1 = tiles[tile];//tiles object
        var piece1 = pieces[piece];//pieces object
        console.log("piece----->",piece);
        var inRange = tile1.inRange(piece1);
        if (inRange != 'wrong') {
          //if the move needed is jump, then move it but also check if another move can be made (double and triple jumps)
          
          if (inRange == 'jump' ) {
            var opponentKillormove = piece1.opponentJump(tile1);
              if(opponentKillormove == 'moveWithoutRestriction' && !Board.jumpexist){
                console.log("It can jump but do not check further moves");
                piece1.move(tile1);
                Board.changePlayerTurn(false);
              }
              else if (opponentKillormove ==  "removePieceAndMove") {
                console.log("It can jump");
                piece1.move(tile1);
                //soundService1.playAudio('Killed')
                if (piece1.canJumpAny()) {
                  // Board.changePlayerTurn(false); //change back to original since another turn can be made
                  piece1.element.addClass('selected');
                  // exist continuous jump, you are not allowed to de-select this piece or select other pieces
                  Board.continuousjump = true;
                } else {
                  Board.changePlayerTurn(false)
                }
              }
            //if it's regular then move it if no jumping is available
          } else if (inRange == 'regular' && !Board.jumpexist) {
            if (!piece1.canJumpAny()) {
              piece1.move(tile1);
              Board.changePlayerTurn(false)
            } else {
              // alert("You must jump when possible!");
              popup.isVisible= true;
              popup.popupMessage = langModel.componentLang.popups.jump[langModel.lang];
              popup.closetxt = langModel.componentLang.popups.close[langModel.lang];
            }
          }
      }
      
      console.log("boardUpdated");
    }
    
    }
    
    

    
   
  
  