import { backend } from 'declarations/backend';

let display = document.getElementById('display');
let keys = document.querySelectorAll('.key');
let loading = document.getElementById('loading');

let currentValue = '';
let operator = '';
let waitingForSecondOperand = false;

keys.forEach(key => {
    key.addEventListener('click', () => handleKeyPress(key.dataset.key));
});

async function handleKeyPress(key) {
    if (key >= '0' && key <= '9' || key === '.') {
        if (waitingForSecondOperand) {
            display.value = key;
            waitingForSecondOperand = false;
        } else {
            display.value += key;
        }
        currentValue = display.value;
    } else if (['+', '-', '*', '/'].includes(key)) {
        operator = key;
        waitingForSecondOperand = true;
    } else if (key === '=') {
        if (operator && currentValue) {
            let result = await calculate(parseFloat(display.value), parseFloat(currentValue), operator);
            display.value = result;
            currentValue = result;
            operator = '';
        }
    } else if (key === 'C') {
        clear();
    }
}

async function calculate(x, y, op) {
    loading.style.display = 'block';
    try {
        let result;
        switch (op) {
            case '+':
                result = await backend.add(x, y);
                break;
            case '-':
                result = await backend.subtract(x, y);
                break;
            case '*':
                result = await backend.multiply(x, y);
                break;
            case '/':
                result = await backend.divide(x, y);
                if (result === null) {
                    return 'Error';
                }
                break;
        }
        return result.toFixed(2);
    } catch (error) {
        console.error('Calculation error:', error);
        return 'Error';
    } finally {
        loading.style.display = 'none';
    }
}

function clear() {
    display.value = '';
    currentValue = '';
    operator = '';
    waitingForSecondOperand = false;
}
