class BaseField {
    mousedown = false;
    brush_history: Motion<Point>[] = new Array();

    constructor(public base_field: HTMLCanvasElement) {
        this.base_field.onmousedown = ev => {
            this.mousedown = true;
            this.brush_history.push(new Motion<Point>());
        }
        this.base_field.onmouseup = ev => {
            this.mousedown = false;
            this.draw();
        }
        this.base_field.onmousemove = ev => {
            if (this.mousedown) {
                var val = this.getMouseRelativePosition(ev);
                this.brush_history[this.brush_history.length - 1].push(val);
                this.draw();
            }
        };
    }

    getMouseRelativePosition(ev: MouseEvent): Point {
        var client_rect = (<HTMLElement> ev.target).getBoundingClientRect();
        return {
            x: ev.clientX - client_rect.left,
            y: ev.clientY - client_rect.top
        };
    }

    draw(): void {
        this.clearField();
        var ctx = this.base_field.getContext("2d");
        this.brush_history.forEach(
            (val, index, arr) => {
                ctx.beginPath();
                ctx.moveTo(val.front().x, val.front().y);
                val.forEach((v, i) => ctx.lineTo(v.x, v.y));
                ctx.stroke();
            });
    }

    clearField(): void {
        var ctx = this.base_field.getContext("2d");
        ctx.clearRect(0, 0, this.base_field.width, this.base_field.height);
    }
    
    clearHistory(): void {
        this.brush_history = new Array();
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
    forEach(callback: (v:T, i:number) => void): void{
        this.values_.forEach(
            (val, index, array) => {
                callback(val, index);
            });
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
    (<HTMLButtonElement> document.getElementById("clear_button")).onclick = (ev) => {
        base_field.clearHistory();
        base_field.clearField();
    };
};

