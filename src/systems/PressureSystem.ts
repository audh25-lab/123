export default class PressureSystem {
  private grid: { value: number; gangId: string; aggression: number; }[][];
  private tileSize: number;
  private width: number;
  private height: number;

  constructor(worldWidth: number, worldHeight: number, tileSize: number) {
    this.tileSize = tileSize;
    this.width = Math.floor(worldWidth / tileSize);
    this.height = Math.floor(worldHeight / tileSize);
    this.grid = Array.from({ length: this.height }, () => 
      Array(this.width).fill({ value: 0, gangId: '', aggression: 1 })
    );
  }

  updatePressure(x: number, y: number, delta: number, gangId: string) {
    const gx = Math.floor(x / this.tileSize);
    const gy = Math.floor(y / this.tileSize);
    if (gx >= 0 && gx < this.width && gy >= 0 && gy < this.height) {
      const tile = this.grid[gy][gx];
      tile.value = Phaser.Math.Clamp(tile.value + delta, 10, 100);
      tile.gangId = gangId;
    }
  }

  getPressure(x: number, y: number): number {
    const gx = Math.floor(x / this.tileSize);
    const gy = Math.floor(y / this.tileSize);
    return this.grid[gy]?.[gx]?.value ?? 0;
  }

  recalculate() {
  }

  partialReset() {
    this.grid.forEach(row => row.forEach(tile => tile.value /= 2));
  }
}
