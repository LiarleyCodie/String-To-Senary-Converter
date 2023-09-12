class Character {
    private char: string;
    private senary: number;
    private decimal: number;
    constructor(character: string, senary: number, decimal: number) {
        this.char = character;
        this.senary = senary;
        this.decimal = decimal;
    }
    public getChar() { return this.char; }
    public getSenary() { return this.senary; }
    public getDecimal() { return this.decimal; }
}

function getDecimalToSenary(decimalValue: number): number {
    if (decimalValue == 0) return 0;

    const base: number = 6;
    const senary: number[] = [];

    let lastQuotient: number = decimalValue;
    for (let i = 0; i < decimalValue; i++) {
        let rest: number = lastQuotient % base;
        lastQuotient=lastQuotient / base;
        senary.push(rest);
        if (lastQuotient == 0) break;
    }

    let arr = senary.reverse();
    let str: string = "";
    arr.forEach(digit => (str += digit));
    return parseInt(str);
}

function getCharactersList(AllCharactersAvailable: string, senaryConverter: (value: number) => number): Character[] {
    const characters: Character[] = [];

    for (let i = 0; i < AllCharactersAvailable.length; i++) {
        let currentCharacter: string = AllCharactersAvailable[i];
        let charDecimal: number = i;
        let charSenary: number = senaryConverter(i);
        const character: Character = new Character(currentCharacter, charDecimal, charSenary);
        characters.push(character);
    }

    return characters;
}
function getStringToSenary(text: string, charactersAvailable: Character[]): number[] {
    const senaryValues: number[] = [];
    for (let i = 0; i < text.length; i++) {
        charactersAvailable.forEach((currentCharacter: Character) => {
            if (text[i] == currentCharacter.getChar()) senaryValues.push(currentCharacter.getSenary());
        })
    }
    return senaryValues;
}
function getSenaryToString(charactersInSenary: number[], charactersAvailable: Character[]): string {
    let text: string = "";
    charactersInSenary.forEach((currentSenary: number) => {
        charactersAvailable.forEach((currentCharacter: Character) => {
            (currentSenary == currentCharacter.getSenary()) && (text += currentCharacter.getChar());
        })
    })
    return text;
}

const availableChars = "abcdefghijklmnopqrstuvwxyz ABCDEFGHIJKLMNOPQRSTUVWXYZ,.?!";
const characters = getCharactersList(availableChars, getDecimalToSenary);

let testString: string = "Voce ta bonita, Vitoria.";
const stringInSenary: number[] = getStringToSenary(testString, characters);

console.log("string in senary:");
let senaryInString: string = '';
stringInSenary.forEach(curNumber => (senaryInString += curNumber + " "));
console.log(senaryInString);

console.log("senary in string");
console.log(getSenaryToString(stringInSenary, characters));


