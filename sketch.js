var dog,sadDog,happyDog, database;
var foodS,foodStock;
var fedTime,lastFed;
var feed,addFood;
var foodObj;
var bg, bgImage;
var milk, milkImage;

function preload(){
  sadDog = loadImage("Dog.png");
  happyDog = loadImage("happy dog.png");
  bgImage = loadImage("bg.png");
  milkImage = loadImage("Milk.png");

}

function setup() {
  database=firebase.database();
  createCanvas(1365,620);

  foodObj = new Food();

  foodStock=database.ref('Food');
  foodStock.on("value",readStock);
  
  milk = createSprite(700,220,150,150);
  milk.addImage(milkImage);
  milk.scale = 0.11;

  dog=createSprite(800,200,150,150);
  dog.addImage(sadDog);
  dog.scale=0.15;
  
  feed=createButton("Feed the dog");
  feed.position(700,95);
  feed.mousePressed(feedDog);

  addFood=createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);

}

function draw() {
  background(bgImage);
  foodObj.display();

  fedTime=database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed=data.val();
  });

  textSize(24);
  fill("black");
  text("Hi, My name is Coco!",750,50);
  text("I am feeling very hungry",750,300);
  text("Please feed me",750,350);
 
  fill("black");
  textSize(24);
  if(lastFed>=12){
    text("Last Feed : "+ lastFed%12 + " PM", 300,50);
   }else if(lastFed==0){
     text("Last Feed : 12 AM",350,30);
   }else{
     text("Last Feed : "+ lastFed + " AM", 300,50);
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
  if(foodObj.getFoodStock()<= 0){
    foodObj.updateFoodStock(foodObj.getFoodStock()*0);
  }else{
    foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  }
  
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