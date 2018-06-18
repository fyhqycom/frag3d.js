function ctrMixin(frag3d) {
    frag3d.prototype.taskQueue = [];
    frag3d.prototype.damping = function(key, callback) {
        if(!callback)
            return;
        this[key] = 0;
        let task = setInterval(() => {
                const threshold = 0.0001;
                const damping = 0.99;
                if (Math.abs(this[key]) < threshold)
                    return;
                this[key] *= damping;
                callback();
        }, 1);
        this.taskQueue.push(task);
    }
    frag3d.prototype.bindMousemove = function(id, mod, modunif, normal, normalunif, refresh) {

        this.ctr = {x: 0, y: 0};
        this.ctr_initial = false; // Initial flag
        [vx, vy] = [0,0];


        $(id).mousemove((e) => {
            if(this.ctr_initial) {
                const delX = e.clientX - this.ctr.x;
                const delY = e.clientY - this.ctr.y;
                vx += -delX * 0.001;
                vy += delY * 0.001;
            } else {
                this.ctr_initial = true;
            }
            this.ctr.x = e.clientX;
            this.ctr.y = e.clientY;
            // console.table([vx, vy]);
        });
        setInterval(() => {
            const threshold = 0.001;
            const damping = 0.996;
            if (Math.abs(vy) < threshold && Math.abs(vx) < threshold)
                return;
                vx *= damping;
                vy *= damping;
            this.rotateScene(mod, normal);
            refresh();
        }, 1);
    }



    frag3d.prototype.rotateScene = function(mod, normal) {
        mod.rotate(vy, 1, 0, 0);
        mod.rotate(vx, 0, 1, 0);
        normal.setInverseOf(model);
        normal.transpose();
    }
}