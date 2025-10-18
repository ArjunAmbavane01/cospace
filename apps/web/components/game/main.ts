import { Color, DisplayMode, Engine, vec, Actor, CollisionType } from "excalibur";
import { Character } from "./actors/Character";
import { Island } from "./actors/Island";
import { CollisionLayer } from "./actors/Collision";
import { COLLISION_MAP } from "./CollisionMap";
import { COLLISION_MAP_TILES, ORIGINAL_MAP_WIDTH_PX, ORIGINAL_TILE_SIZE, ORIGINAL_ZOOM } from "./constants";

export const InitGame = async (canvasElement: HTMLCanvasElement) => {
    // create engine
    const game = new Engine({
        canvasElement,
        pixelRatio: 1,
        displayMode: DisplayMode.FitScreenAndFill,
        backgroundColor: Color.fromHex('#6CB4EE'),
    });

    // create base island
    const island = new Island();
    await island.onInitialize();
    game.add(island);

    
    // calculate scale between original and current island
    const scaleFactor = island.getMapWidth() / ORIGINAL_MAP_WIDTH_PX;
    const adjustedTileSize = ORIGINAL_TILE_SIZE * ORIGINAL_ZOOM * scaleFactor;
    
    // create collision layer
    const collisionLayer = new CollisionLayer(
        COLLISION_MAP,
        COLLISION_MAP_TILES,
        adjustedTileSize,
        0,
        0,
    );
    game.add(collisionLayer);

    // create main character
    const mainCharacter = new Character();
    mainCharacter.pos = vec(island.getMapWidth() / 2 - 100, island.getMapHeight() / 2 + 100);
    game.add(mainCharacter);

    // create foreground layer
    const foreground = new Actor({
        pos: vec(0, 0),
        anchor: vec(0, 0),
        collisionType: CollisionType.PreventCollision,
        z: 100,
    });

    const foregroundSprite = island.getForegroundSprite();
    if (foregroundSprite) {
        foregroundSprite.origin = vec(0, 0);
        foreground.graphics.use(foregroundSprite);
    }
    game.add(foreground);

    // camera to follow character
    game.currentScene.camera.strategy.lockToActor(mainCharacter);
    game.currentScene.camera.zoom = 0.8;

    return game;
}