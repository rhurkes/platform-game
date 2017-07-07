import { default as CharType } from './charType';

interface IUnit {
  name: string;
  hp: number;
  maxHp: number;
  ap: number;
  apPerRound: number;
  tile: {
    char: string;
    color: string;
  }
  position: {
    x: number;
    y: number;
  };
}

export default IUnit;
