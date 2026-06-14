
// Get selectors first
// Get tags
const password_tag = document.getElementById("password");
const password_strength = document.getElementById("password-strength");
const password_strength_text = document.getElementById("password-strength-text");

// input password range
const password_length = document.getElementById("password-length");
const password_length_value = document.getElementById("password-length-value");

// Get buttons
const lowercases_checkbox = document.getElementById("lowercases");
const uppercases_checkbox = document.getElementById("uppercases");
const numbers_checkbox = document.getElementById("numbers");
const symbols_checkbox = document.getElementById("symbols");
const exclude_duplicates = document.getElementById("exclude-duplicates");
const include_spaces = document.getElementById("include-spaces");
const password_btn = document.querySelector(".password-button");

// copy icon
const copy_password_icon = document.getElementById("copy-password");

// Hardcoded values
const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const lowercase = "abcdefghijklmnopqrstuvwxyz";
const number = "0123456789";
const symbol = "~`!@#$%^&*}{/?_+=<>|)(-";

function generatePassword() {

    let password = "";
    let passwordLength = Number(password_length.value);
    let character_map = new Set();
    let character = "";

    while (passwordLength){

        // Add lowercase to password
        if (passwordLength && lowercases_checkbox.checked) {
            character = lowercase[Math.floor(Math.random() * lowercase.length)];
            if (exclude_duplicates.checked) {
                if (!character_map.has(character)) {
                    password += character;
                    passwordLength-=1;
                    character_map.add(character);
                }
            }
            else{
                password += character;
                passwordLength-=1;
            }
        }

        // Add uppercase to password
        if (passwordLength && uppercases_checkbox.checked) {
            character = uppercase[Math.floor(Math.random() * uppercase.length)];
            if (exclude_duplicates.checked) {
                if (!character_map.has(character)) {
                    password += character;
                    passwordLength-=1;
                    character_map.add(character);
                }
            }
            else{
                password += character;
                passwordLength-=1;
            }
        }

        // Add number to password
        if (passwordLength && numbers_checkbox.checked) {
            character = number[Math.floor(Math.random() * number.length)];
            if (exclude_duplicates.checked) {
                if (!character_map.has(character)) {
                    password += character;
                    passwordLength-=1;
                    character_map.add(character);
                }
            }
            else{
                password += character;
                passwordLength-=1;
            }
        }

        // Add symbol to password
        if (passwordLength && symbols_checkbox.checked) {
            character = symbol[Math.floor(Math.random() * symbol.length)];
            if (exclude_duplicates.checked) {
                if (!character_map.has(character)) {
                    password += character;
                    passwordLength-=1;
                    character_map.add(character);
                }
            }
            else{
                password += character;
                passwordLength-=1;
            }
        }

        // Add space to password
        if (passwordLength && include_spaces.checked) {
            character = " ";
            if (exclude_duplicates.checked) {
                if (!character_map.has(character)) {
                    password += character;
                    passwordLength-=1;
                    character_map.add(character);
                }
            }
            else{
                password += character;
                passwordLength-=1;
            }
        }
    }
    return password;
}

function getConfiguredUniqueCount(){
    let unique_character_count = 0;
    if (lowercases_checkbox.checked) {unique_character_count += lowercase.length}
    if (uppercases_checkbox.checked) {unique_character_count += uppercase.length}
    if (numbers_checkbox.checked) {unique_character_count += number.length}
    if(symbols_checkbox.checked) {unique_character_count += symbol.length}
    if(include_spaces.checked) {unique_character_count += 1}

    return unique_character_count;
}

function getRegexPattern(letters){
    return new RegExp(`[${letters}]`);

}

function getPasswordStrength(password){

    let score = 0;

    let passwordLength = password.length;
    if (passwordLength >= 15){
        score += 30;
    }
    else if (passwordLength >= 9){
        score += 20;
    }
    else if (passwordLength >= 6){
        score += 10;
    }

    if (getRegexPattern(lowercase).test(password)){
        score += 14;
    }
    if (getRegexPattern(uppercase).test(password)){
        score += 14;
    }
    if (getRegexPattern(number).test(password)){
        score += 14;
    }
    if (getRegexPattern(symbol).test(password)){
        score += 14;
    }
    if (/\s/.test(password)){
        score += 14;
    }

    return score;

}
function validInputSelection(){

    let unique_character_count = getConfiguredUniqueCount();

    if(exclude_duplicates.checked && unique_character_count < password_length.value){
        return [false, "Can't generate non-duplicate password with the selected settings."];
    }

    if (unique_character_count === 0){
        return [false, "No Settings applied"];
    }
    return [true, ""];
}

function fillIndicatorAndPassword(password, passwordStrength){

    password_tag.value = password;
    password_strength.style.width = `${passwordStrength}%`;

    if (passwordStrength >= 85){
        password_strength.style.backgroundColor = "darkgreen";
        password_strength_text.textContent = "Very Strong";
        password_strength_text.style.color = "darkgreen";

    }
    else if (passwordStrength >= 75 && passwordStrength < 85){
        password_strength.style.backgroundColor = "green";
        password_strength_text.textContent = "Strong";
        password_strength_text.style.color = "green";
    }
    else if (passwordStrength >= 50 && passwordStrength < 75){
        password_strength.style.backgroundColor = "darkorange";
        password_strength_text.textContent = "Medium";
        password_strength_text.style.color = "darkorange";
    }
    else if (passwordStrength >= 35 && passwordStrength < 50){
        password_strength.style.backgroundColor = "red";
        password_strength_text.textContent = "Weak";
        password_strength_text.style.color = "red";
    }
    else{
        password_strength.style.backgroundColor = "darkred";
        password_strength_text.textContent = "Very Weak";
        password_strength_text.style.color = "darkred";
    }


}

function copyGeneratedPassword(){

    let generatedPassword = password_tag.value;
    if(generatedPassword){
        navigator.clipboard.writeText(generatedPassword);
        copy_password_icon.src = "check.png"
    }
}

copy_password_icon.addEventListener("click", copyGeneratedPassword);

password_length.addEventListener("input", () => {
    const passwordLength = password_length.value;
    password_length_value.textContent = passwordLength;
})

password_btn.addEventListener("click", () => {

    const [valid, errorMessage] = validInputSelection();
    if (!valid){
        alert(errorMessage);
        return;
    }
    const genPassword = generatePassword();
    const passwordStrengthValue = getPasswordStrength(genPassword);

    fillIndicatorAndPassword(genPassword, passwordStrengthValue);
    copy_password_icon.src = "copy.png"
})