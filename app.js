document.addEventListener('DOMContentLoaded', function () {
    const toggleSwitch = document.getElementById('switch');
    
    // Inicializa a animação de chuva de caracteres
    const main = document.querySelector('main');
    const rains = [];
    for (let i = 0; i < 50; ++i) {
        rains.push(new Rain({ target: main, row: 50 }));
    }

    // Alterna entre modos claro e escuro e ajusta as cores das letras
    toggleSwitch.addEventListener('change', function () {
        if (toggleSwitch.checked) {
            document.body.classList.add('light-mode');
            rains.forEach(rain => {
                rain.trail.traverse(c => {
                    if (!c.element.style.color.includes('hsl(50, 100%')) {
                        c.element.style.color = '#fff'; // Muda a cor para branco no modo claro
                    }
                });
            });
        } else {
            document.body.classList.remove('light-mode');
            rains.forEach(rain => {
                rain.trail.traverse(c => {
                    if (!c.element.style.color.includes('hsl(50, 100%')) {
                        c.element.style.color = '#FFD70011'; // Restaura a cor original no modo escuro
                    }
                });
            });
        }
    });
});

function r(from, to) {
    return ~~(Math.random() * (to - from + 1) + from);
}

function pick() {
    return arguments[r(0, arguments.length - 1)];
}

function getChar() {
    return String.fromCharCode(pick(
        r(0x3041, 0x30ff),
        r(0x2000, 0x206f),
        r(0x0020, 0x003f)
    ));
}

function loop(fn, delay) {
    let stamp = Date.now();
    function _loop() {
        if (Date.now() - stamp >= delay) {
            fn(); stamp = Date.now();
        }
        requestAnimationFrame(_loop);
    }
    requestAnimationFrame(_loop);
}

class Char {
    constructor() {
        this.element = document.createElement('span');
        this.mutate();
    }
    mutate() {
        this.element.textContent = getChar();
    }
}

class Trail {
    constructor(list = [], options) {
        this.list = list;
        this.options = Object.assign(
            { size: 10, offset: 0 }, options
        );
        this.body = [];
        this.move();
    }
    traverse(fn) {
        this.body.forEach((n, i) => {
            let last = (i == this.body.length - 1);
            if (n) fn(n, i, last);
        });
    }
    move() {
        this.body = [];
        let { offset, size } = this.options;
        for (let i = 0; i < size; ++i) {
            let item = this.list[offset + i - size + 1];
            this.body.push(item);
        }
        this.options.offset = 
            (offset + 1) % (this.list.length + size - 1);
    }
}

class Rain {
    constructor({ target, row }) {
        this.element = document.createElement('p');
        this.build(row);
        if (target) {
            target.appendChild(this.element);
        }
        this.drop();
    }
    build(row = 20) {
        let root = document.createDocumentFragment();
        let chars = [];
        for (let i = 0; i < row; ++i) {
            let c = new Char();
            root.appendChild(c.element);
            chars.push(c);
            if (Math.random() < .5) {
                loop(() => c.mutate(), r(3e3, 10e3));
            }
        }
        this.trail = new Trail(chars, { 
            size: r(10, 30), offset: r(0, 100) 
        });
        this.element.appendChild(root); 
    }
    drop() {
        let trail = this.trail;
        let len = trail.body.length;
        let delay = r(100, 500);
        loop(() => {
            trail.move();
            trail.traverse((c, i, last) => {
                c.element.style = `
                    color: hsl(50, 100%, ${85 / len * (i + 1)}%);
                `;
                if (last) {
                    c.mutate();
                    c.element.style = `
                        color: #ffd700;
                        text-shadow:
                            0 0 .5em #fff,
                            0 0 .5em currentColor;
                    `;
                }
            });
        }, delay);
    }
}


document.addEventListener('DOMContentLoaded', function () {
    const toggleSwitch = document.getElementById('switch');
    
    toggleSwitch.addEventListener('change', function () {
        if (toggleSwitch.checked) {
            document.body.classList.add('light-mode');
        } else {
            document.body.classList.remove('light-mode');
        }
    });
});