const canvas = document.getElementById("canvas")
const ctx = canvas.getContext('2d')

let friction = 0.1;
let LEFT, RIGHT, UP, DOWN

const BallList = [];


class Vector{
    constructor(x, y){
        this.x = x;
        this.y = y;
    }

    add(v){
        return new Vector(this.x+v.x, this.y+v.y);
    }

    subtr(v){
        return new Vector(this.x-v.x, this.y-v.y);
    }

    mag(){
        return Math.sqrt(this.x**2 + this.y**2)
    }

    mult(n){
        return new Vector(this.x*n, this.y*n);
    }
    normal(){
        return new Vector(-this.y, this.x).unit();
    }
    unit(){
        if(this.mag() === 0){
            return new Vector(0,0);
        } else {
            return new Vector(this.x/this.mag(), this.y/this.mag());
        }
    }
    drawVec(start_x, start_y, n, color){
        ctx.beginPath();
        ctx.moveTo(start_x, start_y);
        ctx.lineTo(start_x + this.x * n, start_y + this.y * n);
        ctx.strokeStyle = color;
        ctx.stroke();
        ctx.closePath();
    }
    static dot(v1, v2){
        return v1.x*v2.x + v1.y*v2.y;
    }
}


class Ball {

    constructor(x,y,r){
        this.pos = new Vector(x,y)
        this.r = r
        this.vel = new Vector(0,0)
        this.acc = new Vector(0,0)
        this.acceleration = 1
        this.player =false
        BallList.push(this)
    }
    drawBall()
    {
        ctx.beginPath()
        ctx.arc(this.pos.x, this.pos.y,this.r, 0 ,2*Math.PI)
        ctx.strokeStyle = "black"
        ctx.stroke()
        ctx.fillStyle = `red`
        ctx.fill()
        ctx.closePath()
    }
    display()
    {
        this.vel.drawVec(550,400,10, "green")
        this.acc.unit().drawVec(550,400,50, "blue")
        ctx.beginPath()
        ctx.arc(550, 400,50, 0 ,2*Math.PI)
        ctx.strokeStyle = "black"
        ctx.stroke()
    }
}

function getPlayerInput(b){
    document.addEventListener('keydown', (event) => {
        if (event.key === 'w') { UP = true } 
        else if (event.key === 's') { DOWN = true }   
        else if (event.key === 'a') { LEFT = true } 
        else if (event.key === 'd') { RIGHT = true }
    })
    document.addEventListener('keyup', (event) => {
        if (event.key === 'w') { UP = false } 
        else if (event.key === 's') { DOWN = false }   
        else if (event.key === 'a') { LEFT = false } 
        else if (event.key === 'd') { RIGHT = false }
    })
    if(LEFT){ b.acc.x = -b.acceleration }
    if(UP){ b.acc.y = -b.acceleration }
    if(RIGHT){ b.acc.x = b.acceleration }
    if(DOWN){ b.acc.y = b.acceleration }
    if(!UP && !DOWN){ b.acc.y = 0 }
    if(!RIGHT && !LEFT){ b.acc.x = 0 }


    b.acc = b.acc.unit().mult(b.acceleration);
    b.vel = b.vel.add(b.acc)
    b.vel = b.vel.mult(1-friction)
    b.pos = b.pos.add(b.vel)
}

let distanceVec = new Vector(0,0)


let ball = new Ball(100,100,50)
let ball2 = new Ball(300,250,40)
let ball3 = new Ball(500,250,40)
ball.player = true

function coll_detection(b1, b2){
    if(b1.r + b2.r >= b2.pos.subtr(b1.pos).mag()){
        return true
    }else{
        return false
    }
}

function penetration_resolution(b1, b2){
    let dist = b1.pos.subtr(b2.pos);
    let pen_depth = b1.r + b2.r - dist.mag();
    let pen_res = dist.unit().mult(pen_depth/2);
    b1.pos = b1.pos.add(pen_res);
    b2.pos = b2.pos.add(pen_res.mult(-1));
}

function gameLoop() {
    ctx.clearRect(0,0, canvas.clientWidth, canvas.clientHeight)
    BallList.forEach((b, index) => {
        b.drawBall()
        if (b.player){
            getPlayerInput(b)
        }
        b.display()
        for(let i = index+1; i<BallList.length; i++){
            if(coll_detection(BallList[index], BallList[i]))
            {
                penetration_resolution(BallList[index], BallList[i])
            }
        }
    })
    
    requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);