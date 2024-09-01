import {
    _decorator,
    Component,
    Input,
    Node,
    SystemEvent,
    EventTarget,
    input,
    RigidBody2D,
    Collider2D,
    IPhysics2DContact,
    CircleCollider2D,
    Contact2DType,
    tween,
    Quat,
} from 'cc';
import { Player } from './Player';
import { collidionGroup, keys } from './util';
import { leftPlayerStates, rightPlayerStates } from './states';
const { ccclass, property } = _decorator;

@ccclass('LeftPlayer')
export class LeftPlayer extends Player {
    private speed = 5;
    private body: RigidBody2D;
    private moveAction = {
        isMoveLeft: false,
        isMoveUp: false,
        isMoveDown: false,
        isMoveRight: false,
    };

    protected onLoad(): void {
        this.body = this.node.getComponent(RigidBody2D);
        this.BulletPoint = this.node.getChildByName('BulletPoint');
        this.move();
        this.collider();
    }
    start() {
        this.direction = 'RIGHT';
    }
    update(deltaTime: number) {
        const x = this.node.getPosition().x;
        const y = this.node.getPosition().y;
        if (this.moveAction.isMoveLeft) {
            this.node.setPosition(x - this.speed, y);
        }
        if (this.moveAction.isMoveRight) {
            this.node.setPosition(x + this.speed, y);
        }
        if (this.moveAction.isMoveUp) {
            this.moveAction.isMoveUp = false;
            const velocity = this.body.linearVelocity;
            velocity.y += 10;
            this.body.linearVelocity = velocity;
        }
        if (this.moveAction.isMoveDown) {
        }

        if (this.BulletReady) {
            tween(this.BulletPoint).show();
            let angle = (this.BulletPoint.rotation.z / Math.PI) * 360;
            console.log('执行', this.BulletReady, angle);

            if (this.direction === 'LEFT') {
                if (angle < 90) {
                    angle += 0.1;
                }
            } else if (this.direction === 'RIGHT') {
                if (angle < 90) {
                    angle += 0.1;
                }
            }
            this.BulletPoint.setRotation(
                new Quat(0, 0, (Math.PI * angle) / 360)
            );
        }
    }
    collider() {
        let collider = this.node.getComponent(CircleCollider2D);

        collider.on(Contact2DType.BEGIN_CONTACT, this.onCollisionEnter, this);
    }
    move() {
        input.on(Input.EventType.KEY_DOWN, (event) => {
            if (event.keyCode === keys['w']) {
                if (!leftPlayerStates.isOnSky) {
                    this.moveAction.isMoveUp = true;
                    leftPlayerStates.isOnSky = true;
                }
            }
            if (event.keyCode === keys['a']) {
                this.moveAction.isMoveLeft = true;
            }
            if (event.keyCode === keys['s']) {
                this.moveAction.isMoveDown = true;
            }
            if (event.keyCode === keys['d']) {
                this.moveAction.isMoveRight = true;
            }
            if (event.keyCode === keys['h']) {
                this.BulletReady = true;
            }
        });

        input.on(Input.EventType.KEY_UP, (event) => {
            if (event.keyCode === keys['w']) {
                this.moveAction.isMoveUp = false;
            }
            if (event.keyCode === keys['a']) {
                this.moveAction.isMoveLeft = false;
                this.direction = 'LEFT';
            }
            if (event.keyCode === keys['s']) {
                this.moveAction.isMoveDown = false;
            }
            if (event.keyCode === keys['d']) {
                this.moveAction.isMoveRight = false;
                this.direction = 'RIGHT';
            }
            if (event.keyCode === keys['h']) {
                this.BulletReady = false;
            }
        });
        input.on(Input.EventType.KEY_PRESSING, (event) => {});
    }
    onCollisionEnter(
        selfCollider: Collider2D,
        otherCollider: Collider2D,
        contact: IPhysics2DContact | null
    ) {
        console.log(selfCollider, otherCollider, contact);
        if (selfCollider.TYPE === collidionGroup['GROUND']) {
            leftPlayerStates.isOnSky = false;
        }
    }
}
