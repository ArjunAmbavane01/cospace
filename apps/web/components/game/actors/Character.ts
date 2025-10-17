import { Actor, vec, Keys, Engine, CollisionType, ImageSource, SpriteSheet, Animation, range } from "excalibur";

export class Character extends Actor {
    private speed: number = 250; // px/sec
    private spriteSheet?: SpriteSheet;
    private walkUpAnim?: Animation;
    private walkLeftAnim?: Animation;
    private walkDownAnim?: Animation;
    private walkRightAnim?: Animation;
    private idleDownAnim?: Animation;
    private currentDirection: 'up' | 'down' | 'left' | 'right' = 'down';

    constructor() {
        super({
            pos: vec(0, 0),
            width: 64,
            height: 64,
            z: 50,
            collisionType: CollisionType.Active,
        });
    }

    async onInitialize(engine: Engine): Promise<void> {
        const characterImage = new ImageSource('/assets/character/alex.png');
        await characterImage.load();

        const spriteSheet = SpriteSheet.fromImageSource({
            image: characterImage,
            grid: {
                rows: 12,
                columns: 9,
                spriteWidth: 64,
                spriteHeight: 64,
            }
        });

        this.spriteSheet = spriteSheet;

        // animations (row 9=index 8, row 10=index 9, row 11=index 10, row 12=index 11)
        this.walkUpAnim = Animation.fromSpriteSheet(spriteSheet, range(8 * 9, 8 * 9 + 8), 100);
        this.walkLeftAnim = Animation.fromSpriteSheet(spriteSheet, range(9 * 9, 9 * 9 + 8), 100);
        this.walkDownAnim = Animation.fromSpriteSheet(spriteSheet, range(10 * 9, 10 * 9 + 8), 100);
        this.walkRightAnim = Animation.fromSpriteSheet(spriteSheet, range(11 * 9, 11 * 9 + 8), 100);

        // Idle animation (first frame of walk down)
        this.idleDownAnim = Animation.fromSpriteSheet(spriteSheet, [10 * 9], 100);

        // Set initial animation
        this.graphics.use(this.idleDownAnim);
    }

    onPreUpdate(engine: Engine, delta: number): void {
        const keyboard = engine.input.keyboard;
        let velocity = vec(0, 0);

        if (keyboard.isHeld(Keys.W) || keyboard.isHeld(Keys.Up)) {
            velocity.y = -1;
            this.currentDirection = 'up';
            this.idleDownAnim = Animation.fromSpriteSheet(this.spriteSheet!, [8 * 9], 100);
        }
        if (keyboard.isHeld(Keys.S) || keyboard.isHeld(Keys.Down)) {
            velocity.y = 1;
            this.currentDirection = 'down';
            this.idleDownAnim = Animation.fromSpriteSheet(this.spriteSheet!, [10 * 9], 100);
        }
        if (keyboard.isHeld(Keys.A) || keyboard.isHeld(Keys.Left)) {
            velocity.x = -1;
            this.currentDirection = 'left';
            this.idleDownAnim = Animation.fromSpriteSheet(this.spriteSheet!, [9 * 9], 100);
        }
        if (keyboard.isHeld(Keys.D) || keyboard.isHeld(Keys.Right)) {
            velocity.x = 1;
            this.currentDirection = 'right';
            this.idleDownAnim = Animation.fromSpriteSheet(this.spriteSheet!, [11 * 9], 100);
        }

        // Normalize diagonal movement
        if (velocity.x !== 0 && velocity.y !== 0) {
            velocity = velocity.normalize();
        }

        this.vel = velocity.scale(this.speed);

        // Update animation based on movement
        if (velocity.x !== 0 || velocity.y !== 0) {
            // Character is moving, play walk animation
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
            // Character is idle
            if (this.idleDownAnim) this.graphics.use(this.idleDownAnim);
        }
    }
}