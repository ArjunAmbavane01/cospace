import { Color, DisplayMode, Engine, vec, Actor, CollisionType } from "excalibur";
import { Character } from "./actors/Character";
import { Island } from "./actors/Island";

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