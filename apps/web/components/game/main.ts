import { Color, DisplayMode, Engine, vec, Actor, CollisionType } from "excalibur";
import { COLLISION_MAP_TILES, ORIGINAL_MAP_WIDTH_PX, ORIGINAL_TILE_SIZE, ORIGINAL_ZOOM } from "./constants";
import { MainCharacter } from "./actors/MainCharacter";
import { Island } from "./actors/Island";
import { CollisionLayer } from "./actors/Collision";
import { COLLISION_MAP } from "./CollisionMap";
import { RefObject } from 'react';
import { Character } from "./actors/Character";
import { Socket } from "socket.io-client";
import { User } from "better-auth";
import { ArenaUser } from "@/lib/validators/game";

export const USER_PROXIMITY_EVENT = 'user-proximity';

export const InitGame = async (canvasElement: HTMLCanvasElement, usersRef: RefObject<ArenaUser[]>, socket: Socket, user: User) => {
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

    socket.on("player-pos", (data) => {
        const { userId, playerPos } = data;
        const Character = otherCharacters.get(userId);
        if (!Character) return;
        console.log(playerPos.direction)
        Character.setPlayerDirection(playerPos.direction);
        Character.pos = vec(playerPos.x, playerPos.y);
    })

    // create main character
    const mainCharacter = new MainCharacter(socket, user);
    mainCharacter.pos = vec(island.getMapWidth() / 2 - 100, island.getMapHeight() / 2 + 100);
    game.add(mainCharacter);

    // Store characters with ID
    const otherCharacters = new Map<string, Character>();

    // Proximity detection settings
    const PROXIMITY_RADIUS = 200; // pixels
    const CHECK_INTERVAL = 500; // ms
    let lastProximityUserId: string | null = null;

    // create character for other users
    const createUserCharacter = (user: ArenaUser) => {
        if (otherCharacters.has(user.userId)) return;

        const character = new Character(user.userName);
        const randomX = island.getMapWidth() / 2 - 100;
        const randomY = island.getMapHeight() / 2 + 100;
        character.pos = vec(randomX, randomY);
        character.name = user.userId;

        otherCharacters.set(user.userId, character);
        game.add(character);
    };

    // init characters for existing users
    if (usersRef.current) usersRef.current.forEach(user => createUserCharacter(user));

    // check for new users joining
    const checkForNewUsers = () => {
        if (!usersRef.current) return;

        usersRef.current.forEach(user => {
            if (!otherCharacters.has(user.userId)) {
                createUserCharacter(user);
            }
        });
    };

    // proximity detection
    const checkProximity = () => {
        let closestUser: { userId: string; distance: number } | null = null;

        otherCharacters.forEach((character, userId) => {
            const distance = mainCharacter.pos.distance(character.pos);

            if (distance <= PROXIMITY_RADIUS) {
                if (!closestUser || distance < closestUser.distance) {
                    closestUser = { userId, distance };
                }
            }
        });

        // Emit event if we found a nearby user and it's different from last time
        if (closestUser && closestUser.userId !== lastProximityUserId) {
            lastProximityUserId = closestUser.userId;

            // Dispatch custom window event
            window.dispatchEvent(new CustomEvent(USER_PROXIMITY_EVENT, {
                detail: {
                    userId: closestUser.userId,
                    distance: closestUser.distance
                }
            }));
        } else if (!closestUser && lastProximityUserId) {
            // User left proximity
            lastProximityUserId = null;
            window.dispatchEvent(new CustomEvent(USER_PROXIMITY_EVENT, {
                detail: { userId: null }
            }));
        }
    };

    // Set up periodic checks
    const userCheckInterval = setInterval(checkForNewUsers, 1000);
    const proximityCheckInterval = setInterval(checkProximity, CHECK_INTERVAL);

    // Cleanup on game stop
    game.on('stop', () => {
        clearInterval(userCheckInterval);
        clearInterval(proximityCheckInterval);
    });

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