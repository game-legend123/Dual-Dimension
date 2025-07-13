# Dual Dimension

Welcome to **Dual Dimension**, a mind-bending puzzle game built with Next.js and Firebase Studio. You control two characters simultaneously in mirrored worlds. The challenge is to navigate both characters to their respective goal tiles at the same time.

## How to Play

- **Mirrored Movement**: You control two characters at once. When you move one, the other moves in a mirrored direction (left/right are mirrored, up/down are the same).
- **Simultaneous Goals**: A level is completed only when both characters land on their goal tiles in the same move.
- **Obstacles**:
    - **Walls**: Solid barriers that block movement for both characters.
    - **Pits**: Deceptive obstacles. A pit in the "Real World" is a solid, walkable tile in the "Mirror World", and a normal tile in the real world may correspond to a pit in the mirror world. You must navigate both worlds carefully.
- **Controls**:
    - **Arrow Keys / WASD**: To move the characters.
    - **'R' key**: To restart the current level.
- **Hints**: If you get stuck, click the lightbulb icon to get a hint from an AI game master!

## Getting Started

To run this project locally, follow these steps:

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

1.  **Clone the repository** (if you're not in Firebase Studio):
    ```bash
    git clone <your-repo-url>
    cd <your-repo-directory>
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Run the development server**:
    ```bash
    npm run dev
    ```

The application will be available at `http://localhost:9002`.

### Genkit AI

This project uses Genkit for its AI features. To run the Genkit flows for local development (e.g., for the hint system):

1.  **Set up your environment**: Create a `.env` file in the root of the project and add your Google AI API key:
    ```
    GOOGLE_API_KEY=your_api_key_here
    ```

2.  **Run Genkit**: In a separate terminal, run the following command:
    ```bash
    npm run genkit:dev
    ```
This will start the Genkit development server, allowing the Next.js app to communicate with your AI flows.
