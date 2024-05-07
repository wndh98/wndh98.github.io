//이미지
//플렝이어
let playerImg = new Image();
playerImg.src='./images/player/player.png';

let bulletImg =new Image();
bulletImg.src='./images/player/bullet.png';
//몬스터
var mosterImg =new Image();
mosterImg.src='./images/monster/monster.png';

var mbulletImg =new Image();
mbulletImg.src='./images/monster/mbullet.png';
//보스
let bossImg = new Image();
bossImg.src='./images/boss/boss.png';

let bossBulletImg = new Image();
bossBulletImg.src='./images/boss/bossbullet.png';

let bossEnemyImg = new Image();
bossEnemyImg.src='./images/boss/bossenmey.png';

//오브젝트
let objectImg=[];

let hpImg=new Image();
hpImg.src="./images/object/hpImg.png";
objectImg.push(hpImg);

let atkImg=new Image();
atkImg.src="./images/object/atkImg.png";
objectImg.push(atkImg);
// ///플레이어


class Player {
  //플레이어 class 선언
  constructor() {
    this.width = 100; //wdith 50
    this.height = 100; //height 50
    this.x = canvas.width / 2 - this.width / 2; //x좌표
    this.y = canvas.height - (this.height + 50); //y좌표
    this.hp = 5; //player 체력
    this.speed = 120; //속도
    this.attack = 1; //공격력
  }
  draw() {

    ctx.drawImage(playerImg,this.x, this.y,this.width,this.height);
      
    
  }
  drawHp(i, margin) {
    // i는 갯수 margin 는 그림 사이의 거리

    ctx.fillStyle = "pink";
    ctx.fillRect(10 + i * margin, 10, 30, 30);
    
  }
}


class Bullet {
  constructor(player) {
    this.width = 20;
    this.height = 30;
    this.x = player.x + player.width / 2;
    this.y = player.y - 10;
    this.speed = 110;
    this.attack = player.attack;
  }
  draw() {
    //ctx.fillStyle = "red";
    // ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.drawImage(bulletImg,this.x, this.y,this.width,this.height);


  }

  move() {
    if (this.y < 0) {
      bulletArr.shift();
      return;
    }
    this.y -= this.speed * deltaTime;
    this.draw();
    if (!invincibility) {
      onCrash(player, this);
    }
  }
}



///////////몬스터

class Monster {
  constructor() {
    this.width = 65;
    this.height = 65;
    this.x = Math.random() * (canvas.width - this.width);
    this.y = -this.height / 2; // 화면 상단 중앙에 위치
    this.speed = Math.random() * 2 + 20;
    this.lastShootTime = 0; // 마지막 총알 발사 시간
    this.shootInterval = 1000; // 총알 발사 간격 (2초)
    this.hp = 1;
    this.attack = 1;
  }

  draw() {
    ctx.drawImage(mosterImg,this.x, this.y,this.width,this.height);
  }

  update(deltaTime) {
    this.y += this.speed * deltaTime; // 적군을 아래로 이동

    // 일정 시간마다 총알 발사
    const currentTime = performance.now();
    if (currentTime - this.lastShootTime > this.shootInterval) {
      this.shoot();
      this.lastShootTime = currentTime;
    }

    // 화면 아래로 벗어난 경우 재생성
    if (this.y > canvas.height) {
      this.y = -this.height / 2; // 화면 상단 중앙에 위치
      this.x = Math.random() * (canvas.width - this.width);
      this.speed = Math.random() * 10 + 20;
    }

  }
  itemSpawn() {
    if (this.hp <= 0) {

      //console.log("몬스터의 HP가 0 이하입니다. 아이템 생성합니다.");
      // 아이템 생성 코드 추가
      spawnItem(this.x, this.y);
      // 몬스터를 배열에서 제거
      // monsters.splice(monsters.indexOf(this), 1);
      // 몬스터가 사라졌으므로 아이템을 생성할 필요가 없음
      return;
    }
  }
  shoot() {
    spawnMbullet(this);
  }

}

class Mbullet {
  constructor(monster) {
    this.width = 20;
    this.height = 25;
    this.x = monster.x + monster.width / 2; // 몬스터의 x 좌표 중심에 위치
    this.y = monster.y + monster.height; // 몬스터의 바로 아래에서 생성
    this.speed = 50; // 총알의 속도
    this.attack = 1;
  }

  draw() {
    ctx.drawImage(mbulletImg,this.x, this.y,this.width,this.height);
  }

