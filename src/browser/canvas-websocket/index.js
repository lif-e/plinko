let rates = [2, 1, 0.5, 0.25, 0.125, 0.0625, 0.03125, 0.015625, 3, 4, 6, 8, 16];
let rate = rates[0];
let ports = [8080, 8081, 8082, 8083, 8084, 8085, 8086];
let port = ports[0];

let timeout;
let ws;

const updateState = state => {
    document.getElementById('state').innerHTML = (state ? 'Connected' : 'Failed');
}

const pollAndLoop = () => {
    if (timeout) clearTimeout(timeout);
    ws = new WebSocket(`ws://localhost:${port}`);
    Object.assign(ws, {
        onopen() {
            updateState(true);
            const loop = () => {
                ws.send(1);
                timeout = setTimeout(loop, 1000/rate);
            };
            loop();
        },
        onclose() { console.log('closed'); updateState(false); },
        onerror(err) { console.error('error', err); updateState(false); },
        onmessage({ data, type }) {
            if (type === 'message') document.querySelector('img').setAttribute('src', data);
        }
    });
};

const addOption = (selector, value) => {
    const option = document.createElement('option');
    option.setAttribute('value', value);
    option.innerHTML = value;
    selector.appendChild(option);
}

let rateSelector = document.getElementById('rate');
rates.forEach(rate => addOption(rateSelector, rate));
let portSelector = document.getElementById('port');
ports.forEach(port => addOption(portSelector, port));

rateSelector.onchange = function() {
    rate = parseFloat(this.value || this.options[this.selectedIndex].value); 
    pollAndLoop();
};
portSelector.onchange = function() {
    port = parseInt(this.value || this.options[this.selectedIndex].value);
    pollAndLoop();
}

pollAndLoop();