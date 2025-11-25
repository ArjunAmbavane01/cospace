import { Actor, vec, CollisionType, ImageSource, SpriteSheet, Animation, range, Canvas, Vector } from "excalibur";
import { PlayerDirection } from "@/lib/validators/game";
import { ArenaUser } from "@/lib/validators/arena";

export class Character extends Actor {
    private spriteSheet?: SpriteSheet;
    private userName: string;
    private userId: string;
    private userImage: string | null | undefined;
    private walkUpAnim?: Animation;
    private walkLeftAnim?: Animation;
    private walkDownAnim?: Animation;
    private walkRightAnim?: Animation;
    private idleUpAnim?: Animation;
    private idleDownAnim?: Animation;
    private idleLeftAnim?: Animation;
    private idleRightAnim?: Animation;
    private currentDirection: PlayerDirection = "down";
    private nameActor?: Actor;
    private targetPosition?: Vector;
    private interpolationSpeed = 0.3;
    private isMoving = false;

    constructor(user: ArenaUser) {
        super({
            pos: vec(0, 0),
            anchor: vec(0.5, 1),
            width: 32,
            height: 20,
            z: 50,
            collisionType: CollisionType.Active,
        });
        this.userId = user.id;
        this.userName = user.name;
        this.userImage = user.image;
    }

    async onInitialize(): Promise<void> {
        const characterImage = new ImageSource('/assets/characters/Alex.png');
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

        this.graphics.use(this.idleDownAnim);
        this.createNameLabel();
    }

    onPreUpdate(): void {
        if (!this.spriteSheet) return;

        if (this.targetPosition) {
            const distance = this.pos.distance(this.targetPosition);
            
            if (distance > 1) { // Only interpolate if distance is significant
                const direction = this.targetPosition.sub(this.pos).normalize();
                const moveAmount = Math.min(distance, distance * this.interpolationSpeed);
                this.pos = this.pos.add(direction.scale(moveAmount));
            } else {
                this.pos = this.targetPosition;
                this.targetPosition = undefined;
            }
        }

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

    setCurrentDirection(dir: PlayerDirection): void {
        this.currentDirection = dir;
    }

    setIsMoving(moving: boolean): void {
        this.isMoving = moving;
    }

    setTargetPosition(pos: Vector): void {
        this.targetPosition = pos;
    }

    private createNameLabel(): void {
        const padding = 8;
        const fontSize = 14;
        const textHeight = 20;

        const textWidth = this.userName.length * (fontSize * 0.6);
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
                ctx.fillText(this.userName, boxWidth / 2, boxHeight / 2);
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
}