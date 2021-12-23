//Create variables here
var dog,sadDog,happyDog, database;
var foodS,foodStock;
var fedTime,lastFed;
var feed,addFood;
var foodObj;
var gameState, readState;

function preload(){
sadDog=loadImage("images/dogImg.png");
happyDog=loadImage("images/dogImg1.png");
garden=loadImage("images/Garden.png"); 
washroom=loadImage("images/Wash Room.png"); 
bedroom=loadImage("images/Bed Room.png");
}

function setup() {
  database=firebase.database();
  createCanvas(1000,400);

  foodObj = new Food();

  foodStock=database.ref('Food');
  foodStock.on("value",readStock);
 
  dog=createSprite(800,200,150,150);
  dog.addImage(sadDog);
  dog.scale=0.15;
  
  feed=createButton("Feed the dog");
  feed.position(700,95);
  feed.mousePressed(feedDog);

  addFood=createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);

  readState=database.ref('gameState');
  readState.on("value",function(data){
    gameState=data.val();
  });

  fedTime=database.ref('FeedTime');
      fedTime.on("value",function(data){
        lastFed=data.val();
      });
}

function draw() {
 
 
  currentTime=hour(); 
  if(currentTime==(lastFed+1)){ 
  update("Playing"); 
  foodObj.garden(); 
  }else if(currentTime==(lastFed+2)){ 
  update("Sleeping"); 
  foodObj.bedroom(); 
  }else if(currentTime>(lastFed+2) && currentTime<=(lastFed+4)){ 
  update("Bathing"); 
  foodObj.washroom(); 
  }else{ 
  update("Hungry") 
foodObj.display(); 
}

if(gameState!="Hungry"){
  feed.hide();
  addFood.hide();
  dog.remove();

}else{
  feed.show()
    addFood.show();
    dog.addImage(sadDog);
  
}
  drawSprites();
}

//function to read food Stock
function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}


//function to update food stock and last fed time
function feedDog(){
  dog.addImage(happyDog);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1)
  if(foodObj.getFoodStock()<= 0){ 
  foodObj.updateFoodStock(foodObj.getFoodStock()*0); 
  }else{ 
  foodObj.updateFoodStock(foodObj.getFoodStock()-1); }
  
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour()
  })
}

//function to add food in stock
function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}

function update(state){
  database.ref('/').update({
    gameState:state

  });
}