////////////////////////////////////게임 화면 설정//////////////////////////////////
const canvas = document.getElementById("canvas"); //캔버스
const ctx = canvas.getContext("2d"); //2d
canvas.width = 800; //화면 넓이
canvas.height = window.innerHeight; //화면 높이
const backgroundImg = new Image();
backgroundImg.src='./background.jpg';
////////////////////////////////////게임 오버 화면 설정//////////////////////////////

const gameoverImg = new Image();
gameoverImg.src='./gameover.jpg'


/////////////////////////////////////변수 선언////////////////////////////////////////////////
//이미지 불러오기


////델타타임
let deltaTime;
let previousTime = performance.now();
/////플레이어
let player = new Player(); //플레이어 객체
let move_x = 0; //플레이어 x축 이동방향
let move_y = 0; // 플레이어 y축 이동방향
let bulletArr = []; // 플레이어 탄환 관리
let widthLimit = canvas.width - player.width; //플레이어 이동가능 가로 최대값
let heightLimit = canvas.height - player.height; // 플레이어 이동가능 세로 최대값
let invincibility = false; //무적시간
////////몬스터///////////////////////////
const mbullets = []; // 몬스터 총알 배열
// 게임 루프에서 적군 생성 및 업데이트
const monsters = []; // 적군 배열
let monsterKill = 0;  //몬스터 킬 카운트
let monsterInterval;  //몬스터 소환 interval
///////보스////////////////////////
const enemies = [];
let bulletList = [];
let boss = new Boss();
let bossBulletTime = 0;
let bulltInterval;

let bossApear = 5;

//////////////아이템/////////////
let item = new Item();
let items = [];

//requestanimationFrame 담을 변수
let aniFrame;

/********************************************실제반복실행****************************************************** */
function update(currentTime) {
 
  createDeltaTime(); // 델타타임 생성
  ctx.clearRect(0, 0, canvas.width, canvas.height); // 화면 한번 클리어
  ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);
  ///////////////////////////플레이어//////////////////////
  player.draw(); // 플레이어 그리기
  for (let i = 0; i < player.hp; i++) {
    player.drawHp(i, 40); // 플레이어 체력 그리기
  }
  bulletArr.forEach((bullet, i) => {
    bullet.move(); // 플레이어 총알


    if (onCrash(bullet, boss) && monsterKill >= bossApear) {
      onHit(boss, bullet);
      bulletArr.splice(i, 1);
    }
    //몬스터와 충돌
    monsters.forEach((monster, j) => {
      if (onCrash(bullet, monster)) {
        onHit(monster, bullet);
        bulletArr.splice(i, 1);
        if (monster.hp <= 0) {
          monster.itemSpawn();
          monsters.splice(j, 1);
          monsterKill++;
        }
      }
    });
  });
  playerMove();
  ///////////////////////////플레이어//////////////////////
  ////////////////////////////몬스터//////////////////////

  if (monsterKill <= bossApear) {
    // 적군 업데이트 및 그리기
    monsters.forEach((monster, idx) => {
      monster.update(deltaTime);
      monster.draw();
      //충돌감지
      if (onCrash(player, monster)) {
        onHit(monster, player);
        //monster.onHit(player);
        if (monster.hp <= 0) {
          monsters.splice(idx, 1);
          monsterKill++;
        }

      }
    });

    // 총알 업데이트 및 그리기

    updateMbullets(deltaTime);
    mbullets.forEach((mbullet, idx) => {
      if (onCrash(player, mbullet)) {
        onHit(mbullet, player);
        mbullets.splice(idx, 1);
      }
    });
  } else {
    ///////////////////////////몬스터//////////////////////

    //////////////////////////보스////////////////////////
    monsters.length=0;
    if (!bulltInterval) {

      bulltInterval = setInterval(createbossBullet, 300, boss); // 보스 총알 생성
    }
    clearInterval(monsterInterval);
    boss.draw();
    boss.moveBoss();
    for (let i = 0; i < boss.hp; i++) {
      boss.drawHP(i);
    }
    if (onCrash(player, boss)) {
      if (invincibility == false) {
        onHit(player, boss);
        invincibility = true;
        setTimeout(function () {
          invincibility = false;
        }, 1000);
      }
    }
    // 총알 생성 및 총알과 플레이어의 충돌 onhit () 과정
    bulletList.forEach((item, index) => {
      item.draw();
      item.move();
      if (onCrash(player, item)) {
        if (invincibility == false) {
          onHit(player, item);
          invincibility = true;
          setTimeout(function () {
            invincibility = false;
          }, 1000);
        }
      }
    });

    //운석이 보스가 멈춰있는 패턴에서 만 랜덤으로 등장
    if (Math.random() < 0.02 && boss.patten == 2) {
      let bossEnemy = new BossEnemy();
      enemies.push(bossEnemy);
    }
    enemies.forEach((enemy, index) => {
      enemy.move(deltaTime);
      enemy.draw();
      // 운석이 캔버스 아래쪽으로 나갔을 때 제거
      if (enemy.y >= canvas.height) {
        enemies.splice(index, 1);
      }
      //운석과 플레이어의 충돌 onhit () 과정
      if (onCrash(player, enemy)) {
        if (invincibility == false) {
          onHit(player, enemy);
          invincibility = true;
          setTimeout(function () {
            invincibility = false;
          }, 1000);
        }
      }
    });
  }
    //////////////////아이템
    updateItems(deltaTime);
    items.forEach((item, idx) => {
      if (onCrash(player, item)) {
        if (item.type == 0) {
          player.hp += 1;
          items.splice(idx, 1);
        } else {
          player.attack += 1;
          console.log(player);
          items.splice(idx, 1);
        }
      }
    })



  aniFrame = requestAnimationFrame(update);
  if (player.hp <= 0 || boss.hp <= 0) {
    gameOver();
  }
}
/********************************************실제반복실행****************************************************** */

//////////////////////////////함수 실행
requestAnimationFrame(update);


spawnMonster(); // 최초 적군 생성
monsterInterval = setInterval(spawnMonster, 1000); // 1초마다 적군 생성
// spawnItem();
