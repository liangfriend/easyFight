import { _decorator, Component, input, Input, Node, tween } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Player')
export class Player extends Component {
    direction: direction;
    BulletPoint: Node;
    BulletReady: Boolean = false;
}

type direction = 'LEFT' | 'RIGHT';
