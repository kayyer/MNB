var round, money, knowledge, happiness, health, friends;    //fő elemek
var tutorialCnt, roundCnt;                                  //hol tart a tutorialban és hanyadik körben tartunk
var learnCnt, learnEnd;                                     //tanulás állapota és tanulás vége
var loanTill, loanValue;                                    //meddig kell törleszteni és mennyit körönként

var freeLevel = 0;
var weekDays = 1;
var freeTimes = 0;

var products = {medicine:5,chocolate:1,cinema:4,videogame:7,bike:12,holiday:50};

jQuery(document).ready(initiatePage);

//TODO: 
//Kör eltelte függvény kiemelése DONE
//Bolt -> árak * tudás DONE 
//Hitel érték átnézése - most nem is megy DONE
//hitel max érték állítása, nem a simáé  DONE
//Egészség -> kör átalakítása
//Egészség növelésének átgondolása - végtelen játék



function initiatePage(){
    jQuery("#tutorialBut").hide();
    jQuery("#tutorialDiv").hide();
    jQuery("#tutorialSkip").hide();
    jQuery("#upControllerDiv").hide();
    jQuery("#controllerDiv").hide();
    jQuery("#bankDiv").hide();
    jQuery("#shopDiv").hide();
    jQuery("#learnDiv").hide();
}

//Elindította a játékot
function startClick(){
    round = 50;
    money = 0;
    knowledge = 0;
    happiness = 0;
    health = 0;
    friends = 0;
    roundCnt = 0;
    learnEnd = 0;
    learnCnt = 0;
    loanTill = 0;
    loanValue = 0;

    jQuery("#startDiv").hide();

    tutorialCnt = 0;
    tutorialNext();
}

//Következő tutorial lap
function tutorialNext(skip){
    if(skip){
        tutorialCnt = 1000;
    }

    switch(tutorialCnt){
        case(0): 
            jQuery("#tutorialBut").show();
            jQuery("#tutorialSkip").show();
            jQuery("#tutorialText").text("A játékban négy négy fő elem van: Tudás, Vagyon, Boldogság és Egészség. Ezekkel kell a következőekben ügyesen bánnod.");
            jQuery("#tutorialDiv").fadeIn(400);
            break;
        case(1): 
            jQuery("#tutorialText").text("A körök és a barátaid számát is kísérd figyelemmel, hiszen ezek is fontos elemei a játéknak.");
            break;
        case(2): 
            jQuery("#tutorialText").text("A vagyonból a boltban tudsz venni boldogságot nyújtó tárgyakat, illetve gyógyszert az egészséged növelése érdekében.");
            break;
        case(3): 
            jQuery("#tutorialText").text("Az egészségeddel együtt a hátralévő körök száma is nő, így próbálj mindig egészséges lenni! A tudásod pedig a munkáért cserébe kapott fizettségedet növeli, tehát minél több a tudásod, annál több vagyonra tehetsz szert egy munkával.");
            break;
        case(4):
            jQuery("#tutorialText").text("A szabadidős tevékenységekkel tudsz szerezni barátokat és egészséget növelni, míg tanulással tudásra tehetsz szert.");
            break;
        case(5):
            jQuery("#tutorialText").text("Ha netán kevés a vagyonod lehetőséged lesz a bankban hitelt felvenni, amivel vagyonra tehetsz szert, de cserébe a hátralévő köreidben vissza kell fizetned a hitelt");
            break;
        case(6):
            jQuery("#tutorialText").text("Ha elfogy a vagyonod mínuszba kerül az egészséged és a boldogságod romlani fog!");
            jQuery("#tutorialBut").val("Játszunk!");
            break;
        default:
            jQuery("#tutorialDiv").hide();
            jQuery("#tutorialText").val("");
            jQuery("#tutorialSkip").hide();
            jQuery("#tutorialBut").hide();
            jQuery("#upControllerDiv").fadeIn(300);
            jQuery("#controllerDiv").fadeIn(300);
            refreshData();
    }
    tutorialCnt++;
}

//Dolgozik egy kört
function workTime(){
    money += knowledge;
    endOfRound("work.gif");
}

//Tanul egy kört
function learnTime(){
    if(learnEnd == 0){                  //nincs aktív tanulás, válasszon egyet
        if(jQuery('#learnDiv').css('display') == 'none'){ 
            closeTabs();
            jQuery("#learnDiv").show();
            return;
        }
        else{
            closeTabs();
            return;
        }
    }
    else if(learnCnt < learnEnd){       //van aktív tanulás és nincs befejezve
        jQuery("#learnDiv").hide();
        learnCnt++;
        if(learnCnt == learnEnd){       //befejezte a tanulást, kap tudást    
            switch(learnEnd){
                case(2): knowledge += 3; break;
                case(3): knowledge += 5; break;
                case(8): knowledge += 15; break;
                case(15): knowledge += 30; break;
            }
            learnEnd = 0;
            learnCnt = 0;
        }

        endOfRound();
 
    }
    refreshData();
}

//Kiválasztotta mit akar tanulni
function learnSet(learn){
    if(learn != 1){
        learnEnd = learn;
        learnCnt = 0;
        learnTime();
    }
    else{
        knowledge++;
        learnEnd = 0; learnCnt = 0;

        endOfRound("pecazas.gif");
    
    }
}

//Szabadidős tevékenységet végez
function freeTime(){
    if(freeTimes > 0)
    {
        health += 2;
        freeTimes--;
        jQuery("#gifable").attr("src","szabadido.gif");
        jQuery("#upJumper").show();
        setTimeout(()=>{jQuery("#upJumper").hide();},2000);
    }
    refreshData();
    
   
}

