import { MapAreaModel } from "../models/Map/map-area.model";

export const MapData: Array<MapAreaModel> = [
  {
    id: "palletTown",
    name: "Pallet Town",
    trainers: [
      {
        name: "Rival",
        team: [
          {
            pokemon: "",
            level: 5
          }
        ],
        rival: 0
      }
    ]
  },
  {
    id: "route1",
    name: "Route 1",
    require: ["palletTown"],
    wilderness: [
      {
        pokemon: "Pidgey",
        chance: .5,
        level: [2, 5]
      },
      {
        pokemon: "Rattata",
        chance: .5,
        level: [2, 4]
      }
    ]
  },
  {
    id: "viridianCity",
    name: "Viridian City",
    require: ["route1"]
  },
  {
    id: "route2",
    name: "Route 2",
    require: ["viridianCity"],
    wilderness: [
      {
        pokemon: "Pidgey",
        chance: .45,
        level: [2, 5]
      },
      {
        pokemon: "Rattata",
        chance: .45,
        level: [2, 5]
      },
      {
        pokemon: "Caterpie",
        chance: .05,
        level: [4, 5]
      },
      {
        pokemon: "Weedle",
        chance: .05,
        level: [4, 5]
      }
    ]
  },
  {
    id: "route22",
    name: "Route 22",
    require: ["viridianCity"],
    wilderness: [
      {
        pokemon: "Rattata",
        chance: .45,
        level: [2, 5]
      },
      {
        pokemon: "Mankey",
        chance: .45,
        level: [2, 5]
      },
      {
        pokemon: "Spearow",
        chance: .1,
        level: [3, 5]
      }
    ],
    trainers: [
      {
        name: "Rival",
        team: [
          {
            pokemon: "Pidgey",
            level: 9
          },
          {
            pokemon: "",
            level: 9
          }
        ],
        rival: 1
      }
    ]
  },
  {
    id: "viridianForest",
    name: "Viridian Forest",
    require: ["viridianCity"],
    wilderness: [
      {
        pokemon: "Caterpie",
        chance: .40,
        level: [3, 5]
      },
      {
        pokemon: "Weedle",
        chance: .40,
        level: [3, 5]
      },
      {
        pokemon: "Metapod",
        chance: .075,
        level: [4, 6]
      },
      {
        pokemon: "Kakuna",
        chance: .075,
        level: [4, 6]
      },
      {
        pokemon: "Pikachu",
        chance: .05,
        level: [3, 5]
      }
    ],
    trainers: [
      {
        name: "Bug Catcher Rick",
        team: [
          {
            pokemon: "Weedle",
            level: 6
          },
          {
            pokemon: "Caterpie",
            level: 6
          }
        ]
      },
      {
        name: "Bug Catcher Doug",
        team: [
          {
            pokemon: "Weedle",
            level: 7
          },
          {
            pokemon: "Kakuna",
            level: 7
          },
          {
            pokemon: "Weedle",
            level: 7
          }
        ]
      },
      {
        name: "Bug Catcher Anthony",
        team: [
          {
            pokemon: "Caterpie",
            level: 7
          },
          {
            pokemon: "Caterpie",
            level: 8
          }
        ]
      },
      {
        name: "Bug Catcher Charlie",
        team: [
          {
            pokemon: "Metapod",
            level: 7
          },
          {
            pokemon: "Caterpie",
            level: 7
          },
          {
            pokemon: "Metapod",
            level: 7
          }
        ]
      },
      {
        name: "Bug Catcher Sammy",
        team: [
          {
            pokemon: "Weedle",
            level: 9
          }
        ]
      }
    ]
  },
];