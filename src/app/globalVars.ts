export class GlobalDetails{
    myEmail :string | undefined;
    password: string | undefined;
    authToken: string | undefined;
    userId: number | undefined;
    myphone: number | undefined;
    countryCode: number | undefined;
    OTP: number | undefined;
    userName: string | undefined = "Genilson";
    avatar: number | undefined = 1;
    isforgotPwd :boolean | undefined =false;
    setProfile :boolean | undefined =true;
    gottiId: number = 2;
    gameName : string| undefined ="Home";
    checkersGameType: string | undefined = "RP";
    LudoGameType: string | undefined = "RP";
    createOrJoin: string | undefined = "create";
    roomCode: string | undefined = "";
    boardType:string | undefined = "";
    isEmailLogin:boolean | undefined =true;
    firstName : string | undefined = "";
    lastName: string | undefined = "";
    dOb: string | undefined = "";
    address: string | undefined = "";
    gender :string | undefined = "Male";
    accNum:string | undefined = "";
    bankName:string | undefined = "";
    expPhoneNumber:Number = NaN;
    coins : any = 0;
    moneyAmt: any = 0;
    emailVerified :boolean | undefined =true;
    phoneVerified :boolean | undefined =true;
    isAgeCheck : boolean = false;
    isPortuguese : boolean = true;
    soundPlaying : boolean = true;
    sound2Playing : boolean = true;
    isPlaying : boolean = false;
    winsLudo : Number = 0;
    winsCheckers : Number = 0;
    isHistory: boolean = true;
    moneyVal : any = 0;
    onMobile :boolean =true;
    public tourDataArray:any = [];
    public id :any;
    public soundJson = [
        {"path":'assets/sounds/Click.mp3', "code":"click"},
        {"path":'assets/sounds/Dice1.mp3', "code":"Dice1"},
        {"path":'assets/sounds/Dice4.mp3', "code":"Dice4"},
        {"path":'assets/sounds/Dice6.mp3', "code":"Dice6"},
        {"path":'assets/sounds/Dicesound.wav', "code":"Dicesound"},
        {"path":'assets/sounds/F_square.mp3', "code":"F_square"},
        {"path":'assets/sounds/Homepage.mp3', "code":"Homepage"},
        {"path":'assets/sounds/Killed.mp3', "code":"Killed"},
        {"path":'assets/sounds/Loose.mp3', "code":"Loose"},
        {"path":'assets/sounds/ludostart.mp3', "code":"ludostart"},
        {"path":'assets/sounds/Championship.mp3', "code":"Championship"},
        {"path":'assets/sounds/Victory.mp3', "code":"Checker_winner"},
        {"path":'assets/sounds/winner.mp3', "code":"winner"},
        {"path":'assets/sounds/Checkers_piecemove.wav', "code":"piece_move"}
    ];
    
}
// var myEmail: string = "";