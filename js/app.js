const game = document.getElementById('canvas')

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

class PlayerCrawler {
    constructor(x,y, color, width, height, hitPoints) {
        this.x = x,
        this.y = y,
        this.color = color,
        this.width = width,
        this.height = height,
        this.hitPoints = 100
        this.alive = true,
        this.render = function () {
            ctx.fillStyle = this.color
            ctx.fillRect(this.x, this.y, this.width, this.height)
        }
    }
}
class Crawler {
    constructor(x,y, color, width, height) {
        this.x = x,
        this.y = y,
        this.color = color,
        this.width = width,
        this.height = height,
        this.alive = false,
        this.render = function () {
            ctx.fillStyle = this.color
            ctx.fillRect(this.x, this.y, this.width, this.height)
        }
    }
}

let player = new PlayerCrawler(20, 20, 'blue', 20, 20)
let star = new Crawler(randX(), randY(), 'yellow', 5, 5)
let bomb = new Crawler(randX(), randY(), 'red', 75, 75)
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
    
}

setInterval(() => {star.alive = true}, 2500)
setInterval(() => {bomb.alive = true}, 10000)
setInterval(() => {medPac.alive = true}, 25000)

let gameInterval = setInterval(gameLoop, 60)
const stopGameLoop = () => {clearInterval(gameInterval)}

document.addEventListener('DOMContentLoaded', function () {
    document.addEventListener('keydown', movementHandler)
    gameInterval
})

const movementHandler = (e) => {
    switch (e.keyCode) {
        case (87,38):
            player.y -= 10
            break
        case (65,37):
            player.x -= 10
            break
        case (83,40):
            player.y += 10
            break
        case (68,39):
            player.x += 10
            break 
    }
}

const detectHit = (thing) => {
   
    if (player.x < thing.x + thing.width && player.x + player.width > thing.x && player.y < thing.y + thing.height && player.y + player.height > thing.y) {
        thing.alive = false
        console.log('we have a hit')
        if (thing === star) {
            score += 10
            star = new Crawler(randX(), randY(), 'yellow', 5, 5)
            bomb = new Crawler(randX(), randY(), 'red', `${score+35}`, `${score+35}`)
            if (score === 100) {
                statusWindow.textContent = 'You Won!'
                stopGameLoop()
            } else {
                scoreBoard.textContent= `score: ${score}`
                statusWindow.textContent = 'You found a star!'
            }
        } else if (thing === bomb) {
            score = 0
            player.hitPoints -= 20
            bomb = new Crawler(randX(), randY(), 'red', `${score+35}`, `${score+35}`)
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