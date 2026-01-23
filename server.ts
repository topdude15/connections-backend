import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
const port = 3000;

app.use(express.json());

const games = [
  {
    id: 0,
    categories: [
      {
        title: "Cardinal Directions",
        words: ["North", "East", "West", "South"],
        difficulty: 1,
      },
      {
        title: "Professional Disc Golfers",
        words: ["Simon Lizotte", "Paul McBeth", "Jeremy Koling", "Gannon Buhr"],
        difficulty: 3,
      },
      {
        title: "Programming Languages",
        words: ["Lua", "JavaScript", "Rust", "Swift"],
        difficulty: 2,
      },
      {
        title: "Letters",
        words: ["x", "y", "z", "n"],
        difficulty: 0,
      },
    ],
  },
  {
    id: 123,
    categories: [
      {
        title: "Cardinal Directions",
        words: ["North", "East", "West", "South"],
        difficulty: 1,
      },
      {
        title: "Professional Disc Golfers",
        words: ["Simon Lizotte", "Paul McBeth", "Jeremy Koling", "Gannon Buhr"],
        difficulty: 3,
      },
      {
        title: "Programming Languages",
        words: ["Lua", "JavaScript", "Rust", "Swift"],
        difficulty: 2,
      },
      {
        title: "Letters",
        words: ["a", "b", "c", "d"],
        difficulty: 0,
      },
    ],
  },
];

app.get("/getRandomGameID", (req, res) => {
  const gameID = games[Math.floor(Math.random() * games.length)].id;
  return res.status(200).json({ gameID: gameID });
});

app.post("/getGameByID", (req, res) => {
  const { gameID } = req.body;
  const game = games.find((item) => {
    return item.id === gameID;
  });
  if (game) {
    let words: string[] = [];
    for (let i = 0; i < game.categories.length; i++) {
      words = [...words, ...game.categories[i].words];
    }
    return res
      .status(200)
      .json({ message: "This game was found", words: words });
  } else {
    return res.status(404).json({ message: "Error: No game found at this ID" });
  }
});
app.post("/checkSubmission", (req, res) => {
  const { gameID, submission } = req.body;
  const sortedSubmission = [...submission].sort();

  const game = games.find((item) => {
    return item.id === gameID;
  });

  if (game) {
    for (let i = 0; i < game.categories.length; i++) {
      const sortedWords = [...game.categories[i].words].sort();
      const isMatch =
        sortedWords.length === sortedSubmission.length &&
        sortedWords.every((word, index) => {
          return word === sortedSubmission[index];
        });

      if (isMatch) {
        return res.status(200).json({
          matched: true,
          category: game.categories[i].title,
          difficulty: game.categories[i].difficulty,
        });
      }
    }
  } else {
    return res
      .status(404)
      .json({ message: "No game with this ID number could be found." });
  }

  return res.status(200).json({ matched: false });
});

app.listen(port, () => {
  console.log(`Now listening on port ${port}`);
});
