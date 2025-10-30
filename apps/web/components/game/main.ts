import { RefObject } from 'react';
import { Socket } from "socket.io-client";
import { User } from "better-auth";
import { ArenaUser } from "@/lib/validators/arena";
import { Color, DisplayMode, Engine, vec, Actor, CollisionType } from "excalibur";
import { COLLISION_MAP_TILES, ORIGINAL_MAP_WIDTH_PX, ORIGINAL_TILE_SIZE, ORIGINAL_ZOOM } from "./constants";
import { MainCharacter } from "./actors/MainCharacter";
import { Island } from "./actors/Island";
import { Character } from "./actors/Character";
import { CollisionLayer } from "./actors/Collision";
import { COLLISION_MAP } from "./CollisionMap";

export const USER_PROXIMITY_EVENT = 'user-proximity';
export const USER_LEFT_PROXIMITY_EVENT = 'user-left-proximity';

export const InitGame = async (canvasElement: HTMLCanvasElement, arenaUsers: ArenaUser[], socket: Socket, user: User) => {
    // create engine
    const game = new Engine({
        canvasElement,
        pixelRatio: 1,
        displayMode: DisplayMode.FillContainer,
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

    // Store characters with ID
    const otherUsers = new Map<string, ArenaUser>();

    socket.on("player-pos", (data) => {
        const { userId, playerPos } = data;
        const character = otherUsers.get(userId)?.character;
        if (!character) return;
        character.setCurrentDirection(playerPos.direction);
        character.setIsMoving(playerPos.isMoving);
        character.pos = vec(playerPos.x, playerPos.y);
    })

    // create main character
    const mainCharacter = new MainCharacter(socket, user);
    mainCharacter.pos = vec(island.getMapWidth() / 2 - 100, island.getMapHeight() / 2 + 100);
    game.add(mainCharacter);

    // Proximity detection settings
    const PROXIMITY_RADIUS = 150; // pixels
    const CHECK_INTERVAL = 500; // ms
    const usersInProximity = new Set<string>();

    // init characters for online users
    const onlineUsers = arenaUsers.filter(user => user.isOnline);
    onlineUsers.forEach(user => createUserCharacter(user));

    // create character for other users
    const createUserCharacter = (user: ArenaUser) => {
        if (otherUsers.has(user.id)) return;

        const character = new Character(user);
        const randomX = island.getMapWidth() / 2 - 100;
        const randomY = island.getMapHeight() / 2 + 100;
        character.pos = vec(randomX, randomY);
        const newUser = {
            ...user,
            character,
        }
        otherUsers.set(user.id, newUser);
        game.add(character);
    };

    // check for newly joined users
    const checkForNewUsers = () => {
        const onlineUsers = arenaUsers.filter(user => user.isOnline);
        onlineUsers.forEach(user => {
            if (!otherUsers.has(user.id)) {
                createUserCharacter(user);
            }
        });
    };

    // proximity detection
    const checkProximity = () => {
        otherUsers.forEach((user) => {
            if (!user.character) return;
            const distance = mainCharacter.pos.distance(user.character.pos);
            const isNearby = distance <= PROXIMITY_RADIUS;

            // check is any new user in proximity
            if (isNearby && !usersInProximity.has(user.id)) {
                usersInProximity.add(user.id);
                window.dispatchEvent(new CustomEvent(USER_PROXIMITY_EVENT, {
                    detail: {
                        user
                    }
                }));
            } else if (!isNearby && usersInProximity.has(user.id)) {
                usersInProximity.delete(user.id);
                window.dispatchEvent(new CustomEvent(USER_LEFT_PROXIMITY_EVENT, {
                    detail: {
                        userId: user.id,
                    }
                }));
            }
        });
    };
    // Set up periodic checks
    const userCheckInterval = setInterval(checkForNewUsers, 300);
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