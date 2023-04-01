export enum Types {
  Normal,
  Fire,
  Water,
  Grass,
  Electric,
  Ice,
  Fighting,
  Poison,
  Ground,
  Flying,
  Psychic,
  Bug,
  Rock,
  Ghost,
  Dragon,
  Dark,
  Steel,
  Fairy,
  Typeless,
}

const typeChart = [
  { type: Types.Normal,
    attack: [{
      type: Types.Rock,
      value: .5
    }, {
      type: Types.Steel,
      value: .5
    }, {
      type: Types.Ghost,
      value: 0
    }]
  },
  { type: Types.Fire,
    attack: [{
      type: Types.Grass,
      value: 2
    }, {
      type: Types.Ice,
      value: 2
    }, {
      type: Types.Bug,
      value: 2
    }, {
      type: Types.Steel,
      value: 2
    }, {
      type: Types.Fire,
      value: .5
    }, {
      type: Types.Water,
      value: .5
    }, {
      type: Types.Rock,
      value: .5
    }, {
      type: Types.Dragon,
      value: .5
    }]
  },
  { type: Types.Water,
    attack: [{
      type: Types.Fire,
      value: 2
    }, {
      type: Types.Ground,
      value: 2
    }, {
      type: Types.Rock,
      value: 2
    }, {
      type: Types.Water,
      value: .5
    }, {
      type: Types.Grass,
      value: .5
    }, {
      type: Types.Dragon,
      value: .5
    }]
  },
  { type: Types.Grass,
    attack: [{
      type: Types.Water,
      value: 2
    }, {
      type: Types.Ground,
      value: 2
    }, {
      type: Types.Rock,
      value: 2
    }, {
      type: Types.Fire,
      value: .5
    }, {
      type: Types.Grass,
      value: .5
    }, {
      type: Types.Poison,
      value: .5
    }, {
      type: Types.Flying,
      value: .5
    }, {
      type: Types.Bug,
      value: .5
    }, {
      type: Types.Dragon,
      value: .5
    }, {
      type: Types.Steel,
      value: .5
    }]
  },
  { type: Types.Electric,
    attack: [{
      type: Types.Water,
      value: 2
    }, {
      type: Types.Flying,
      value: 2
    }, {
      type: Types.Grass,
      value: .5
    }, {
      type: Types.Electric,
      value: .5
    }, {
      type: Types.Dragon,
      value: .5
    }, {
      type: Types.Ground,
      value: 0
    }]
  },
  { type: Types.Ice,
    attack: [{
      type: Types.Grass,
      value: 2
    }, {
      type: Types.Ground,
      value: 2
    }, {
      type: Types.Flying,
      value: 2
    }, {
      type: Types.Dark,
      value: 2
    }, {
      type: Types.Fire,
      value: .5
    }, {
      type: Types.Water,
      value: .5
    }, {
      type: Types.Ice,
      value: .5
    }, {
      type: Types.Steel,
      value: .5
    }]
  },
  { type: Types.Fighting,
    attack: [{
      type: Types.Normal,
      value: 2
    }, {
      type: Types.Ice,
      value: 2
    }, {
      type: Types.Rock,
      value: 2
    }, {
      type: Types.Dark,
      value: 2
    }, {
      type: Types.Steel,
      value: 2
    }, {
      type: Types.Poison,
      value: .5
    }, {
      type: Types.Flying,
      value: .5
    }, {
      type: Types.Psychic,
      value: .5
    }, {
      type: Types.Bug,
      value: .5
    }, {
      type: Types.Fairy,
      value: .5
    }, {
      type: Types.Ghost,
      value: 0
    }]
  },
  { type: Types.Poison,
    attack: [{
      type: Types.Grass,
      value: 2
    }, {
      type: Types.Fairy,
      value: 2
    }, {
      type: Types.Poison,
      value: .5
    }, {
      type: Types.Ground,
      value: .5
    }, {
      type: Types.Rock,
      value: .5
    }, {
      type: Types.Ghost,
      value: .5
    }, {
      type: Types.Steel,
      value: 0
    }]
  },
  { type: Types.Ground,
    attack: [{
      type: Types.Fire,
      value: 2
    }, {
      type: Types.Electric,
      value: 2
    }, {
      type: Types.Poison,
      value: 2
    }, {
      type: Types.Rock,
      value: 2
    }, {
      type: Types.Steel,
      value: 2
    }, {
      type: Types.Grass,
      value: .5
    }, {
      type: Types.Bug,
      value: .5
    }, {
      type: Types.Flying,
      value: 0
    }]
  },
  { type: Types.Flying,
    attack: [{
      type: Types.Grass,
      value: 2
    }, {
      type: Types.Fighting,
      value: 2
    }, {
      type: Types.Bug,
      value: 2
    }, {
      type: Types.Electric,
      value: .5
    }, {
      type: Types.Rock,
      value: .5
    }, {
      type: Types.Steel,
      value: .5
    }]
  },
  { type: Types.Psychic,
    attack: [{
      type: Types.Fighting,
      value: 2
    }, {
      type: Types.Poison,
      value: 2
    }, {
      type: Types.Psychic,
      value: .5
    }, {
      type: Types.Steel,
      value: .5
    }, {
      type: Types.Dark,
      value: 0
    }]
  },
  { type: Types.Psychic,
    attack: [{
      type: Types.Grass,
      value: 2
    }, {
      type: Types.Psychic,
      value: 2
    }, {
      type: Types.Dark,
      value: 2
    }, {
      type: Types.Fire,
      value: .5
    }, {
      type: Types.Fighting,
      value: .5
    }, {
      type: Types.Poison,
      value: .5
    }, {
      type: Types.Flying,
      value: .5
    }, {
      type: Types.Ghost,
      value: .5
    }, {
      type: Types.Steel,
      value: .5
    }, {
      type: Types.Fairy,
      value: .5
    }]
  },
  { type: Types.Rock,
    attack: [{
      type: Types.Fire,
      value: 2
    }, {
      type: Types.Ice,
      value: 2
    }, {
      type: Types.Flying,
      value: 2
    }, {
      type: Types.Bug,
      value: 2
    }, {
      type: Types.Fighting,
      value: .5
    }, {
      type: Types.Ground,
      value: .5
    }, {
      type: Types.Steel,
      value: .5
    }]
  },
  { type: Types.Ghost,
    attack: [{
      type: Types.Psychic,
      value: 2
    }, {
      type: Types.Ghost,
      value: 2
    }, {
      type: Types.Dark,
      value: .5
    }, {
      type: Types.Normal,
      value: 0
    }]
  },
  { type: Types.Dragon,
    attack: [{
      type: Types.Dragon,
      value: 2
    }, {
      type: Types.Steel,
      value: .5
    }, {
      type: Types.Fairy,
      value: 0
    }]
  },
  { type: Types.Dark,
    attack: [{
      type: Types.Psychic,
      value: 2
    }, {
      type: Types.Ghost,
      value: 2
    }, {
      type: Types.Fighting,
      value: .5
    }, {
      type: Types.Dark,
      value: .5
    }, {
      type: Types.Fairy,
      value: .5
    }]
  },
  { type: Types.Steel,
    attack: [{
      type: Types.Ice,
      value: 2
    }, {
      type: Types.Rock,
      value: 2
    }, {
      type: Types.Fairy,
      value: 2
    }, {
      type: Types.Fire,
      value: .5
    }, {
      type: Types.Water,
      value: .5
    }, {
      type: Types.Electric,
      value: .5
    }, {
      type: Types.Steel,
      value: .5
    }]
  },
  { type: Types.Fairy,
    attack: [{
      type: Types.Fighting,
      value: 2
    }, {
      type: Types.Dragon,
      value: 2
    }, {
      type: Types.Dark,
      value: 2
    }, {
      type: Types.Fire,
      value: .5
    }, {
      type: Types.Poison,
      value: .5
    }, {
      type: Types.Steel,
      value: .5
    }]
  }
];

function getEffectiveness(attack: Types, defense: Array<Types>): Array<number> {
  const general = typeChart.find(item => item.type === attack)?.attack;
  return defense.map(type => general?.find(item => item.type === type)?.value || 1);
}
export function getMultiplier(attack: Types, defense: Array<Types>): number {
  const e = getEffectiveness(attack, defense);
  const p = e.filter(v => v > 1).length;
  const n = e.filter(v => v < 1).length + e.filter(v => v === 0).length;
  // Pokemon Go
  return Math.pow(1.6, p - n);
  // Standard
  return e.reduce((prev, cur) => prev * cur, 1);
}
export function isImmune(attack: Types, defense: Array<Types>): boolean {
  return getEffectiveness(attack, defense).includes(0);
}