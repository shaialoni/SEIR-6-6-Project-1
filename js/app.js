const game = document.getElementById('canvas')
const resetButton = document.getElementById('button')

const randX = () => Math.floor((Math.random()* 200))
const randY = () =>  Math.floor((Math.random()* 200))
const randTiming = () => Math.floor((Math.random() * 20000) +1)

const ctx = game.getContext('2d')

let score = 0
let health = 100
game.setAttribute('width', 300)
game.setAttribute('height', 200)

const statusWindow = document.getElementById('status')
const healthBar = document.getElementById('healthBar')
const scoreBoard = document.getElementById('points')

scoreBoard.textContent= `score: ${score}`
healthBar.textContent= `health: ${health}/100`

class Crawler {
    constructor(x,y, color, width, height) {
        this.x = x,
        this.y = y,
        this.color = color,
        this.width = width,
        this.height = height,
        this.alive = false,
        this.speed = 35,
        this.direction = {
            down: false
        },
        this.render = function () {
            ctx.fillStyle = this.color
            ctx.fillRect(this.x, this.y, this.width, this.height)
        }
    }

    bombDrop = function () {
        this.y += this.speed
        if (this.y + this.height >= game.height) {
                this.y = game.height - this.height
        }

    }
}

class PlayerCrawler {
    constructor(x,y, color, width, height, hitPoints) {
        this.x = x,
        this.y = y,
        this.color = color,
        this.width = width,
        this.height = height,
        this.hitPoints = 100
        this.alive = true,
        this.speed = 15,
        this.direction = {
            up: false,
            down: false,
            left: false,
            right: false
        }
    }
    
    setDirection = function (key) {
        //console.log('this is the key that was pressed', key)
        if (key.toLowerCase() == 'w') {this.direction.up = true}
        if (key.toLowerCase() == 'a') {this.direction.left = true}
        if (key.toLowerCase() == 's') {this.direction.down = true}
        if (key.toLowerCase() == 'd') {this.direction.right = true}
        
        
    }
    
    unSetDirection = function (key) {
        //console.log('this is the key that was pressed', key)
        if (key.toLowerCase() == 'w') {this.direction.up = false}
        if (key.toLowerCase() == 'a') {this.direction.left = false}
        if (key.toLowerCase() == 's') {this.direction.down = false}
        if (key.toLowerCase() == 'd') {this.direction.right = false}
        
    }

    movePlayer = function () {
        if (this.direction.up) {
            this.y -= this.speed
            if (this.y <= 0) {
                this.y = 0
            }
        }
        if (this.direction.left) {
            this.x -= this.speed
            if (this.x <= 0) {
                this.x = 0
            }
        }
        if (this.direction.down) {
            this.y += this.speed
            if (this.y + this.height >= game.height) {
                this.y = game.height - this.height
            }
        }
        if (this.direction.right) {
            this.x += this.speed
            if (this.x + this.width >= game.width) {
                this.x = game.width - this.width
            }
        }
    }

    render = function () {
        ctx.fillStyle = this.color
        ctx.fillRect(this.x, this.y, this.width, this.height)
    }
}


let player = new PlayerCrawler(20, 20, 'blue', 20, 20)
let star = new Crawler(randX(), randY(), 'yellow', 5, 5)
let bomb = new Crawler(0, randY(), 'red', 35, 35)
let medPac = new Crawler(randX(), randY(), 'white', 15, 5)

const gameLoop = () => {
    ctx.clearRect(0, 0, game.width, game.height)
   
   
    if (star.alive) {
        star.render()
        detectHit(star)
        
    }    
    if (bomb.alive) {
        bomb.render()
        detectHit(bomb)
    
    } 
    if (medPac.alive) {
        medPac.render()
        detectHit(medPac)
        
    } 
    player.render()
    player.movePlayer()
}

setInterval(() => {star.alive = true}, 500)
setInterval(() => {bomb.alive = true}, 10000)
setInterval(() => {medPac.alive = true}, 25000)

let gameInterval = setInterval(gameLoop, 60)
const stopGameLoop = () => {clearInterval(gameInterval)}

document.addEventListener('DOMContentLoaded', function () {
    gameInterval
})

document.addEventListener('keydown', (e) => {
    player.setDirection(e.key)
})

document.addEventListener('keyup', (e) => {
    if (['w', 'a', 's', 'd'].includes(e.key)) {
        player.unSetDirection(e.key)
    }
    
})

const detectHit = (thing) => {
   
    if (player.x < thing.x + thing.width && player.x + player.width > thing.x && player.y < thing.y + thing.height && player.y + player.height > thing.y) {
        thing.alive = false
        console.log('we have a hit')
        if (thing === star) {
            score += 10
            scoreBoard.textContent= `score: ${score}`
            star = new Crawler(randX(), randY(), 'yellow', 5, 5)
            bomb = new Crawler(randX(), randY(), 'red', `${score+35}`, `${score+35}`)
            if (score === 100) {
                statusWindow.textContent = 'You Won!'
                stopGameLoop()
            } else {
                statusWindow.textContent = 'You found a star!'
            }
        } else if (thing === bomb) {
            score = 0
            player.hitPoints -= 20
            bomb = new Crawler(0, randY(), 'red', `${score+5}`, `${score+5}`)
            if (player.hitPoints <= 0) {
                scoreBoard.textContent= `score: ${score}`
                healthBar.textContent= `health: ${player.hitPoints}`
                statusWindow.textContent = 'Oh no, you stepped on a bomb and now you are dead.'
                stopGameLoop()
            } else {
                scoreBoard.textContent= `score: ${score}`
                healthBar.textContent= `health: ${player.hitPoints}`
                statusWindow.textContent = 'Oh no, you stepped on a bomb!'
            }
        } else if (thing === medPac) {
            if (player.hitPoints < 100) {
                player.hitPoints += 10
                medPac = new Crawler(randX(), randY(), 'white', 15, 5)
                healthBar.textContent= `health: ${player.hitPoints}`
                statusWindow.textContent = 'You found medicine!'
            } else {
                thing.alive = true
            }
        }
    }
}

resetButton.addEventListener('click', function() {
    score = 0
    scoreBoard.textContent= `score: ${score}`
    player.hitPoints = 100
    healthBar.textContent= `health: ${player.hitPoints}`
    statusWindow.textContent = 'Game On!'
    document.addEventListener('DOMContentLoaded', function () {
        gameInterval
    })
    
})

document.addEventListener('keydown', function() {
    
})