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

    private bulletAttributes = {
        //子弹轮盘运动方向
        bulletPrepareDirection: -1, //1 -1
        currentAngle: 0,
    };

    protected onLoad(): void {
        this.body = this.node.getComponent(RigidBody2D);
        this.BulletPoint = this.node.getChildByName('BulletPoint');
        this.direction = 'RIGHT';
        this.move();
        this.collider();
    }
    update(deltaTime: number) {
        const x = this.node.getPosition().x;
        const y = this.node.getPosition().y;
        //向左移动
        if (this.moveAction.isMoveLeft) {
            this.node.setPosition(x - this.speed, y);
        }
        //向右移动
        if (this.moveAction.isMoveRight) {
            this.node.setPosition(x + this.speed, y);
        }
        //跳跃
        if (this.moveAction.isMoveUp) {
            this.moveAction.isMoveUp = false;
            const velocity = this.body.linearVelocity;
            velocity.y += 10;
            this.body.linearVelocity = velocity;
        }
        if (this.moveAction.isMoveDown) {
            //
        }

        if (this.BulletReady) {
            tween(this.BulletPoint).show();
            // (this.BulletPoint.rotation.z / Math.PI) * 360;
            console.log(
                '执行',
                this.BulletReady,
                this.bulletAttributes.currentAngle,
                this.direction,
                this.bulletAttributes.bulletPrepareDirection
            );

            if (this.direction === 'LEFT') {
                if (
                    this.bulletAttributes.currentAngle === 0 ||
                    this.bulletAttributes.currentAngle === -90
                ) {
                    this.bulletAttributes.bulletPrepareDirection *= -1;
                }
                if (
                    this.bulletAttributes.currentAngle <= 0 ||
                    this.bulletAttributes.currentAngle >= -90
                ) {
                    this.bulletAttributes.currentAngle +=
                        1 * this.bulletAttributes.bulletPrepareDirection;
                }
            } else if (this.direction === 'RIGHT') {
                if (
                    this.bulletAttributes.currentAngle === 0 ||
                    this.bulletAttributes.currentAngle === 90
                ) {
                    this.bulletAttributes.bulletPrepareDirection *= -1;
                }
                if (
                    this.bulletAttributes.currentAngle <= 90 ||
                    this.bulletAttributes.currentAngle >= 0
                ) {
                    this.bulletAttributes.currentAngle +=
                        1 * this.bulletAttributes.bulletPrepareDirection;
                }
            }
            this.BulletPoint.setRotation(
                new Quat(
                    0,
                    0,
                    (Math.PI * this.bulletAttributes.currentAngle) / 360
                )
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
                this.setDirection('LEFT');
            }
            if (event.keyCode === keys['s']) {
                this.moveAction.isMoveDown = true;
            }
            if (event.keyCode === keys['d']) {
                this.moveAction.isMoveRight = true;
                this.setDirection('RIGHT');
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
            }
            if (event.keyCode === keys['s']) {
                this.moveAction.isMoveDown = false;
            }
            if (event.keyCode === keys['d']) {
                this.moveAction.isMoveRight = false;
            }
            if (event.keyCode === keys['h']) {
                this.BulletReady = false;
            }
        });
        input.on(Input.EventType.KEY_PRESSING, (event) => {});
    }
    setDirection(value) {
        if (value !== this.direction) {
            this.direction = value;
            //翻转
            const s = this.node.getScale();
            this.node.setScale(s.x * -1, s.y);
        } else {
        }
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
