

///////////////////////////플레이어////////////////////////
//////////////// 플레이어 키입력
window.addEventListener("keydown", function (e) {
    if (e.code == "ArrowLeft") {
      move_x = -1 * player.speed * deltaTime;
    } else if (e.code == "ArrowRight") {
      move_x = 1 * player.speed * deltaTime;
    } else if (e.code == "ArrowUp") {
      move_y = -1 * player.speed * deltaTime;
    } else if (e.code == "ArrowDown") {
      move_y = 1 * player.speed * deltaTime;
    }
    if (e.code == "Space") {
      let bullet = new Bullet(player);
      bullet.draw();
      bulletArr.push(bullet);
    }
  });
  //키 땠을경우 움직임 멈춤
  window.addEventListener("keyup", function (e) {
    if (e.code == "ArrowLeft") {
      move_x = 0;
    } else if (e.code == "ArrowRight") {
      move_x = 0;
    } else if (e.code == "ArrowUp") {
      move_y = 0;
    } else if (e.code == "ArrowDown") {
      move_y = 0;
    }
  });
  // 플레이어의 실제 이동 함수
  function playerMove() {
    if (player.x + move_x > 0 && player.x + move_x < widthLimit) {
      player.x += move_x;
    }
    if (player.y + move_y > 0 && player.y + move_y < heightLimit) {
      player.y += move_y;
    }
  }
  
  





  
  ///////////////////몬스터 함수////////////////////////////
  //몬스터 총알 생성
  function spawnMbullet(monster) {
    const mbullet = new Mbullet(monster);
    mbullets.push(mbullet);
  }
  // 적군 업데이트 및 그리기 함수 추가
  function updateMbullets(deltaTime) {
    mbullets.forEach((mbullet) => {
      mbullet.update(deltaTime);
      mbullet.draw();
    });
  }
  
  //몬스터 생성
  function spawnMonster() {
    if (monsters.length < 5) {
      // 몬스터 최대 생성 갯수가 10개 이하일 때만 새로운 몬스터 생성
      const monster = new Monster();
      monsters.push(monster);
    }
  }
  
  // 게임 루프에서 총알 업데이트 호출 추가
  function updateMbullets(deltaTime) {
    mbullets.forEach((mbullet) => {
      mbullet.update(deltaTime);
      mbullet.draw();
    });
  }



/////////////////////////보스
function spawnEnemy() {
  return {
      x: Math.random() * (canvas.width - 30),
      y: 0,
      width: 30,
      height: 30,
      attack: 1,
      color: "#FFA500",
      speed: Math.random() * 2 + 1
  };

}

//보스의 총알 생성 
function createbossBullet(boss) {
  let b = new bossBullet(boss);
  let c = new bossBullet(boss, 1);
  bulletList.push(b);
  bulletList.push(c);

}


////////////////////아이템
function spawnItem(x, y) {
  // 아이템 생성 코드 작성
  let item = new Item(x,y);
  // 아이템을 배열에 추가
  
  items.push(item);
   //console.log(item.type);
}

function updateItems(deltaTime) {
  items.forEach((item) => {
    item.update(deltaTime);
    item.draw();
  });
}













  
  /////////////////////////////////////공통////////////////////////////////
  //충돌감지
  function onCrash(object1, object2) {
    let object1_x = object1.x + object1.width;
    let object2_x = object2.x + object2.width;
    let object1_y = object1.y + object1.height;
    let object2_y = object2.y + object2.height;
    if (object1.x < object2_x && object1_x > object2.x) {
      // 플레이러아 오브젝트가 부딪칠시 플레이어의 hp - 오브젝트의 공격력
      if (object1.y < object2_y && object1_y > object2.y) {
        //코드를 짜면 부딪쳤을때 실행하는 코드
        return true;
      }
    }
    return false;
  }
  //데미지
  function onHit(objectF,objectS){
    console.log(objectF);
    console.log(objectS);
      objectF.hp-=objectS.attack;
      if(objectS.hp){
          objectS.hp-=objectF.attack;
      }
  }
  //델타타임 만들기
  function createDeltaTime() {
    currentTime = performance.now();
    deltaTime = (currentTime - previousTime) / 100;
    previousTime = currentTime;
  }
  
  //게임종료
  function gameOver() {
    cancelAnimationFrame(aniFrame);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(gameoverImg, 0, 0, canvas.width, canvas.height);
    
      
    
    
  }
  
