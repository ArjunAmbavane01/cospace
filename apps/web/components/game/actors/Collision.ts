import { Actor, vec, CollisionType, Color, Rectangle, Engine } from "excalibur";

export class CollisionLayer extends Actor {
    private tileSize: number;
    private mapWidth: number;
    private collisionMap: number[];

    constructor(collisionMap: number[], mapWidth: number, tileSize: number = 64) {
        super({
            pos: vec(0, 0),
            anchor: vec(0, 0),
            z: 60, // Above character to visualize
        });

        this.collisionMap = collisionMap;
        this.mapWidth = mapWidth;
        this.tileSize = tileSize;
    }

    onInitialize(engine: Engine): void {
        const mapHeight = Math.ceil(this.collisionMap.length / this.mapWidth);
        let collisionCount = 0;
        let walkableCount = 0;

        console.log('Collision Map Info:', {
            totalTiles: this.collisionMap.length,
            mapWidth: this.mapWidth,
            mapHeight: mapHeight,
            tileSize: this.tileSize,
            expectedMapPixelWidth: this.mapWidth * this.tileSize,
            expectedMapPixelHeight: mapHeight * this.tileSize
        });

        // Sample first 10 values to debug
        console.log('First 10 collision values:', this.collisionMap.slice(0, 10));

        for (let i = 0; i < this.collisionMap.length; i++) {
            // Check if this is a collision tile (non-walkable)
            // If your map uses 34774 for walkable, we need to check what value represents collision
            const isCollision = this.collisionMap[i] !== 0;
            
            if (isCollision) {
                collisionCount++;
                const col = i % this.mapWidth;
                const row = Math.floor(i / this.mapWidth);
                const x = col * this.tileSize;
                const y = row * this.tileSize;

                // Create a collision rectangle
                const collisionTile = new Actor({
                    pos: vec(x + this.tileSize / 2, y + this.tileSize / 2),
                    width: this.tileSize,
                    height: this.tileSize,
                    collisionType: CollisionType.Fixed, // IMPORTANT: Must be Fixed for collision
                });

                // Visualize collision tiles
                const rect = new Rectangle({
                    width: this.tileSize,
                    height: this.tileSize,
                    color: Color.fromRGB(255, 0, 0, 100), // Semi-transparent red
                });
                collisionTile.graphics.add(rect);

                this.addChild(collisionTile);

                // Log first few collision tiles for debugging
                if (collisionCount <= 5) {
                    console.log(`Collision tile ${collisionCount} at grid (${col}, ${row}) = pixel (${x}, ${y}), value: ${this.collisionMap[i]}`);
                }
            } else if (this.collisionMap[i] === 34774) {
                walkableCount++;
            }
        }

        console.log(`Created ${collisionCount} collision tiles, ${walkableCount} walkable tiles`);
        
        // If no collisions found, let's try inverse logic
        if (collisionCount === 34774) {
            console.warn('No collision tiles found! Your collision map might use different values.');
            console.warn('Trying inverse: treating 34774 as collision...');
            this.createInverseCollisions();
        }
    }

    private createInverseCollisions(): void {
        // Alternative: treat 34774 as collision (if the logic was inverted)
        let count = 0;
        for (let i = 0; i < this.collisionMap.length && count < 100; i++) { // Limit to 100 for testing
            if (this.collisionMap[i] === 34774) {
                count++;
                const col = i % this.mapWidth;
                const row = Math.floor(i / this.mapWidth);
                const x = col * this.tileSize;
                const y = row * this.tileSize;

                const collisionTile = new Actor({
                    pos: vec(x + this.tileSize / 2, y + this.tileSize / 2),
                    width: this.tileSize,
                    height: this.tileSize,
                    collisionType: CollisionType.Fixed,
                });

                const rect = new Rectangle({
                    width: this.tileSize,
                    height: this.tileSize,
                    color: Color.fromRGB(0, 255, 0, 100), // Green for testing
                });
                collisionTile.graphics.add(rect);

                this.addChild(collisionTile);
            }
        }
        console.log(`Created ${count} test collision tiles (green) using value 34774`);
    }
}