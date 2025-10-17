import { Color, DisplayMode, Engine, vec, Actor, CollisionType } from "excalibur";
import { Character } from "./actors/Character";
import { Island } from "./actors/Island";
import { CollisionLayer } from "./actors/Collision";
import { COLLISION_MAP } from "./CollisionMap";

export const InitGame = async (canvasElement: HTMLCanvasElement) => {
    const game = new Engine({
        canvasElement,
        pixelRatio: 1,
        displayMode: DisplayMode.FitScreenAndFill,
        backgroundColor: Color.fromHex('#6CB4EE'),
    });

    // create and base island
    const island = new Island(game.screen.canvasWidth, game.screen.canvasHeight);
    await island.onInitialize(game);
    game.add(island);

    // Add collision layer
    // Adjust the mapWidth parameter based on your map (e.g., if your map is 1000px wide and tiles are 64px, use 1000/64 = ~16)
    const mapWidthInTiles = Math.floor(island.getMapWidth() / 64);
    const collisionLayer = new CollisionLayer(COLLISION_MAP, mapWidthInTiles, 64);
    game.add(collisionLayer);

    // create main character
    const mainCharacter = new Character();
    mainCharacter.pos = vec(island.getMapWidth() / 2, island.getMapHeight() / 2);
    game.add(mainCharacter);

    // create a foreground layer
    const foreground = new Actor({
        pos: vec(0, 0),
        anchor: vec(0, 0),
        collisionType: CollisionType.PreventCollision,
        z: 100,
    });

    const foregroundSprite = island.getForegroundSprite();
    if (foregroundSprite) foreground.graphics.use(foregroundSprite);
    game.add(foreground);

    // camera to follow character
    game.currentScene.camera.strategy.lockToActor(mainCharacter);
    game.currentScene.camera.zoom = 0.7;

    return game;
}