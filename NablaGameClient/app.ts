class BaseField {
    mousedown = false;
    brush_path = new Motion<Point>();
    prev_point: Point = null;

    constructor(public base_field: HTMLCanvasElement) {
        this.base_field.onmousedown = ev => {
            this.mousedown = true;
        }
        this.base_field.onmouseup = ev => {
            this.mousedown = false;

            if (this.brush_path.empty()) {
                return;
            }
            var ctx = this.base_field.getContext("2d");
            ctx.beginPath();
            ctx.moveTo(this.brush_path.front().x, this.brush_path.front().y);
            while (!this.brush_path.empty()) {
                console.log(this.brush_path.front());
                ctx.lineTo(this.brush_path.front().x, this.brush_path.front().y);
                this.brush_path.pop();
            }
            ctx.stroke();
        }
        this.base_field.onmousemove = ev => {
            if (this.prev_point === null) {
                this.prev_point = {
                    x: ev.offsetX,
                    y: ev.offsetY
                };
                return;
            }
            if (this.mousedown) {
                var val = this.getMouseRelativePosition(ev);
                this.brush_path.push(val);
            }
        };
    }

    getMouseRelativePosition(ev: MouseEvent): Point {
        var client_rect = (<HTMLElement> event.target).getBoundingClientRect();
        return {
            x: ev.clientX - client_rect.left,
            y: ev.clientY - client_rect.top
        };
    }
}

interface Point {
    x: number;
    y: number;
}

class Motion<T>{
    private values_: T[] = new Array<T>();

    //access
    front(): T {
        return this.values_[0];
    }

    //length
    length(): number {
        return this.values_.length;
    }
    empty(): boolean {
        return this.length() === 0;
    }

    //modify
    push(v: T): void {
        if (this.empty() || this.values_[this.values_.length - 1] !== v) {
            this.values_.push(v);
        }
    }
    pop(): void {
        this.values_.shift();
    }
    clear(): void {
        this.values_ = new Array<T>();
    }
}

window.onload = () => {
    var base_field = new BaseField(<HTMLCanvasElement> document.getElementById("base_field"));
};

