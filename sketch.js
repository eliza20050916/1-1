let balls = [];
let fishes = [];
let song;
let amplitude;
let flowerPositions = []; // 儲存花朵位置

function preload() {
  song = loadSound('midnight-quirk-255361.mp3'); // 載入音樂檔案
}

function setup() { //設定
  createCanvas(windowWidth, windowHeight); //建立畫布, 寬高為視窗的寬高
  amplitude = new p5.Amplitude(); // 創建振幅分析器
  song.play(); // 播放音樂

  // 初始化花朵位置
  for (let i = 0; i < 50; i++) {
    flowerPositions.push({
      x: random(width),
      y: random(height - 50, height),
    });
  }

  for (let i = 0; i < 10; i++) {
    balls.push(new Ball(random(width), random(height), random(2, 5), random(2, 5)));
    fishes.push(new Fish(random(width), random(height), random(1, 3), random(1, 3)));
  }
}

function draw() {
  drawAquariumBackground(); // 畫水族箱背景
  let level = amplitude.getLevel(); // 獲取當前音樂的振幅
  for (let ball of balls) {
    ball.move();
    ball.display(level); // 傳遞振幅
  }
  for (let fish of fishes) {
    fish.move();
    fish.display(level); // 傳遞振幅
  }
}

function drawAquariumBackground() {
  background("#87CEEB"); // 天藍色背景
  noStroke();

  // 使用靜止的花朵位置
  for (let pos of flowerPositions) {
    drawFlower(pos.x, pos.y);
  }
}

function drawGardenBackground() {
  // 畫天空
  background("#87CEEB"); // 天藍色背景

  // 移除草地，改為生成花朵
  for (let i = 0; i < 50; i++) {
    let flowerX = random(width);
    let flowerY = random(height - 100, height); // 隨機生成花朵位置
    drawFlower(flowerX, flowerY);
  }
}

// 新增畫花朵的函數
function drawFlower(x, y) {
  push();
  translate(x, y);

  // 畫花莖
  stroke("#006400"); // 深綠色
  strokeWeight(3);
  line(0, 0, 0, 30);

  // 畫花瓣
  noStroke();
  fill("#FF69B4"); // 粉紅色
  for (let angle = 0; angle < TWO_PI; angle += PI / 4) {
    let petalX = cos(angle) * 10;
    let petalY = sin(angle) * 10;
    ellipse(petalX, petalY, 15, 25);
  }

  // 畫花心
  fill("#FFD700"); // 金黃色
  ellipse(0, 0, 15, 15);

  pop();
}

class Fish {
  constructor(x, y, xspeed, yspeed) {
    this.x = x;
    this.y = y;
    this.xspeed = xspeed;
    this.yspeed = yspeed;
    this.angle = 0;
    this.size = 1; // 初始大小
    this.color = this.randomColor(); // 隨機顏色
  }

  move() {
    this.x += this.xspeed;
    this.y += this.yspeed;

    if (this.x > width || this.x < 0) {
      this.xspeed *= -1;
    }

    if (this.y > height || this.y < 0) {
      this.yspeed *= -1;
    }

    this.angle = atan2(this.yspeed, this.xspeed);

    // 根據滑鼠位置調整大小
    let distance = dist(mouseX, mouseY, this.x, this.y);
    this.size = map(distance, 0, width, 2, 0.5); // 距離越近，魚越大
  }

  display(level) {
    push();
    translate(this.x, this.y);
    rotate(this.angle);
    scale(this.size); // 根據大小縮放魚
    stroke(0);
    fill(this.color); // 使用隨機顏色

    // 畫魚的身體
    beginShape();
    vertex(0, -50 * (1 + level * 2)); // 根據振幅調整魚身
    vertex(100 * (1 + level * 2), 0); // 根據振幅調整魚身
    vertex(0, 50 * (1 + level * 2)); // 根據振幅調整魚身
    vertex(-20, 20); // 魚尾
    vertex(-50, 0); // 魚尾
    vertex(-20, -20); // 魚尾
    vertex(0, -50 * (1 + level * 2)); // 根據振幅調整魚身
    endShape(CLOSE);

    // 畫魚的尾巴
    beginShape();
    vertex(-50, 0); // 魚尾
    vertex(-80, -20); // 魚尾上
    vertex(-100, 0); // 魚尾尖
    vertex(-80, 20); // 魚尾下
    vertex(-50, 0); // 魚尾
    endShape(CLOSE);

    // 畫魚的眼睛
    fill(0);
    ellipse(70, 0, 10, 10); // 魚眼

    // 添加陰影效果
    fill(0, 50);
    ellipse(70, 5, 10, 10); // 魚眼陰影
    pop();
  }

  randomColor() {
    // 限制顏色為指定的色系
    const colors = ['#e76f51', '#2a9d8f', '#264653'];
    return color(random(colors));
  }
}

class Ball {
  constructor(x, y, xspeed, yspeed) {
    this.x = x;
    this.y = y;
    this.xspeed = xspeed;
    this.yspeed = yspeed;
    this.color = this.randomColor();
  }

  move() {
    this.x += this.xspeed;
    this.y += this.yspeed;

    if (this.x > width || this.x < 0) {
      this.xspeed *= -1;
      this.color = this.randomColor();
    }

    if (this.y > height || this.y < 0) {
      this.yspeed *= -1;
      this.color = this.randomColor();
    }
  }

  display(level) {
    fill(this.color);
    noStroke();
    this.drawStar(this.x, this.y, 20 * (1 + level * 2), 40 * (1 + level * 2), 5); // 繪製星星

    // 添加陰影效果
    fill(0, 50);
    this.drawStar(this.x + 5, this.y + 5, 20 * (1 + level * 2), 40 * (1 + level * 2), 5); // 星星陰影
  }

  drawStar(x, y, radius1, radius2, npoints) {
    let angle = TWO_PI / npoints;
    let halfAngle = angle / 2.0;
    beginShape();
    for (let a = 0; a < TWO_PI; a += angle) {
      let sx = x + cos(a) * radius2;
      let sy = y + sin(a) * radius2;
      vertex(sx, sy);
      sx = x + cos(a + halfAngle) * radius1;
      sy = y + sin(a + halfAngle) * radius1;
      vertex(sx, sy);
    }
    endShape(CLOSE);
  }

  randomColor() {
    // 限制顏色為指定的色系
    const colors = ['#fb8500', '#ffb703', '#023047', '#219ebc', '#8ecae6'];
    return color(random(colors));
  }
}