var round, money, knowledge, happiness, health, friends;    //fő elemek
var tutorialCnt, roundCnt;                                  //hol tart a tutorialban és hanyadik körben tartunk
var learnCnt, learnEnd;                                     //tanulás állapota és tanulás vége
var loanTill, loanValue;                                    //meddig kell törleszteni és mennyit körönként



var freeLevel = 0;
var weekDays = 1;
var freeTimes = 0;

var products = {medicine:5,chocolate:1,cinema:4,videogame:7,bike:12,holiday:50};
var increment = products.holiday/50;

jQuery(document).ready(initiatePage);


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
            jQuery("#tutorialText").text("A játékban négy fő elem van: Tudás, Vagyon, Boldogság és Egészség. Ezekkel kell a következőekben ügyesen bánnod.");
            jQuery("#tutorialDiv").fadeIn(400);
            break;
        case(1): 
            jQuery("#tutorialText").text("A körök és a barátaid számát is kísérd figyelemmel, hiszen ezek is fontos elemei a játéknak.");
            break;
        case(2): 
            jQuery("#tutorialText").text("A vagyonból a boltban tudsz venni boldogságot nyújtó tárgyakat, illetve gyógyszert az egészséged növelése érdekében.");
            break;
        case(3): 
            jQuery("#tutorialText").text("Az egészségeddel együtt a hátralévő körök száma is nő, így próbálj mindig egészséges lenni! A tanulás segítségével szerezhetsz tudást. A tudásoddal megegyező vagyont kapsz, ha dolgozol, tehát minél több a tudásod, annál több vagyonra tehetsz szert egy munkával.");
            break;
        case(4):
            jQuery("#tutorialText").text("A szabadidős tevékenységekkel egészségre tehetsz szert, azonban ennek száma korlátozva van! Ha legalább tíz barátod van, akkor hét köröknént egyszer végezhetsz szabadidős tevékenységet, míg húsz barát felett már akár kétszer is.");
            break;
        case(5):
            jQuery("#tutorialText").text("Ha netán kevés a vagyonod lehetőséged lesz a bankban hitelt felvenni, amivel vagyonra tehetsz szert, de cserébe a hátralévő köreidben vissza kell fizetned a hitelt. Ha nem tudod visszafizetni, mert elfogy a vagyonod, onnantól a boldogságod fog csökkenni.");
            break;
        case(6):
            jQuery("#tutorialText").text("A sport segítségével tudsz barátokat szerezni. A boltban az árak a tudásodtól függően növekedni fognak, de cserébe több boldogságot is kapsz!");
            jQuery("#tutorialBut").val("Játsszunk!");
            break;
        default:
            jQuery("#tutorialDiv").hide();
            jQuery("#tutorialText").val("");
            jQuery("#tutorialSkip").hide();
            jQuery("#tutorialBut").hide();
            jQuery("#upControllerDiv").fadeIn(300);
            jQuery("#controllerDiv").fadeIn(300);
			jQuery("#freeBut").attr("disabled", true);
            refreshData();
    }
    tutorialCnt++;
}
//Dolgozik egy kört
function workTime(){
    money += knowledge;
    endOfRound("gif/work.gif");
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
        var correctGif;
        switch(learnEnd){
            case(2): correctGif = "gif/keramia.gif"; break;
            case(3): correctGif = "gif/nyelv.gif"; break;
            case(8): correctGif = "gif/szakma.gif"; break;
            case(15): correctGif = "gif/egyetem.gif"; break;
        }
        if(learnEnd - learnCnt == 0)
        {
            switch(learnEnd){
                case(2): jQuery("#gifText").text("Gratulálunk kiérdemeltél 3 tudáspontot");; break;
                case(3): jQuery("#gifText").text("Gratulálunk kiérdemeltél 5 tudáspontot"); break;
                case(8): jQuery("#gifText").text("Gratulálunk kiérdemeltél 15 tudáspontot"); break;
                case(15):jQuery("#gifText").text("Gratulálunk kiérdemeltél 30 tudáspontot"); break;
            }
            
        }
        else{
        jQuery("#gifText").text("Még " + (learnEnd - learnCnt) + " körön keresztül kell tanulnod");
        }
        
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
        endOfRound(correctGif);
 
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

        endOfRound("gif/pecazas.gif");
    
    }
}

