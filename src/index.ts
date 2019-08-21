import ColorGradient from './fancy'
import getHeatMapColor from './simple'


enum Style { SIMPLE, FANCY }

interface Options {
  style?: Style
}

type labeledValuesType = [string, number[]]

class Sterno {
  headings: Array<string>
  rows: Array<labeledValuesType>

  constructor(headings: string[], rows: Array<labeledValuesType>) {
    this.headings = headings;
    this.rows = rows;
  }

  getData(options?: Options): {
    headings: string[],
    high: number, low: number,
    rows: { label: string, cells: { values: number[], scales: number[], colors: object[] } }[]
  } {
    const { headings } = this;
    let high = 0;
    let low = Number.MAX_SAFE_INTEGER;

    const rows = this.rows.map(r => {
      const label = r[0]
      const values = r[1]
      high = Math.max(...values, high)
      low = Math.min(...values, low)
      if (low < 0) throw Error("negative input encountered")
      return { label, cells: { values, colors: [] as object[], scales: [] as number[] } }
    })

    const heatMapGradient = new ColorGradient();    // Used to create a nice array of different colors.
    heatMapGradient.createDefaultHeatMapGradient();

    rows.forEach(row => {
      row.cells.values.forEach((value, i) => {
        const scale = (value - low) / (high - low);
        if (options && options.style === Style.SIMPLE) {
          var color = getHeatMapColor(scale);
        } else {
          var color = heatMapGradient.getColorAtValue(scale)
        }
        row.cells.colors[i] = color;
        row.cells.scales[i] = scale;
      })
    });

    return { headings, high, low, rows };
  }

}

export { Style }
export default Sterno;