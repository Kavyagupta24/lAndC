import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SoundServiceService } from 'src/services/sound-serviceWeb.service';
import { GlobalDetails } from '../globalVars';
import { LanguageModel } from '../language/langModel';

@Component({
  selector: 'app-tutorial',
  templateUrl: './tutorial.component.html',
  styleUrls: ['./tutorial.component.css']
})
export class TutorialComponent implements OnInit {
  tutorialText ="";
  constructor(private router: Router, public global: GlobalDetails,private soundService: SoundServiceService, public langModel: LanguageModel) { }

  ngOnInit(): void {
    if (this.global.gameName == 'Ludo') {
      if(this.langModel.lang == 'en'){ this.tutorialText ="Players take turns in a anti-clockwise order, highest throw of the dice starts. Each throw, the player decides which piece to move. A piece simply moves in a anti-clockwise direction around the track given by the number thrown. If no piece can legally move according to the number thrown, play passes to the next player. A throw of 6 gives another turn. A player must throw a 6 to move a piece from the starting circle onto the first square on the track. The piece moves 6 squares around the circuit beginning with the appropriately coloured start square (and the player then has another turn).\n"+

      " If a piece lands on a piece of a different colour, the piece jumped upon is returned to its starting circle." +
      
      " When a piece has circumnavigated the board, it proceeds up the home column. A piece can only be moved onto the home triangle by an exact throw." +
      
      " The first person to move all 4 pieces into the home triangle wins.";
    }
    if(this.langModel.lang == 'pt'){ this.tutorialText ="Os jogadores se revezam no sentido anti-horário, o lançamento mais alto dos dados começa. \n"+

      " A cada lance, o jogador decide qual peça mover. Uma peça simplesmente se move no sentido anti-horário ao redor da pista dada pelo número lançado. \n" +
      
      " Se nenhuma peça puder se mover legalmente de acordo com o número lançado, o jogo passa para o próximo jogador. Um lance de 6 dá outro turno. Um jogador deve lançar um 6 para mover uma peça do círculo inicial para a primeira casa na pista. " +
      
      " A peça se move 6 casas ao redor do circuito começando com a casa de início de cor apropriada (e o jogador então tem outra vez). \n" +
      "Se uma peça cair em uma peça de cor diferente, a peça saltada volta ao seu círculo inicial. Quando uma peça circunavegou o tabuleiro, ela segue para a coluna inicial. " +
      "Uma peça só pode ser movida para o triângulo da casa por um lance exato. A primeira pessoa a mover todas as 4 peças para o triângulo da casa vence.";
    }
  }
    else{
      if(this.langModel.lang == 'en'){
         this.tutorialText ="The board is positioned with the light colored square in the bottom right corner. The checkers for each player are setup on the dark colored squares. Players should have 12 checkers in their first three rows (four in each row)." +
      " The object of the game is to capture all your opponent’s checkers or trap your opponent so no move can be made." +
      " A single checker can move forward diagonally one space per turn. To capture an opponent’s checker, a player may jump over a diagonally adjacent opponent's checker."+
      " The space on the other side of the opponent’s checker must be open. Multiple checkers can be captured if jumped consecutively with the same checker."+
      " If a checker makes it to the other side of the board, it is queened. To queen a checker, another checker is placed on top of it. A queened checker can move forward or backward on the board."+

      " The first player to capture all the opponent’s checkers wins. If a player is unable to make a move, he/she loses the game."+
      " A single checker can only move and jump going forward."+
      " If a player can make a capture, he/she has to make the capture.";
    }
    if(this.langModel.lang == 'pt'){ 
      this.tutorialText ="O tabuleiro está posicionado com o quadrado de cor clara no canto inferior direito. As damas de cada jogador são colocadas nos quadrados de cor escura. Os jogadores devem ter 12 peças em suas três primeiras linhas (quatro em cada linha). " +
      " O objetivo do jogo é capturar todas as peças do seu oponente ou prender seu oponente para que nenhum movimento possa ser feito. Um único verificador pode avançar diagonalmente um espaço por turno. " +
      " Para capturar a peça de um oponente, um jogador pode pular sobre uma peça de um oponente diagonalmente adjacente. O espaço do outro lado da peça do adversário deve estar aberto. "+
      " Vários verificadores podem ser capturados se saltados consecutivamente com o mesmo verificador. Se uma peça chegar ao outro lado do tabuleiro, ela é dama. "+
      " Para dama uma peça, outra peça é colocada em cima dela. Uma dama dama pode se mover para frente ou para trás no tabuleiro. O primeiro jogador a capturar todas as peças do adversário vence. Se um jogador não conseguir fazer uma jogada, ele perde o jogo. Um único verificador só pode se mover e pular para frente. "+
      " Se um jogador pode fazer uma captura, ele tem que fazer a captura.";
  }
}
  }
  back() {
    this.soundService.playAudio('click');
    this.router.navigateByUrl('ludoLandingPage');
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
            'background-color': '#0a5502',
            'background-image':
              'url(../../assets/img1/Repeatable_Bg.png)',
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
      
      default:
        return {
          'background-image':
            'url(../../assets/img1/Repeatable_Bg.png),url(../../assets/img1/Stretchable_BG.png)',
        };
    }
  }
}
