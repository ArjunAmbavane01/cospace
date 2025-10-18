import { Actor, vec, CollisionType } from "excalibur";

export class CollisionLayer extends Actor {
    private tileSize: number;
    private mapWidth: number;
    private collisionMap: number[];

    constructor(
        collisionMap: number[],
        mapWidth: number,
        tileSize: number = 32,
        offsetX: number = 0,
        offsetY: number = 0,
    ) {
        super({
            pos: vec(offsetX, offsetY),
            anchor: vec(0, 0),
            z: 60,
        });

        this.collisionMap = collisionMap;
        this.mapWidth = mapWidth;
        this.tileSize = tileSize;
    }

    onInitialize(): void {
        for (let i = 0; i < this.collisionMap.length; i++) {
            const isCollisionBlock = this.collisionMap[i] === 34774;
            if (isCollisionBlock) {
                const col = i % this.mapWidth;
                const row = Math.floor(i / this.mapWidth);

                // pos relative to island
                const x = col * this.tileSize;
                const y = row * this.tileSize;

                const collisionTile = new Actor({
                    pos: vec(x, y),
                    anchor: vec(0, 0),
                    width: this.tileSize,
                    height: this.tileSize,
                    collisionType: CollisionType.Fixed,
                });
                this.addChild(collisionTile);
            }
        }
    }
}