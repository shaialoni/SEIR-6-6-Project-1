const game = document.getElementById('canvas')
const resetButton = document.getElementById('button')
const easyButton = document.querySelector('#difButtonEasy')
const harderButton = document.querySelector('#difButtonHarder')
const nutsButton = document.querySelector('#difButtonNuts')
const statusWindow = document.getElementById('status')
const healthBar = document.getElementById('healthBar')
const scoreBoard = document.getElementById('points')

let score = 0
let health = 100

const randX = () => Math.floor((Math.random()* game.width))
const randY = () =>  Math.floor((Math.random()* game.height))

const ctx = game.getContext('2d')

const updateBombTiming = (bt) => {
    setInterval(() => {bomb.alive = true}, bt)
    console.log('BT', bt) 
}

game.setAttribute('width', 300)
game.setAttribute('height', 150)

scoreBoard.textContent= `score: ${score}`
healthBar.textContent= `health: ${health}/100`

class Crawler {
    constructor(x,y, color, width, height, speed) {
        this.x = x,
        this.y = y,
        this.color = color,
        this.width = width,
        this.height = height,
        this.alive = false,
        this.speed = speed,
        this.direction = {
            down: true
        },
        this.render = function () {
            ctx.fillStyle = this.color
            ctx.fillRect(this.x, this.y, this.width, this.height)
        }
    }

    setDirection = function () {
        if (bomb.alive) {this.direction.down = true}
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
        if (key.toLowerCase() == 'w') {this.direction.up = true}
        if (key.toLowerCase() == 'a') {this.direction.left = true}
        if (key.toLowerCase() == 's') {this.direction.down = true}
        if (key.toLowerCase() == 'd') {this.direction.right = true}
    }
    
    unSetDirection = function (key) {
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

let bombSpeed = 10
let player = new PlayerCrawler(20, 20, 'blue', 20, 20)
let star = new Crawler(randX(), randY(), 'yellow', 5, 5, 0)
let bomb = new Crawler(randX(), 0, 'red', 15, 45, bombSpeed)
let medPac = new Crawler(randX(), randY(), 'white', 15, 10, 0)

const gameLoop = () => {
    ctx.clearRect(0, 0, game.width, game.height)
    if (star.alive) {
        star.render()
        detectHit(star)
    }    
    if (bomb.alive) {
        bomb.render()
        bomb.bombDrop()
        detectHit(bomb)
        if (bomb.y >= game.height-50) {
            bomb.alive = false
            bomb.alive = true
            bomb = new Crawler(randX(), 0, 'red', 15, 45, bombSpeed)
        }
    } 
    if (medPac.alive) {
        medPac.render()
        detectHit(medPac)
    } 
    player.render()
    player.movePlayer()
}

const bombTiming = 3000
updateBombTiming(bombTiming)
setInterval(() => {star.alive = true}, 1500)
setInterval(() => {medPac.alive = true}, 25000)

let gameInterval
// let gameInterval = setInterval(gameLoop, 60)
const startGameLoop = () => {
    gameInterval = setInterval(gameLoop, 60)
}
const stopGameLoop = () => {
    clearInterval(gameInterval)
}

document.addEventListener('DOMContentLoaded', function () {
    startGameLoop()
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
            if (score === 100) {
                statusWindow.textContent = 'You Won!'
                stopGameLoop()
            } else {
                statusWindow.textContent = 'You found a star!'
            }
        } else if (thing === bomb) {
            score = 0
            player.hitPoints -= 20
            if (player.hitPoints <= 0) {
                scoreBoard.textContent= `score: ${score}`
                healthBar.textContent= `health: ${player.hitPoints}/100`
                statusWindow.textContent = 'Oh no, you got hit by a bomb and now you are dead.'
                stopGameLoop()
            } else {
                scoreBoard.textContent= `score: ${score}`
                healthBar.textContent= `health: ${player.hitPoints}/100`
                statusWindow.textContent = 'Oh no, you got hit by a bomb!'
            }
        } else if (thing === medPac) {
            if (player.hitPoints < 100) {
                player.hitPoints += 10
                medPac = new Crawler(randX(), randY(), 'white', 15, 10)
                healthBar.textContent= `health: ${player.hitPoints}/100`
                statusWindow.textContent = 'You found medicine!'
            } else {
                thing.alive = true
            }
        }
    }
}

const resetGame = () => {
    score = 0
    scoreBoard.textContent= `score: ${score}`
    player.hitPoints = 100
    healthBar.textContent= `health: ${player.hitPoints}/100`
    statusWindow.textContent = 'Game On!'
    //updateBombTiming(bombTiming)
    bombSpeed = 5
    console.log('bombseed', bombSpeed)
    stopGameLoop()
    //clearInterval(updateBombTiming)
    startGameLoop()
}
resetButton.addEventListener('click', resetGame)

easyButton.addEventListener('click', function () {
    resetGame()
    //const easyBT = 5000
    //updateBombTiming(easyBT)
    bombSpeed = 5
    //console.log('This is bomb timing', easyBT)
    console.log('bomb speed', bombSpeed)
})
harderButton.addEventListener('click', function () {
    resetGame()
    //const hardBT = 2500
    //updateBombTiming(hardBT)
    bombSpeed = 20  
    //console.log('This is bomb timing', hardBT) 
    console.log('var bombspeed', bombSpeed)
})
nutsButton.addEventListener('click', function () {
    resetGame()
    //const nutsBT = 500
    //updateBombTiming(nutsBT)
    bombSpeed = 35
    //console.log('This is bomb timing', nutsBT)
    console.log('bomb speed', bombSpeed)
})