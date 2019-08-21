export class Colors {
  constructor() {
  }

  getColorsByName(col: string): [string] {
    return this[col];
  }

  red: string[] = [
    '#ffebee',
    '#ffcdd2',
    '#ef9a9a',
    '#e57373',
    '#ef5350',
    '#f44336',
    '#e53935',
    '#d32f2f',
    "#c62828",
    "#b71c1c",
    "#ff8a80",
    "#ff5252",
    "#ff1744",
    "#d50000"
  ];

  pink: string[] = [
    '#fce4ec',
    '#f8bbd0',
    '#f48fb1',
    '#f06292',
    '#ec407a',
    '#e91e63',
    '#d81b60',
    '#c2185b',
    '#ad1457',
    '#880e4f',
    '#ff80ab',
    '#ff4081',
    '#f50057',
    '#c51162'
  ];

  purple: string[] = [
    '#f3e5f5',
    '#e1bee7',
    '#ce93d8',
    '#ba68c8',
    '#ab47bc',
    '#9c27b0',
    '#8e24aa',
    '#7b1fa2',
    '#6a1b9a',
    '#4a148c',
    '#ea80fc',
    '#e040fb',
    '#d500f9',
    '#aa00ff'
  ];
}
