export interface MapTrainer {
  name: string;
  team: Array<{
    id?: string;
    pokemon: string;
    level: number;
  }>;
  rival?: number;
}