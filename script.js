// Get a reference to the display input element
const display = document.getElementById('res');

// Function to append the clicked/typed value to the display
function Solve(val) {
    // Prevent multiple decimal points in the current number segment
    // This is a basic check; more robust parsing might be needed for complex cases
    const currentSegments = display.value.split(/[\+\-\*\/%]/);
    const currentNumberSegment = currentSegments[currentSegments.length - 1];
    if (val === '.' && currentNumberSegment.includes('.')) {
        return; // Do nothing if trying to add a second dot to the current number
    }

    // If the display shows an error or Infinity, clear it before adding new input
    if (display.value === 'Error' || display.value === 'Infinity' || display.value === '-Infinity') {
        display.value = '';
    }
    display.value += val;
}

// Function to evaluate the expression in the display
function Result() {
    if (display.value === '' || display.value === 'Error') {
        return; // Do nothing if display is empty or already an error
    }
    try {
        let expression = display.value;

        // Handle percentage (%)
        // This is a common simplification: "N%" becomes "(N/100)" in the expression.
        // e.g., "50%" becomes "0.5", "10+50%" becomes "10+0.5"
        // More complex calculator logic might handle "A + B%" as "A + (A * B/100)"
        expression = expression.replace(/([0-9\.])+\%/g, (match) => {
            return parseFloat(match.slice(0, -1)) / 100;
        });

        // Note: eval() can be unsafe with arbitrary user input.
        // For a controlled calculator, it's often used for simplicity.
        const result = eval(expression);

        if (isNaN(result) || !isFinite(result)) {
            display.value = 'Error';
        } else {
            // Optional: round to a certain number of decimal places to avoid floating point issues
            // display.value = parseFloat(result.toFixed(10));
            display.value = result;
        }
    } catch (e) {
        display.value = 'Error'; // Display "Error" if evaluation fails
    }
}

// Function to clear the display
function Clear() {
    display.value = '';
}

// Function to remove the last character (backspace)
function Back() {
    display.value = display.value.slice(0, -1);
}

// Event listener for keyboard input
window.addEventListener('keydown', function(event) {
    const key = event.key;

    if (key >= '0' && key <= '9') {
        Solve(key);
    } else if (key === '.') {
        Solve('.');
    } else if (key === '+') {
        Solve('+');
    } else if (key === '-') {
        Solve('-');
    } else if (key === '*') { // Keyboard asterisk for multiplication
        Solve('*');
    } else if (key === 'x' || key === 'X') { // Keyboard 'x' for multiplication
        Solve('*');
    } else if (key === '/') {
        Solve('/');
    } else if (key === '%') {
        Solve('%');
    } else if (key === 'Enter' || key === '=') {
        event.preventDefault(); // Prevent default Enter behavior (e.g., form submission)
        Result();
    } else if (key === 'Backspace') {
        event.preventDefault(); // Prevent browser navigating back
        Back();
    } else if (key.toLowerCase() === 'c' || key === 'Escape') { // 'c' or Escape to clear
        event.preventDefault();
        Clear();
    }
});