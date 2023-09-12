import styled from 'styled-components';
import { useState, useRef } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

const Wrapper = styled.div`
  max-width: 480px;
  padding: 5.6rem 1.2rem;
  margin-inline: auto;

  h1 {
    font-family: 'Space Grotesk';
    font-size: 3.6rem;
    text-align: center;
    font-weight: 700;
    color: rgb(25 6 73);
    margin-bottom: 1.6rem;
  }
  p {
    font-size: 1.8rem;
  }

  .input-block {
    margin-block: 4rem;
    position: relative;
    & .textarea {
      border: 0.2rem solid rgba(65 34 170);
      border-radius: 0 0.8rem 0.8rem 0.8rem;
      min-height: 8rem;
      padding: 0.8rem;
      &:focus-visible {
        outline: none;
      }

      & .placeholder {
        color: #aaa;
        pointer-events: none;
      }

      & textarea {
        display: flex;
        width: 100%;
        height: 6rem;
        resize: none;
        font-family: inherit;
        outline: none;
        border: none;
      }
    }

    & label {
      font-weight: 600;
      font-family: inherit;
      color: rgba(65 34 170);
      position: absolute;
      left: 2rem;
      top: -1rem;
      z-index: 1;
      pointer-events: none;

      &::after {
        content: '';
        width: 7rem;
        height: 100%;
        background: white;
        z-index: -1;
        position: absolute;
        left: -0.85rem;
        top: 0;
      }
    }

    &:focus-within {
      outline: 4px solid rgba(65 34 170/50%);
      border-radius: 0 0.8rem 0.8rem 0.8rem;
    }
  }

  .buttons {
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
    margin-top: -1rem;

    & button {
      cursor: pointer;
      padding: 1.6rem;
      font-size: 1.6rem;
      font-family: 'Open Sans', sans-serif;
      font-weight: 500;
      border-radius: 0.8rem;
      background: none;
      border: none;

      &:nth-child(1) {
        background: rgb(81 43 212);
        color: white;

        &:hover {
          background: rgb(65 34 170);
        }
      }

      &:nth-child(2) {
        border: 2px solid rgb(81 43 212);
        color: rgb(81 43 212);

        &:hover {
          border-color: rgb(65 34 170);
          color: rgb(65 34 170);
          background: rgb(65 34 170/10%);
        }
      }
    }
  }
`;

export function App() {
  class Character {
    private char: string;
    private senary: number;
    private decimal: number;
    constructor(character: string, senary: number, decimal: number) {
      this.char = character;
      this.senary = senary;
      this.decimal = decimal;
    }
    public getChar() {
      return this.char;
    }
    public getSenary() {
      return this.senary;
    }
    public getDecimal() {
      return this.decimal;
    }
  }

  function getDecimalToSenary(decimalValue: number): number {
    if (decimalValue == 0) return 0;

    const base: number = 6;
    const senary: number[] = [];

    let lastQuotient: number = decimalValue;
    for (let i = 0; i < decimalValue; i++) {
      let rest: number = lastQuotient % base;
      lastQuotient = lastQuotient / base;
      senary.push(rest);
      if (lastQuotient == 0) break;
    }

    let arr = senary.reverse();
    let str: string = '';
    arr.forEach((digit) => (str += digit));
    return parseInt(str);
  }

  function getCharactersList(
    AllCharactersAvailable: string,
    senaryConverter: (value: number) => number,
  ): Character[] {
    const characters: Character[] = [];

    for (let i = 0; i < AllCharactersAvailable.length; i++) {
      let currentCharacter: string = AllCharactersAvailable[i];
      let charDecimal: number = i;
      let charSenary: number = senaryConverter(i);
      const character: Character = new Character(
        currentCharacter,
        charDecimal,
        charSenary,
      );
      characters.push(character);
    }

    return characters;
  }
  function getStringToSenary(
    text: string,
    charactersAvailable: Character[],
  ): number[] {
    const senaryValues: number[] = [];
    for (let i = 0; i < text.length; i++) {
      charactersAvailable.forEach((currentCharacter: Character) => {
        if (text[i] == currentCharacter.getChar())
          senaryValues.push(currentCharacter.getSenary());
      });
    }
    return senaryValues;
  }

  function getSenaryToString(
    charactersInSenary: string[],
    charactersAvailable: Character[],
  ): string {
    let text: string = '';
    charactersInSenary.forEach((senaryDigit) => {
      charactersAvailable.forEach((character: Character) => {
        if (Number(senaryDigit) == character.getSenary())
          text += character.getChar();
      });
    });
    return text;
  }

  const availableChars =
    'abcdefghijklmnopqrstuvwxyz ABCDEFGHIJKLMNOPQRSTUVWXYZ,.?!0123456789';
  const characters = getCharactersList(availableChars, getDecimalToSenary);

  const [textEntry, setTextEntry] = useState<string>('');
  const [senaryOutput, setSenaryOutput] = useState<string>('');
  const outputDivRef = useRef(null);

  function handleConvertButton() {
    if (textEntry.trim()) {
      const _reference: string = '0123456789';
      const entryType = textEntry
        .split(' ')
        .join('')
        .split('')
        .every((character) => _reference.includes(character));

      if (entryType) {
        const str = getSenaryToString(textEntry.split(' '), characters);

        setSenaryOutput(str.trim());
      } else {
        const stringToSenary: number[] = getStringToSenary(
          textEntry.trim(),
          characters,
        );

        let stringInSenary: string = '';
        stringToSenary.forEach(
          (currentSenary) => (stringInSenary += currentSenary + ' '),
        );
        setSenaryOutput(stringInSenary);
      }
    }
  }

  function handleCopyToClipboard() {
    if (textEntry.length) {
      //@ts-ignore
      const textToCopy = outputDivRef.current.innerText;

      const tempInput = document.createElement('input');
      tempInput.value = textToCopy;
      document.body.appendChild(tempInput);
      tempInput.select();
      document.execCommand('copy');
      document.body.removeChild(tempInput);

      const notify = () => {
        toast.success('Copiado para area de transferencia', {
          autoClose: 1000,
          pauseOnHover: false,
          pauseOnFocusLoss: false,
          toastId: "copiedToClipboard"
        });
      };

      notify();
    }
  }

  return (
    <Wrapper>
      <h1>Texto para Senario</h1>
      <p>Converte um texto para Senario (codigo de base 6) e o inverso.</p>

      <div className="input-block">
        <label>Entrada</label>
        <div className="textarea">
          <textarea
            value={textEntry}
            placeholder="I love you, Vitoria. Tuturu."
            onChange={(ev) => setTextEntry(ev.target.value)}
          ></textarea>
        </div>
      </div>
      <div className="input-block">
        <label>Saida</label>
        <div className="textarea" ref={outputDivRef}>
          {senaryOutput.length <= 0 ? (
            <span className="placeholder">33 14 17 6 4 14 20 18</span>
          ) : (
            senaryOutput
          )}
        </div>
      </div>
      <div className="buttons">
        <button onClick={handleConvertButton}>Converter</button>
        <button onClick={handleCopyToClipboard}>Copiar</button>
      </div>
      <ToastContainer />
    </Wrapper>
  );
}
