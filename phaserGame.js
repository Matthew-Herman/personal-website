var config = {
    type: Phaser.WEBGL,
    width: 800,
    height: 600,
    physics: {
        default: 'impact',
        impact: {
            setBounds: {
                x: 0,
                y: 0,
                width: 1600,
                height: 1200,
                thickness: 32
            }
        },
    },
    scene: {
        preload: preload,
        create: create,
        update: update,
        extend: {
                    player: null,
                    // reticle: null,
                    moveKeys: null,
                    bullets: null,
                    lastFired: 0,
                    time: 0
                }
    }
};

var game = new Phaser.Game(config);
var reticle;

//Bullet class
var Bullet = new Phaser.Class({

    Extends: Phaser.GameObjects.Image,

    initialize:

    //Set the image file for the bullet and initial variables
    function Bullet (scene)
    {
        Phaser.GameObjects.Image.call(this, scene, 0, 0, 'bullet');

        this.speed = 3;
        this.born = 0;
        this.direction = 0;
        this.xSpeed = 0;
        this.ySpeed = 0;
    },

    //Define the fire function which will be called on left mouse click
    fire: function (player, pointer)
    {
        //Initial position of bullet is player's position
        this.setPosition(player.x, player.y);

        //Calculate trajectory of bullet so that it moves from player towards pointer
        this.direction = Math.atan( (reticle.x-this.x) / (reticle.y-this.y));

        if (reticle.y > this.y)
        {
            this.xSpeed = this.speed*Math.sin(this.direction);
            this.ySpeed = this.speed*Math.cos(this.direction);
        }
        else
        {
            this.xSpeed = -this.speed*Math.sin(this.direction);
            this.ySpeed = -this.speed*Math.cos(this.direction);
        }

        //Offset so bullet appears to leave the end of the gun
        //NOT IMPLEMENTED CURRENTLY

        //Take angling of the bullet from rotation of player
        this.rotation = player.rotation;

        //Time since new bullet spawned
        this.born = 0;
    },

    //Updates the position of the bullet each cycle
    update: function (time, delta)
    {
        this.x += this.xSpeed * delta;
        this.y += this.ySpeed * delta;

        this.born += delta;

        if (this.born > 1000)
        {
            this.setActive(false);
            this.setVisible(false);
        }
    }

});

//Reticle class

//Player class

function preload ()
{
    //Load in player spritesheet
    this.load.spritesheet('player_handgun', 'assets/sprites/player_handgun.png',
        { frameWidth: 66, frameHeight: 60 }
    );

    //Load in bullet
    this.load.image('bullet', 'assets/sprites/bullet6.png');

    //Load in Reticle
    this.load.image('target', 'assets/sprites/target.png');

    //Load in background
    this.load.image('background', 'assets/sprites/background.jpg');

}

function create ()
{
    //create background
    var background = this.add.image(0, 0, 'background');
    background.setOrigin(0, 0);
    background.setDisplaySize(1600, 1200);

    //This group allows Bullet objects to be recycled
    this.bullets = this.add.group({ classType: Bullet, runChildUpdate: true });

    //Create player sprite
    player = this.impact.add.sprite(400, 300, 'player_handgun').setDepth(1);
    player.setOrigin(0.5, 0.5);
    player.setDisplaySize(132, 120);
    player.setMaxVelocity(500).setFriction(2200, 2200).setPassive();

    //Create reticle sprite
    reticle = this.add.sprite(400, 300, 'target').setDepth(1);
    reticle.setOrigin(0.5, 0.5);
    reticle.setDisplaySize(25, 25);
    reticle.setScrollFactor(1, 1); //Makes reticle move with camera

    //Sets the bound for the camera and to follow reticle
    this.cameras.main.setBounds(0, 0, 1600, 1200);

    //Creates object for input with WASD kets
    moveKeys = this.input.keyboard.addKeys({

        'up': Phaser.Input.Keyboard.KeyCodes.W,
        'down': Phaser.Input.Keyboard.KeyCodes.S,
        'left': Phaser.Input.Keyboard.KeyCodes.A,
        'right': Phaser.Input.Keyboard.KeyCodes.D

    });

    //Enables movement of player with WASD keys
    this.input.keyboard.on('keydown_W', function (event) {
        player.setAccelerationY(-800);
    });

    this.input.keyboard.on('keydown_S', function (event) {
        player.setAccelerationY(800);
    });

    this.input.keyboard.on('keydown_A', function (event) {
        player.setAccelerationX(-800);
    });

    this.input.keyboard.on('keydown_D', function (event) {
        player.setAccelerationX(800);
    });

    //Stops player acceleration on uppress of WASD keys
    this.input.keyboard.on('keyup_W', function (event) {
        if (moveKeys['down'].isUp) {
            player.setAccelerationY(0);
        }
    });

    this.input.keyboard.on('keyup_S', function (event) {
        if (moveKeys['up'].isUp) {
            player.setAccelerationY(0);
        }
    });

    this.input.keyboard.on('keyup_A', function (event) {
        if (moveKeys['right'].isUp) {
            player.setAccelerationX(0);
        }
    });

    this.input.keyboard.on('keyup_D', function (event) {
        if (moveKeys['left'].isUp) {
            player.setAccelerationX(0);
        }
    });

    //Creates a bullet upon left click of mouse
    this.input.on('pointerdown', function (pointer) {

        var bullet = this.bullets.get();
        bullet.setActive(true);
        bullet.setVisible(true);

        if (bullet) {
            bullet.fire(player, pointer);

            //Sets maximum rate of fire of bullet
            this.lastFired = this.time + 10000;
        }

    }, this);

    // Pointer lock will only work after mousedown
    game.canvas.addEventListener('mousedown', function () {

        game.input.mouse.requestPointerLock();

    });

    // Exit pointer lock when Q or escape is pressed.
    this.input.keyboard.on('keydown_Q', function (event) {

        if (game.input.mouse.locked) {

            game.input.mouse.releasePointerLock();
        }

    }, 0, this);

    //Move reticle upon locked pointer move
    this.input.on('pointermove', function (pointer) {

        if (this.input.mouse.locked) {

            reticle.x += pointer.movementX;
            reticle.y += pointer.movementY;

        }

    }, this);

    //Create bounds for reticle sprite
    // var spriteBounds = Phaser.Geom.Rectangle.Inflate(Phaser.Geom.Rectangle.Clone(this.physics.world.bounds), -100, -100);

}



function update (time, delta)
{
    //Rotates player to face towards reticle
    player.rotation = Phaser.Math.Angle.Between(player.x, player.y, reticle.x, reticle.y);

    // console.log(this.cameras.main.scrollX);
    // Implement target-focus camera with physics smoothing
    // Camera position is average between reticle and player positions

    // Sets camera scroll position to average between player and reticle
    this.cameras.main.scrollX = ((player.x+reticle.x)/2)-400;
    this.cameras.main.scrollY = ((player.y+reticle.y)/2)-300;

    //Set camera zooms
    this.cameras.main.zoom = 0.7;
}
