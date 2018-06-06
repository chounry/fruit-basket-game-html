window.onload = function(){ 
    // create drop objects 
    function Food(){
        this.y = 0;
        this.x;  
        this.img_width = 50;      
        this.minus_health;
        this.name;
        this.img_src;
        this.ele;
        this.speed = 1;
        this.audio_src;     
        this.audio_vol = 1; 

        this.createEle = function(parent){
            // Create an element and put itself to the DOM
            let img = document.createElement('img');
            img.src = this.img_src;
            img.setAttribute('width', this.img_width);

            var div = document.createElement('div');
            div.setAttribute('class','drop');
            div.append(img);
            div.style.left = this.x+'px';
            parent.insertBefore(div, document.getElementById('basket'));
            this.ele = div;
        }

        this.draw = function(){
            // Draw image at a new position
            // if(!this.ele){ // if there is no element yet,then create
            //     this.createEle(parent);
            // }else{
            this.y += this.speed;
            this.ele.style.top = this.y +'px';
            // }
        }
        this.destroy = function(){
            // remove the object's element from the DOM but not the object itself
            this.ele.remove();
        } 

        this.isColideWith = function(obj){
            // calculate to find whether this element is colide with the 'obj'.
            // return 'true' if colide otherwise 'false'

            var main_ele_b = document.getElementById('inner').getBoundingClientRect();    
            var colideBounding = obj.getBoundingClientRect(); 
            var selfBounding = this.ele.getBoundingClientRect();
            var coli_Obj_Offset = {
                'left'  : colideBounding.left - main_ele_b.left ,
                'top'   : colideBounding.top + window.scrollY
            }
            var self_ele_offset = {
                'top'   : this.y + selfBounding.height - 5,
                'left'  : this.x + selfBounding.width / 2
            }

            if(self_ele_offset.top > coli_Obj_Offset.top + 10 && self_ele_offset.top < coli_Obj_Offset.top + 50){
                if(self_ele_offset.left > coli_Obj_Offset.left+10 && self_ele_offset.left < (coli_Obj_Offset.left + colideBounding.width - 10)){
                    return true;
                }
            }
            return false;
        }

        this.playSound = function(){
            new Audio(src=this.audio_src,volume=this.audio_vol).play();
        }
    }

    function remove(obj,arr){
        // remove object from an array
        var index = arr.indexOf(obj);
        if(index > -1){
            arr.splice(index,1);
        }
    }

    ///
    function animateGameOver(){
        $('#blur_bg').css('display','');
        $('#game_over_menu').css('display','');      
        $('#game_over_menu').addClass('changeOpacity')  
        $('#during_play_menu').css('display','none');
        $('#basket').css('display','none');
        $('#end_score').text('Scores : '+ score);
        gameOver_audio.play();
        background_music.volume = 0;
        endLoop();
    }

    function endLoop(){
        clearInterval(createObj_loop);
        clearInterval(game_loop);
    }

    function minusHealth(value){
        health += value;
        if(health <= 0){health = 0;}
        if(health >= 100){health = 100;} 
        renderHealth(health);
    }
    function renderHealth(value){
        document.getElementById('health_change').style.width = value+'%';        
    }

    function addScore(value){
        score++;
        renderScore(score);
    }
    function renderScore(score){
        document.getElementById('score').innerText = 'Scores : '+score;
    }

    
    
    function animateHealth(x){
        // Animate the a flying dog and generate a health object 
        // at a random position ' x ' then push that healt obj to 'all_drop_object'
        
        var dog_ele = document.createElement('div');
        var img = document.createElement('img');
        img.src = 'assets/imgs/tacodog.gif';
        img.width = 200;
        dog_ele.setAttribute('class','tacoDog');
        dog_ele.appendChild(img);
        var dog_left = -80;
        var dog_top = 100;
                
        drop_place_ele.appendChild(dog_ele);
        dog_ele.style.top = dog_top+'px';

        var created = false;
        var dog_loop = setInterval(function(){
            if(dog_left > drop_place_ele.getBoundingClientRect.width + 50 || gameOver){
                dog_ele.remove();
                clearInterval(dog_loop);
            }
            if(dog_left + 50 > x && !created){
                var food_value = ['life.png', 10, 'heal','assets/sounds/heal_sound.wav']
                var food = new Food();

                food.x = x;
                food.y = dog_top;
                food.speed = 1.5;
                food.img_src = 'assets/imgs/'+food_value[0];
                food.minus_health = food_value[1];
                food.name = food_value[2];
                food.audio_src = food_value[3];
                food.createEle(drop_place_ele);
                food.audio_vol = 0.1;
                all_drop_obj.push(food);
                created = true;
            }
            dog_left ++;
            dog_ele.style.left = dog_left+'px';
        },10)
    }


    /// background music
    var background_music = new Audio('assets/sounds/background_sound.3gp');
    background_music.loop = true;
    background_music.play();
    
    var main_ele = document.getElementById('main');    
    var boundary_ele = document.getElementById('boundary');
    var basket_ele = document.getElementById('basket');
    var drop_place_ele = document.getElementById('inner');
    var createObj_loop;
    var score;
    var health;
    var gameOver;
    var all_drop_obj = [];
    var gameOver_audio = new Audio('assets/sounds/lost_sound.mp3');

    function init(isDisplay){
        background_music.volume = 0.7;
        if(!isDisplay){background_music.currentTime=0;background_music.volume = 0.2;}
        

        gameOver = false;
        score = 0;
        health = 100;
        all_drop_obj = [];
        renderScore(score);
        renderHealth(health);
        
        var foods_value = [
            ['heal'],
            ['apple.png', 0,'food', 'fruit_sound.mp3'],
            ['grap.png', 0, 'food', 'fruit_sound.mp3'],
            ['bomb.png', -25, 'bomb', 'bomb_sound.mp3'],
            ['strawberry.png', 0, 'food', 'fruit_sound.mp3'],
            ['orange.png', 0, 'food', 'fruit_sound.mp3'],
            ['green-worm.png', -10, 'worm','worm_sound.mp4'],
            ['apple_worm.png', -10, 'worm','worm_sound.mp4']
        ]

        var heal_obj_repeat = 0;
        createObj_loop = setInterval(function(){
            var f = new Food();
            var tmp = foods_value[Math.floor(Math.random() * foods_value.length)];
            
            f.x = Math.floor(Math.random() * 700) + 50; // from 50 to 750            
            
            if(tmp[0] == 'heal'){
                // delay times for generating health object
                if(heal_obj_repeat < 4){
                    heal_obj_repeat ++;
                    return;
                }
                animateHealth(f.x);
                heal_obj_repeat = 0;
                return;
            }
            f.img_src = 'assets/imgs/'+tmp[0];
            f.audio_src = 'assets/sounds/'+tmp[3];
            f.minus_health = tmp[1];
            f.name = tmp[2];
            f.speed =  (Math.random() * 4) + 1;
            f.createEle(drop_place_ele);
            all_drop_obj.push(f);
        },500)
    }

    function run(isDisplay){
        init(isDisplay);
        game_loop =  setInterval(function(){
            // The `For Loop` is to draw each element that we have store 
            // in the'all_drop_obj'.
            // Also check any colision at every frame
            for(var i=0;i<all_drop_obj.length;i++){
                if(isDisplay){health=100;}
                
                var drop_obj = all_drop_obj[i];
                drop_obj.draw();
               
                var basketColi = drop_obj.isColideWith(basket_ele);
                var boundaryColi = drop_obj.isColideWith(boundary_ele);

                if(basketColi || boundaryColi){
                    if(basketColi){
                        if(drop_obj.name == 'food')
                            addScore();
                        minusHealth(drop_obj.minus_health);
                        drop_obj.playSound();
                    }else if(boundaryColi && drop_obj.name == 'food'){
                        minusHealth(-3);
                    }
                    drop_obj.destroy();
                    remove(drop_obj, all_drop_obj);
                }
                if(health <= 0){
                    gameOver = true;
                    animateGameOver();
                }
            }
        },15)        
    }

    run(true);

    function ButtMouseDownHandler(e){
        e.style.transform ='translateY(2px)';
    }

    function ButtMouseUpHandler(e){

        gameOver_audio.pause();        //  |
        gameOver_audio.currentTime = 0;//  | clear the lost sound when user press play again

        endLoop();
        $('.drop').remove();        
        $('#game_over_menu').css('display','none');
        $('#start_menu').css('display','none');
        $('#blur_bg').css('display','none');
        $('#basket').css('display','');
        $('#during_play_menu').css('display','');
        run(false); 
    }

    var play_but = $('.play_but');
    play_but.mouseup(function(){
        ButtMouseUpHandler(this);
    })

    $(document).keydown(function(e){
        if(e.key =='Enter'){
            var which = play_but[0].style.display ? play_but[0] : play_but[1];
            ButtMouseDownHandler(which);
        }
    }).keyup(function(e){
        if(e.key == 'Enter'){
            var which = play_but[0].style.display ? play_but[0] : play_but[1];  
            ButtMouseUpHandler(which);
        }
    })

    window.onmousemove = function(e){
        var main_ele_b = main_ele.getBoundingClientRect();
        var basket_ele_b = basket_ele.getBoundingClientRect();     
        let left = e.clientX;

        //--> if the mouse is at the left side(Out of the box) of the '#main' then make the basket 
        //    stay at the right side
        if(left < main_ele_b.left + basket_ele_b.width/2 ){
            left = 0;
        } 
        //--> if the mouse in the '#main' box then the basket will follow the mouse
        else if(left > main_ele_b.left + main_ele_b.width - basket_ele_b.width/2){
            left = main_ele_b.width - basket_ele_b.width
        }
        //--> if the mouse is at the right side(Out of the box) of the '#main' then make the basket
        //     stay at the left side
        else{
            left = left - main_ele_b.left - basket_ele_b.width/2
        }

        document.getElementById('basket').style.left = left+'px';
    }   
    
}