//Szabadidős tevékenységet végez
function freeTime(){
    if(freeTimes > 0)
    {
        health += 2;
        freeTimes--;
        jQuery("#gifable").attr("src","gif/szabadido.gif");
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
    endOfRound("gif/sport.gif");
   
}

//Vásárlás
function buy(price){
    if(price > money){
        //nincs elég pénze
    }
    else{
       
        money -= price;
        switch(price){
            case(products.medicine): health += 1; break;
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
        jQuery("#bankDiv").fadeIn(700);
        if(loanTill > roundCnt)
        {
            jQuery("#bankText").text("Még " + (loanTill-roundCnt) + " körön keresztül kell az adósságod fizetned, addig nem vehetsz fel újabb hitelt." );
            jQuery("#loan").hide();
            jQuery("#backLoan").hide();
            jQuery("#loanBut").hide();
        }
        else{
            jQuery("#loan").show();
            jQuery("#backLoan").show();
            jQuery("#loanBut").show();

            jQuery("#bankText").text("Üdvözlünk a bankban. Itt tudsz felvenni hitelt, ha esetleg túl kevés a vagyonod, de gondold át, mert vissza kell fizetned!");
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
    }
    else{
        closeTabs();
    }
}

//Bolt megnyitása
function openShop(){
    jQuery("#videogamePrice").text(products.videogame + "Vp -> " + increment*10 + "Bp");
    jQuery("#chocolatePrice").text(products.chocolate + "Vp -> " + increment*1 + "Bp");
    jQuery("#bikePrice").text(products.bike + "Vp -> " + increment*20 + "Bp");
    jQuery("#cinemaPrice").text(products.cinema + "Vp -> " + increment*5 + "Bp");
    jQuery("#holidayPrice").text(products.holiday + "Vp -> " + increment*100 + "Bp");
    jQuery("#medicinePrice").text(products.medicine + "Vp -> 1Ép");

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
        loanTill = Math.floor(loanMoney / (knowledge/4)) + roundCnt; // mindig a tudas negyedet vonja le, es igy ha nem vesz fel sok hitelt hamar torlesztheti

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
    
    if((round + health) < roundCnt){
        jQuery("#start").text("A játék véget ért! Az elért boldogságpontjaid száma: " + happiness + ". Gratulálunk hozzá!");
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
	
	if(freeTimes > 0){
		jQuery("#freeBut").attr("disabled", false);
	}
	else{
		jQuery("#freeBut").attr("disabled", true);
	}
    
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
        if(gifName == "gif/nyelv.gif" || gifName == "gif/szakma.gif" || gifName == "gif/egyetem.gif" )
        {

            //jQuery("#gifable").attr("style","width: 40%;height: auto;margin: 0 auto");
        }
        else{
            jQuery("#gifable").attr("style","height: 60%;width: auto;margin: 0 auto");
            if(gifName != "gif/keramia.gif")
            {
              jQuery("#gifText").text("");
            }
        }
        jQuery("#gifable").attr("src",gifName);
        jQuery("#upJumper").show();
        setTimeout(()=>{jQuery("#upJumper").hide();}, 2000);
    }
}

    
function priceRefresh(){
    var multiple = Math.pow(10, Math.floor(Math.log10(knowledge))) / Math.pow(10, Math.floor(Math.log10(products.holiday)));
    if(multiple > 1)
    {
        for(var index in products){
            products[index] *= multiple;
        }
        increment = products.holiday/50;
       
    }
}
