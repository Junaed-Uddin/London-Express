let sum = 0;
const ticketPrice = 550;
let count = 0;

const seatStr = `a1,a2,a3,a4,b1,b2,b3,b4,c1,c2,c3,c4,d1,d2,d3,d4,e1,e2,e3,e4,f1,f2,f3,f4,g1,g2,g3,g4,h1,h2,h3,h4,i1,i2,i3,i4,j1,j2,j3,j4`;
const seatsArr = seatStr.toUpperCase().split(',');

// select the seat and calculate the total price
const kbdClass = document.getElementsByClassName('kbd');
for (const kbd of kbdClass) {
    kbd.addEventListener('click', function (event) {
        const targetElement = event.target.innerText;
        // backgroundChange function call based on condition 
        kbd.classList.contains('text-gray-400') && count <= 3 ?
            backgroundChange(kbd, 'bg-[#F7F8F8]', 'bg-[#1DD100]', 'text-white', 'text-gray-400') :
            backgroundChange(kbd, 'bg-[#1DD100]', 'bg-[#F7F8F8]', 'text-gray-400', 'text-white');

        /* select/deselect seats based on click but not more than 4 and also update the
        ticket price, enable/disable coupon fields and so on  */

        if (seatsArr.includes(targetElement)) {
            if (count <= 3) {
                const clickedElement = seatsArr.indexOf(targetElement);
                seatsArr.splice(clickedElement, 1);
                count++;
                // indicator update
                indicator(count);
                // checking input field and enable submit button
                checkInputField(count, false);
                sum += ticketPrice;
                createRowElement(targetElement, sum, targetElement);
            }
            if (count === 4) {
                enableElement('coupon-field', false);
                enableElement('apply-btn', false);
            }
            else {
                enableElement('coupon-field', true);
                enableElement('apply-btn', true);
            }
        }
        else {
            const id = getElement(targetElement);
            id?.remove();
            seatsArr.push(targetElement);
            count--;
            indicator(count);
            sum -= ticketPrice;
            enableElement('coupon-field', true);
            enableElement('apply-btn', true);
            setElement('total-price', sum);
            toggleContainer('discount-container', 'hidden');
            setElement('grand-total', sum);
            toggleContainer('coupon-code-container', 'hidden');
            if (count >= 1) {
                checkInputField(count, false);
            }
            else
                checkInputField(count, true);
            // alert(`${targetElement} seat, Already selected !!`);
        }
    });
}

function indicator(count) {
    setElement('indicator', count);
}


// check input field
function checkInputField(count, attribute) {
    let nameField = getElement('name');
    let phoneField = getElement('phone-number');
    let emailField = getElement('email');
    let nameValue = nameField.value;
    let phoneValue = phoneField.value;
    let emailValue = emailField.value;
    if (nameValue && phoneValue && emailValue && count >= 1) {
        enableElement('submit-btn', attribute)
    }
    if (attribute === true) {
        nameField.value = '';
        phoneField.value = '';
        emailField.value = '';
        enableElement('submit-btn', attribute);
    }
}

// Add event listeners to input fields
const nameField = getElement('name');
const phoneField = getElement('phone-number');
const emailField = getElement('email');

[nameField, phoneField, emailField].forEach(field => {
    field.addEventListener('input', function () {
        checkInputField(count, false); // Re-evaluate input fields whenever they change
    });
});


function deleteBtn() {
    enableElement('coupon-field', false);
    enableElement('apply-btn', false);
    const totalPrice = getInnerTextById('total-price');
    setElement('grand-total', totalPrice);
    toggleContainer('discount-container', 'hidden');
    toggleContainer('coupon-code-container', 'hidden');
}

// get discount
function getDiscount() {
    let total = 0;
    const newUser = getInnerTextById('NEW15');
    const coupleUser = getInnerTextById('Couple 20');
    const couponField = getElement('coupon-field');
    const totalPrice = getInnerTextById('total-price');
    const pressedKey = couponField.value;

    if (pressedKey === newUser) {
        const new15Percent = totalPrice * 0.15;
        enableElement('discount-container', 'hidden');
        setElement('discount-price', new15Percent);
        total = totalPrice - new15Percent;
    }
    else if (pressedKey === coupleUser) {
        const couple20Percent = totalPrice * 0.2;
        enableElement('discount-container', 'hidden');
        setElement('discount-price', couple20Percent);
        total = totalPrice - couple20Percent;
    }
    if (pressedKey === newUser || pressedKey === coupleUser) {
        setElement('grand-total', total);
        enableElement('coupon-field', true);
        enableElement('apply-btn', true);
        setElement('coupon-code', couponField.value);
        enableElement('coupon-code-container', 'hidden');
        couponField.value = '';
    }
    else {
        setElement('grand-total', totalPrice);
        alert(`Please provide the valid Coupon..!!`);
    }
}

// add classlist to container
function toggleContainer(elementId, attribute) {
    const element = document.getElementById(elementId);
    element.classList.add(attribute);
}

// get value from input field
function getValueById(elementId) {
    const element = document.getElementById(elementId);
    return element.value;
}

// get innerText by id 
function getInnerTextById(elementId) {
    const element = document.getElementById(elementId);
    return element.innerText;
}

//get element by Id
function getElement(elementId) {
    const element = document.getElementById(elementId);
    return element;
}

// set element by Id
function setElement(elementId, value) {
    const element = document.getElementById(elementId);
    return element.innerText = value;
}

// disable or visible by using setAttribute 
function enableElement(elementId, attribute) {
    const element = getElement(elementId);
    if (typeof attribute === 'boolean') {
        element.disabled = attribute;
    }
    else
        element.classList.remove(attribute);
}

// background change
function backgroundChange(element, bg1, bg2, textColor1, textColor2) {
    element.classList.remove(bg1);
    element.classList.add(bg2, textColor1);
    element.classList.remove(textColor2);
}

// create row and set the total price
function createRowElement(seatName, sum, id) {
    const tBody = document.getElementById('table-body');
    const totalPrice = getElement('total-price');
    const totalPriceRow = getElement('total-price-row');
    const grandTotal = getElement('grand-total');
    const trTag = document.createElement('tr');
    trTag.setAttribute('id', id);
    const td1 = document.createElement('td');
    const td2 = document.createElement('td');
    const td3 = document.createElement('td');
    const div1 = document.createElement('div');
    const div2 = document.createElement('div');
    const div3 = document.createElement('div');
    div1.innerText = `${seatName}`;
    div2.innerText = `Economy`;
    div3.innerText = 550;
    div1.classList.add('flex', 'justify-start');
    div2.classList.add('flex', 'justify-start');
    div3.classList.add('flex', 'justify-end');
    totalPrice.innerText = sum;
    grandTotal.innerText = sum;
    td1.appendChild(div1);
    td2.appendChild(div2);
    td3.appendChild(div3);
    trTag.appendChild(td1);
    trTag.appendChild(td2);
    trTag.appendChild(td3);
    tBody.insertBefore(trTag, totalPriceRow);
}
