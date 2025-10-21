import { Actor, vec, ImageSource, Sprite, CollisionType,} from "excalibur";

export class Island extends Actor {
    private baseLayer?: Sprite;
    private foregroundLayer?: Sprite;
    private mapWidth: number;
    private mapHeight: number;

    constructor() {
        super({
            pos: vec(0, 0),
            anchor: vec(0, 0),
            collisionType: CollisionType.Fixed,
            z: 0,
        });

        // temp assignment
        this.mapWidth = 1000;
        this.mapHeight = 1000;
    }

    async onInitialize(): Promise<void> {
        // load base layer
        const baseImage = new ImageSource('/assets/maps/island-base.png');
        await baseImage.load();
        this.mapWidth = baseImage.width;
        this.mapHeight = baseImage.height;
        this.baseLayer = baseImage.toSprite();

        // load foreground layer
        const foregroundImage = new ImageSource('/assets/maps/island-foreground.png');
        await foregroundImage.load();
        this.foregroundLayer = foregroundImage.toSprite();

        this.graphics.use(this.baseLayer);
    }

    getForegroundSprite(): Sprite | undefined {
        return this.foregroundLayer;
    }

    getMapWidth(): number {
        return this.mapWidth;
    }

    getMapHeight(): number {
        return this.mapHeight;
    }
}