  update(deltaTime) {
    this.y += this.speed * deltaTime; // 총알을 아래로 이동

    // 총알이 화면을 벗어나면 제거
    if (this.y > canvas.height) {
      this.remove();
    }
  }

  remove() {
    // 총알을 배열에서 제거
    mbullets.splice(mbullets.indexOf(this), 1);
  }
}


//보스

// boss 클래스 생성 

class Boss {
  constructor() {

      this.width = 300;
      this.height = 200;
      this.x = 50;
      this.y = 50;
      this.hp = 10;
      this.speed = 5;
      this.attack = 1;
      this.direction_x = 1;
      this.direction_y = 0;
      this.patten = 0;
  }
  draw() {
    ctx.drawImage(bossImg,this.x, this.y,this.width,this.height);

  }
  drawHP(idx) {
      ctx.fillStyle = "red";
      ctx.fillRect(canvas.width - idx * 40, 10, 30, 30);
      
  }

  // 보스의 움직임 구현 //
  moveBoss() {

    if (this.x > canvas.width - this.width) {
      this.direction_x = -1;
    } else if (this.x < 0) {
      this.direction_x = 1;
      //패턴을 랜덤으로 만들고 33.3% 확률 로 보스가 내려가서 운석을 날림
    } else if (this.x == canvas.width / 2 - this.width / 2) {
      if (this.patten == 2) {
        if (this.direction_x != 0) {

          setTimeout(function () {
            boss.direction_y = 1;

          }, 2000);
        }
        if (this.y > canvas.height / 2) {
          boss.direction_y = -1;
        }
        clearInterval(bulltInterval);
        this.direction_x = 0;
        if (this.direction_y == -1 && this.y == 50) {
          this.direction_y = 0;
          this.direction_x = Math.floor(Math.random() * 2) == 0 ? -1 : 1;
          console.log(this.direction_x);
          this.patten = 0;
          bulltInterval = setInterval(createbossBullet, 300, boss);
        }
      } else {
        this.patten = Math.floor(Math.random() * 3);
      }
    }


    this.x += this.direction_x * this.speed;
    this.y += this.direction_y * this.speed;
  }
}


//총알 클래스 생성 

class bossBullet {
  constructor(boss, speed = 10) {
      this.width = 30;
      this.height = 30;
      this.x = boss.x + boss.width / 2;
      this.y = boss.y + boss.height + 10;
      this.speed = speed;
      this.attack = 1;
  }
  draw() {
      ctx.drawImage(bossBulletImg,this.x, this.y,this.width,this.height);
      //boss 총알에 player hp 감소 
      if (
          player.x < this.x + this.width &&
          player.x + player.width > this.x - this.width &&
          player.y < this.y + this.radius &&
          player.y + player.height > this.y - this.width
      ) {
          // 플레이어의 체력 감소
          player.hp -= 1; // 


          // 보스 총알 제거
          bossBullets.splice(index, 1);
      }
  }
  move() {
    this.y += this.speed;

  }

}


class BossEnemy{
  constructor(){
    this.x= Math.random() * (canvas.width - 30);
    this.y= 0;
    this.width =50;
    this.height= 50;
    this.attack= 1;
    this.color= "#FFA500";

    this.speed = 40 + Math.random() * 20;
  }
  draw() {
    
    ctx.drawImage(bossEnemyImg,this.x, this.y,this.width,this.height);
  }
  move(deltaTime) {
    this.y += this.speed * deltaTime;
  }

}

class Item {
  constructor(x, y) {
    this.type = parseInt(Math.random() * 2);
    this.width = 15;
    this.height = 15;
    this.x = x;
    this.y = y;
    this.speed = 30;
    this.hp = 1;
    this.directionX = Math.random() < 0.5 ? -1 : 1; // 랜덤한 가로 방향 설정 (-1 또는 1)
    this.directionY = Math.random() < 0.5 ? -1 : 1; // 랜덤한 세로 방향 설정 (-1 또는 1)
    
  }

  draw() {
    ctx.drawImage(objectImg[this.type],0, 0,this.width,this.height,this.x,this.y,this.width,this.height);
  }

  update(deltaTime) {
    // 가로 방향으로 이동
    this.x += this.speed * this.directionX * deltaTime;
    // 세로 방향으로 이동
    this.y += this.speed * this.directionY * deltaTime;

    // 가로 경계 검사
    if (this.x < 0 || this.x + this.width > canvas.width) {
      this.directionX *= -1; // 방향 반전
    }
    // 세로 경계 검사
    if (this.y < 0 || this.y + this.height > canvas.height) {
      this.directionY *= -1; // 방향 반전
    }
  }
}

