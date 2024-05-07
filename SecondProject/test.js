document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");
  
    // 플레이어 설정
    const player = {
      x: canvas.width / 2,
      y: canvas.height - 30,
      width: 50,
      height: 50,
      color: "#0095DD",
      speed: 5
    };
  
    // 총알 배열
    const bullets = [];
  
    // 마우스 이벤트 감지
    document.addEventListener("mousemove", (event) => {
      const mouseX = event.clientX - canvas.offsetLeft;
      player.x = mouseX - player.width / 2;
    });
  
    document.addEventListener("click", () => {
      bullets.push({ x: player.x + player.width / 2, y: player.y, radius: 5, speed: 8, color: "#FF0000" });
    });
  
    // 보스 설정
    const boss = {
      x: canvas.width / 2 - 50,
      y: 30,
      width: 100,
      height: 100,
      color: "#FF6347",
      speed: 2
    };
  
    // 적 생성 함수
    function spawnEnemy() {
      return {
        x: Math.random() * (canvas.width - 30),
        y: 0,
        width: 30,
        height: 30,
        color: "#FFA500",
        speed: Math.random() * 2 + 1
      };
    }
  
    // 적 배열
    const enemies = [];
  
    // 게임 루프
    function gameLoop() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
  
      // 플레이어 그리기
      ctx.fillStyle = player.color;
      ctx.fillRect(player.x, player.y, player.width, player.height);
  
      // 총알 그리기
      bullets.forEach((bullet, index) => {
        ctx.fillStyle = bullet.color;
        ctx.beginPath();
        ctx.arc(bullet.x, bullet.y, bullet.radius, 0, Math.PI * 2);
        ctx.fill();
  
        // 총알 이동
        bullet.y -= bullet.speed;
  
        // 총알이 캔버스 밖으로 나갔을 때 제거
        if (bullet.y < 0) {
          bullets.splice(index, 1);
        }
      });
  
      // 보스 그리기
      ctx.fillStyle = boss.color;
      ctx.fillRect(boss.x, boss.y, boss.width, boss.height);
  
      // 적 생성 및 이동
      if (Math.random() < 0.02) {
        enemies.push(spawnEnemy());
      }
  
      enemies.forEach((enemy, index) => {
        ctx.fillStyle = enemy.color;
        ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
  
        // 적 이동
        enemy.y += enemy.speed;
  
        // 적이 캔버스 아래쪽으로 나갔을 때 제거
        if (enemy.y > canvas.height) {
          enemies.splice(index, 1);
        }
  
        // 플레이어와 적 충돌 검사
        if (
          player.x < enemy.x + enemy.width &&
          player.x + player.width > enemy.x &&
          player.y < enemy.y + enemy.height &&
          player.y + player.height > enemy.y
        ) {
          alert("Game Over!");
          document.location.reload();
        }
  
        // 총알과 적 충돌 검사
        bullets.forEach((bullet, bulletIndex) => {
          if (
            bullet.x < enemy.x + enemy.width &&
            bullet.x > enemy.x &&
            bullet.y < enemy.y + enemy.height &&
            bullet.y > enemy.y
          ) {
            enemies.splice(index, 1);
            bullets.splice(bulletIndex, 1);
          }
        });
      });
  
      // 보스와 플레이어 충돌 검사
      if (
        player.x < boss.x + boss.width &&
        player.x + player.width > boss.x &&
        player.y < boss.y + boss.height &&
        player.y + player.height > boss.y
      ) {
        alert("Game Over!");
        document.location.reload();
      }
  
      requestAnimationFrame(gameLoop);
    }
  
    gameLoop();
  });