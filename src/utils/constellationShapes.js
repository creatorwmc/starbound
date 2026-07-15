// Constellation shape library.
// Vertices live in [-1, 1] space (origin = cluster center). Edges are index pairs.
// Stars 0..N-1 of a constellation snap to vertices[0..N-1]; extras orbit the cluster.

export const ZODIAC_SHAPES = [
  {
    id: "aries",
    name: "Aries",
    vertices: [[-0.8, 0.2], [-0.2, -0.3], [0.4, -0.5], [0.8, 0.2]],
    edges: [[0, 1], [1, 2], [2, 3]],
  },
  {
    id: "taurus",
    name: "Taurus",
    vertices: [[-0.85, -0.55], [-0.35, -0.15], [0, 0.2], [0.35, -0.15], [0.85, -0.55], [0, 0.55]],
    edges: [[0, 1], [1, 2], [2, 3], [3, 4], [2, 5]],
  },
  {
    id: "gemini",
    name: "Gemini",
    vertices: [[-0.5, -0.75], [-0.5, 0], [-0.5, 0.75], [0.5, -0.75], [0.5, 0], [0.5, 0.75]],
    edges: [[0, 1], [1, 2], [3, 4], [4, 5], [1, 4]],
  },
  {
    id: "cancer",
    name: "Cancer",
    vertices: [[-0.55, 0.5], [0, 0.05], [0.55, 0.5], [0, -0.7]],
    edges: [[0, 1], [2, 1], [1, 3]],
  },
  {
    id: "leo",
    name: "Leo",
    vertices: [[-0.65, -0.7], [-0.35, -0.4], [-0.05, -0.15], [0.2, 0.05], [0.45, 0.45], [-0.3, 0.6]],
    edges: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5]],
  },
  {
    id: "virgo",
    name: "Virgo",
    vertices: [[-0.85, -0.3], [-0.35, -0.2], [0, 0], [0.4, 0.2], [0.85, 0.4], [0, 0.55], [0.45, -0.5]],
    edges: [[0, 1], [1, 2], [2, 3], [3, 4], [2, 5], [3, 6]],
  },
  {
    id: "libra",
    name: "Libra",
    vertices: [[-0.65, 0.3], [0.65, 0.3], [0, -0.65], [-0.4, 0.65], [0.4, 0.65]],
    edges: [[0, 1], [0, 2], [1, 2], [0, 3], [1, 4]],
  },
  {
    id: "scorpio",
    name: "Scorpio",
    vertices: [[-0.8, -0.5], [-0.4, -0.25], [0, -0.05], [0.35, 0.2], [0.55, 0.5], [0.7, 0.15], [0.5, -0.2]],
    edges: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6]],
  },
  {
    id: "sagittarius",
    name: "Sagittarius",
    vertices: [[-0.6, -0.2], [-0.3, 0.3], [0.3, 0.3], [0.6, -0.2], [0, -0.55], [-0.8, 0.05], [0.8, 0.05]],
    edges: [[0, 1], [1, 2], [2, 3], [0, 4], [4, 3], [5, 0], [3, 6]],
  },
  {
    id: "capricorn",
    name: "Capricorn",
    vertices: [[-0.65, -0.3], [0.65, -0.3], [0, 0.65], [-0.3, 0.2], [0.3, 0.2]],
    edges: [[0, 1], [1, 2], [2, 0], [3, 4]],
  },
  {
    id: "aquarius",
    name: "Aquarius",
    vertices: [[-0.75, -0.3], [-0.35, 0], [0, -0.3], [0.35, 0], [0.75, -0.3], [-0.3, 0.55], [0.3, 0.55]],
    edges: [[0, 1], [1, 2], [2, 3], [3, 4], [1, 5], [3, 6]],
  },
  {
    id: "pisces",
    name: "Pisces",
    vertices: [[-0.75, -0.4], [-0.3, -0.15], [0, 0.05], [0.3, -0.15], [0.75, -0.4], [-0.5, 0.6], [0.5, 0.6]],
    edges: [[0, 1], [1, 2], [2, 3], [3, 4], [1, 5], [3, 6]],
  },
];

// Stylized 2D wireframes — recognizable silhouettes, not orthographic projections.
export const SOLID_SHAPES = [
  {
    id: "tetrahedron",
    name: "Tetrahedron",
    vertices: [[0, -0.75], [-0.7, 0.5], [0.7, 0.5], [0, 0.1]],
    edges: [[0, 1], [1, 2], [2, 0], [0, 3], [1, 3], [2, 3]],
  },
  {
    id: "cube",
    name: "Cube",
    vertices: [
      [-0.55, -0.45], [0.25, -0.45], [0.25, 0.35], [-0.55, 0.35],
      [-0.25, -0.7], [0.55, -0.7], [0.55, 0.1], [-0.25, 0.1],
    ],
    edges: [
      [0, 1], [1, 2], [2, 3], [3, 0],
      [4, 5], [5, 6], [6, 7], [7, 4],
      [0, 4], [1, 5], [2, 6], [3, 7],
    ],
  },
  {
    id: "octahedron",
    name: "Octahedron",
    vertices: [[0, -0.75], [0.75, 0], [0, 0.75], [-0.75, 0], [-0.35, -0.15], [0.35, 0.15]],
    edges: [
      [0, 1], [1, 2], [2, 3], [3, 0],
      [0, 4], [1, 4], [2, 4], [3, 4],
      [0, 5], [1, 5], [2, 5], [3, 5],
    ],
  },
  {
    id: "dodecahedron",
    name: "Dodecahedron",
    vertices: [
      [0, -0.78], [0.74, -0.24], [0.46, 0.63], [-0.46, 0.63], [-0.74, -0.24],
      [0, -0.36], [0.34, -0.11], [0.21, 0.29], [-0.21, 0.29], [-0.34, -0.11],
    ],
    edges: [
      [0, 1], [1, 2], [2, 3], [3, 4], [4, 0],
      [5, 6], [6, 7], [7, 8], [8, 9], [9, 5],
      [0, 5], [1, 6], [2, 7], [3, 8], [4, 9],
    ],
  },
  {
    id: "icosahedron",
    name: "Icosahedron",
    vertices: [
      [0, -0.88],
      [0, -0.42], [0.43, -0.30], [0.27, 0.10], [-0.27, 0.10], [-0.43, -0.30],
      [0.43, 0.30], [0.27, 0.50], [-0.27, 0.50], [-0.43, 0.30], [0, 0.16],
      [0, 0.88],
    ],
    edges: [
      [0, 1], [0, 2], [0, 3], [0, 4], [0, 5],
      [1, 2], [2, 3], [3, 4], [4, 5], [5, 1],
      [11, 6], [11, 7], [11, 8], [11, 9], [11, 10],
      [6, 7], [7, 8], [8, 9], [9, 10], [10, 6],
      [1, 6], [1, 10], [2, 6], [2, 7], [3, 7], [3, 8], [4, 8], [4, 9], [5, 9], [5, 10],
    ],
  },
];

export const SHAPES_BY_MODE = {
  zodiac: ZODIAC_SHAPES,
  solids: SOLID_SHAPES,
};

// Pick the shape assigned to a constellation, given the user's mode + the order in
// which the category claimed its constellation (0 = first to hit threshold).
export function getShape(mode, orderIndex) {
  const shapes = SHAPES_BY_MODE[mode] || ZODIAC_SHAPES;
  return shapes[orderIndex % shapes.length];
}
