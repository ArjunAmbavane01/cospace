import { Actor, vec, Keys, Engine, CollisionType, ImageSource, SpriteSheet, Animation, range, Canvas } from "excalibur";
import { Socket } from "socket.io-client";
import { User } from "better-auth";
import { PlayerDirection } from "@/lib/validators/game";

export class MainCharacter extends Actor {
    private socket: Socket;
    private userName: string;
    private userId: string;
    private userImage: string | undefined | null;
    private speed: number = 280;
    private spriteSheet?: SpriteSheet;
    private walkUpAnim?: Animation;
    private walkLeftAnim?: Animation;
    private walkDownAnim?: Animation;
    private walkRightAnim?: Animation;
    private idleUpAnim?: Animation;
    private idleDownAnim?: Animation;
    private idleLeftAnim?: Animation;
    private idleRightAnim?: Animation;
    private currentDirection: PlayerDirection = "down";
    private playerName: string;
    private nameActor?: Actor;
    private isMoving: boolean = false;

    constructor(socket: Socket, user: User) {
        super({
            pos: vec(0, 0),
            anchor: vec(0.5, 1),
            width: 32,
            height: 32,
            z: 50,
            collisionType: CollisionType.Active,
        });
        this.socket = socket;
        this.userName = user.name;
        this.userId = user.id;
        this.userImage = user.image;
        this.playerName = "You";
    }

    async onInitialize(): Promise<void> {
        const characterImage = new ImageSource('/assets/characters/alex.png');
        await characterImage.load();

        const spriteSheet = SpriteSheet.fromImageSource({
            image: characterImage,
            grid: {
                rows: 12,
                columns: 9,
                spriteWidth: 64,
                spriteHeight: 65,
            }
        });

        this.spriteSheet = spriteSheet;

        // create walking animations
        this.walkUpAnim = Animation.fromSpriteSheet(spriteSheet, range(8 * 9, 8 * 9 + 8), 100);
        this.walkLeftAnim = Animation.fromSpriteSheet(spriteSheet, range(9 * 9, 9 * 9 + 8), 100);
        this.walkDownAnim = Animation.fromSpriteSheet(spriteSheet, range(10 * 9, 10 * 9 + 8), 100);
        this.walkRightAnim = Animation.fromSpriteSheet(spriteSheet, range(11 * 9, 11 * 9 + 8), 100);

        // create idle animations
        this.idleUpAnim = Animation.fromSpriteSheet(spriteSheet, [8 * 9], 100);
        this.idleDownAnim = Animation.fromSpriteSheet(spriteSheet, [10 * 9], 100);
        this.idleLeftAnim = Animation.fromSpriteSheet(spriteSheet, [9 * 9], 100);
        this.idleRightAnim = Animation.fromSpriteSheet(spriteSheet, [11 * 9], 100);

        this.createNameLabel();
        setInterval(() => this.sendPlayerCoordinates(), 100);
    }

    private sendPlayerCoordinates(): void {
        const playerPos = {
            x: this.pos.x,
            y: this.pos.y,
            direction: this.currentDirection,
            isMoving: this.isMoving,
        }
        this.socket.emit("player-pos", {
            userId: this.userId,
            playerPos
        });
    }

    private createNameLabel(): void {
        const padding = 8;
        const fontSize = 14;
        const textHeight = 20;

        const textWidth = this.playerName.length * (fontSize * 0.6);
        const boxWidth = textWidth + padding * 2;
        const boxHeight = textHeight + padding;

        const nameCanvas = new Canvas({
            width: boxWidth,
            height: boxHeight,
            draw: (ctx) => {
                const radius = boxHeight / 2;
                ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';

                ctx.beginPath();
                ctx.roundRect(0, 0, boxWidth, boxHeight, radius);
                ctx.fill();

                ctx.fillStyle = 'white';
                ctx.font = `${fontSize}px Arial`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(this.playerName, boxWidth / 2, boxHeight / 2);
            }
        });

        // Create a child actor for the name label
        this.nameActor = new Actor({
            pos: vec(0, -80), // Position relative to parent
            anchor: vec(0.5, 0.5),
            z: 100
        });

        this.nameActor.graphics.use(nameCanvas);
        this.addChild(this.nameActor);
    }

    onPreUpdate(engine: Engine): void {
        const keyboard = engine.input.keyboard;
        let velocity = vec(0, 0);
        if (!this.spriteSheet) return;
        if (keyboard.isHeld(Keys.W) || keyboard.isHeld(Keys.Up)) {
            velocity.y = -1;
            this.currentDirection = 'up';
        }
        if (keyboard.isHeld(Keys.S) || keyboard.isHeld(Keys.Down)) {
            velocity.y = 1;
            this.currentDirection = 'down';
        }
        if (keyboard.isHeld(Keys.A) || keyboard.isHeld(Keys.Left)) {
            velocity.x = -1;
            this.currentDirection = 'left';
        }
        if (keyboard.isHeld(Keys.D) || keyboard.isHeld(Keys.Right)) {
            velocity.x = 1;
            this.currentDirection = 'right';
        }

        if (velocity.x !== 0 && velocity.y !== 0) velocity = velocity.normalize();

        this.vel = velocity.scale(this.speed);
        this.isMoving = velocity.x !== 0 || velocity.y !== 0;

        if (this.isMoving) {
            switch (this.currentDirection) {
                case 'up':
                    if (this.walkUpAnim) this.graphics.use(this.walkUpAnim);
                    break;
                case 'down':
                    if (this.walkDownAnim) this.graphics.use(this.walkDownAnim);
                    break;
                case 'left':
                    if (this.walkLeftAnim) this.graphics.use(this.walkLeftAnim);
                    break;
                case 'right':
                    if (this.walkRightAnim) this.graphics.use(this.walkRightAnim);
                    break;
            }
        } else {
            switch (this.currentDirection) {
                case 'up':
                    if (this.idleUpAnim) this.graphics.use(this.idleUpAnim);
                    break;
                case 'down':
                    if (this.idleDownAnim) this.graphics.use(this.idleDownAnim);
                    break;
                case 'left':
                    if (this.idleLeftAnim) this.graphics.use(this.idleLeftAnim);
                    break;
                case 'right':
                    if (this.idleRightAnim) this.graphics.use(this.idleRightAnim);
                    break;
            }
        }
    }
}