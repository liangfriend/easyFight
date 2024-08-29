import { _decorator, Component, director, EPhysics2DDrawFlags, Node, PhysicsSystem2D, Vec2 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('enable_phy')
export class enable_phy extends Component {
    private is_debug:boolean;
    gravity:Vec2;

    start() {
        this.is_debug = false;
        //这里设置的重力加速度不起作用，TODO
        this.gravity = new Vec2(0,-500);

        // 开启物理引擎
        PhysicsSystem2D.instance.enable = true;
    
        // 设置重力加速度
        PhysicsSystem2D.instance.gravity = this.gravity;
    }

    protected onLoad(): void {
        // 开启调试模式
        this.enableDebugDraw(true);

        // 关闭调试模式
        // this.enableDebugDraw(false);
    }

    private enableDebugDraw(enable: boolean): void {
        const physicsManager = PhysicsSystem2D.instance;
    
        if (enable) {
            PhysicsSystem2D.instance.debugDrawFlags = EPhysics2DDrawFlags.Aabb |
            EPhysics2DDrawFlags.Pair |
            EPhysics2DDrawFlags.CenterOfMass |
            EPhysics2DDrawFlags.Joint |
            EPhysics2DDrawFlags.Shape;
        } else {
            PhysicsSystem2D.instance.debugDrawFlags = EPhysics2DDrawFlags.None;
        }
    }
    update(deltaTime: number) {
        // 在update中根据需要处理其他逻辑
    }
}
