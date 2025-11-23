import { Socket } from "socket.io-client";
import { User } from "better-auth";
import { ArenaUser } from "@/lib/validators/arena";
import { PlayerPosPayload } from "@repo/schemas/arena-ws-events";
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

    // get or create character for other users
    const getOrCreateCharacter = (userId: string, playerPos: { x: number; y: number }) => {
        let userWithCharacter = otherUsers.get(userId);

        if (userWithCharacter) return userWithCharacter.character;

        const userData = arenaUsers.find(u => u.id === userId);
        if (!userData) return null;

        // Create new character
        const character = new Character(userData);
        character.pos = vec(playerPos.x, playerPos.y);

        userWithCharacter = {
            ...userData,
            character,
        };

        otherUsers.set(userId, userWithCharacter);
        game.add(character);
    };

    socket.on("player-pos", (data: PlayerPosPayload) => {
        const { userId, playerPos } = data;

        const character = getOrCreateCharacter(userId, playerPos);
        if (!character) return;

        character.setCurrentDirection(playerPos.direction);
        character.setIsMoving(playerPos.isMoving);

        const distance = character.pos.distance(vec(playerPos.x, playerPos.y));
        if (playerPos.isMoving || distance > 5) {
            character.setTargetPosition(vec(playerPos.x, playerPos.y));
        }
    })

    // create main character
    const mainCharacter = new MainCharacter(socket, user);
    mainCharacter.pos = vec(island.getMapWidth() / 2 - 100, island.getMapHeight() / 2 + 100);
    game.add(mainCharacter);

    // Proximity detection settings
    const PROXIMITY_RADIUS = 150; // pixels
    const PROXIMITY_CHECK_INTERVAL = 200; // ms
    const usersInProximity = new Set<string>();

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

    // proximity detection
    const checkProximity = () => {
        otherUsers.forEach((user) => {
            if (!user.character || !user.isOnline) return;
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
    const proximityCheckInterval = setInterval(checkProximity, PROXIMITY_CHECK_INTERVAL);

    // listen for game events
    game.on("update-arena-users", (event) => {
        const updatedArenaUsers = event as ArenaUser[];

        arenaUsers.splice(0, arenaUsers.length, ...updatedArenaUsers);

        const onlineUserIds = new Set(updatedArenaUsers.filter(u => u.isOnline).map(u => u.id));
        otherUsers.forEach((user, userId) => {
            if (!onlineUserIds.has(userId)) {
                if (user.character) {
                    game.remove(user.character);
                }
                otherUsers.delete(userId);
                usersInProximity.delete(userId);
            }
        });
    })

    // Cleanup on game stop
    game.on('stop', () => {
        // clearInterval(onlineUserCheckInterval);
        clearInterval(proximityCheckInterval);
    });

    return game;
}