//Sportol
function sportTime(){
    friends++;
    if(friends == 10)       //ha eleri a 10 baratot 1x szabadidozhet
    {
        freeLevel = 1;          //beallitom a szabadido szintet 1re
        freeTimes = freeLevel;  //freeTimes-szor szabadidozhet meg(a heten ezt majd az endOfRoundban mindig ujra toltom)
    }
    else if(friends == 20)       //ha eleri a 20 baratot 2x szabadidozhet
    {
        freeLevel = 2;
        freeTimes = freeLevel;
    }
    endOfRound("sport.gif");
   
}

//Vásárlás
function buy(price){
    if(price > money){
        //nincs elég pénze
    }
    else{
        var increment = products.holiday/50;
       
        money -= price;
        switch(price){
            case(products.medicine): health += 3*increment; break;
            case(products.chocolate): happiness += 1*increment; break;
            case(products.cinema): happiness += 5*increment; break;
            case(products.videogame): happiness += 10*increment; break;
            case(products.bike): happiness += 20*increment; break;
            case(products.holiday): happiness += 100*increment; break;
           
        }
    }
    jQuery("#shopDiv").hide();
    refreshData();
}

//Bank megnyitása
function openBank(){
    if(jQuery('#bankDiv').css('display') == 'none'){ 
        closeTabs();
        jQuery("#bankDiv").show();
        var input = document.getElementById("loan");
        input.setAttribute("max",Math.floor(((knowledge/4)*((round+health)-roundCnt)/1.05))); //Azert osztom el 1.05el mert a max a kamatos penzre vonatkozik
        jQuery("#loan").val(Math.floor((knowledge/4)*((round+health)-roundCnt)/2));
        refreshData();
        jQuery("#backLoan").val(Math.floor(jQuery("#loan").val()*1.05));
        $('#loan').on('input', function() {
            if(jQuery("#loan").val() > Math.floor(((knowledge/4)*((round+health)-roundCnt)/1.05)))
            {
                jQuery("#loan").val(Math.floor(((knowledge/4)*((round+health)-roundCnt)/1.05)));
            }
            jQuery("#backLoan").val(Math.floor(jQuery("#loan").val()*1.05));
        });
    }
    else{
        closeTabs();
    }
}

//Bolt megnyitása
function openShop(){
    jQuery("#videogamePrice").text(products.videogame);
    jQuery("#chocolatePrice").text(products.chocolate);
    jQuery("#bikePrice").text(products.bike);
    jQuery("#cinemaPrice").text(products.cinema);
    jQuery("#holidayPrice").text(products.holiday);
    jQuery("#medicinePrice").text(products.medicine);
    
    if(jQuery('#shopDiv').css('display') == 'none'){ 
        closeTabs();
        jQuery("#shopDiv").show();
    }
    else{
        closeTabs();
    }
}

//Felveszi a hitelt
function makeLoan(){
    if(loanTill < roundCnt){
        var loanMoney = parseInt(Math.floor(jQuery("#loan").val()*1.05));
        //loanValue = loanMoney / ((round+health) - roundCnt);
        loanTill = Math.floor(loanMoney / (knowledge/4)) + roundCnt; // mindig a tudas negyedet vonja le, es igy ha nem vesz fel sok hitelt hamar torlesztheti
        //loanTill = (round+health) - (loanMoney / loanValue);
        loanValue = Math.floor(knowledge/4);
        money += parseInt(jQuery("#loan").val());
        closeTabs();
    }
    refreshData();
}

//Bezárja az összes ablakot
function closeTabs(){
    jQuery("#shopDiv").hide();
    jQuery("#bankDiv").hide();
    jQuery("#learnDiv").hide();
}

//Értékek változtak, frissítjük html-t
function refreshData(){
    
    if((round + health) <= roundCnt){
        jQuery("#startDiv").show();
        jQuery("#controllerDiv").hide();
        jQuery("#upControllerDiv").hide();
    }


    jQuery("#roundLabel").text("Kör:"+roundCnt + "/" + (round+health));
    jQuery("#valueLabel").text("Vagyon:" + money);
    jQuery("#knowledgeLabel").text("Tudás:"+knowledge);
    jQuery("#happinessLabel").text("Boldogság:" + happiness);
    jQuery("#healthLabel").text("Egészség:"+health);
    jQuery("#friendsLabel").text("Barátok:" + friends);
    
    priceRefresh();
}


function endOfRound(gifName = ""){
    roundCnt++;
    happiness += friends;
    if(loanTill > roundCnt){
        if(money - loanValue < 1)
        {
            money = 0;
            happiness -= loanValue;  // ha nem tud fizetni a torlesztovel csokkentem a boldogsagot
        }
        else{
            money -= loanValue;
        }
    }
    if(freeLevel > 0)
    {
        if(weekDays == 7)
        {
            weekDays = 1;
            freeTimes = freeLevel;
        }
        else{
            weekDays++;
        }
    }
    closeTabs();
    refreshData();
    if(gifName != "")
    {
        jQuery("#gifable").attr("src",gifName);
        jQuery("#upJumper").show();
        setTimeout(()=>{jQuery("#upJumper").hide();},2000);
    }
}

    
function priceRefresh(){
    var multiple = Math.pow(10, Math.floor(Math.log10(knowledge))) / Math.pow(10, Math.floor(Math.log10(products.holiday)));
    if(multiple > 1)
    {
        for(var index in products){
            products[index] *= multiple;
        }
       
    }
}
