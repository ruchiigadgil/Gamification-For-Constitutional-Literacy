const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const app = express();

const server = http.createServer(app);
app.use(cors());
const io = socketIo(server, {
   cors: {
     origin: "*",
     methods: ["GET", "POST"],
   },
});

const PORT = process.env.PORT || 5000;

const questions = [
  {
    question: "Who is known as the 'Father of the Indian Constitution'?",
    answers: [
      { text: "Mahatma Gandhi", correct: false },
      { text: "B.R. Ambedkar", correct: true },
      { text: "Jawaharlal Nehru", correct: false },
      { text: "Sardar Patel", correct: false },
    ],
  },
  {
    question: "How many articles are there in the Indian Constitution?",
    answers: [
      { text: "395", correct: true },
      { text: "400", correct: false },
      { text: "380", correct: false },
      { text: "350", correct: false },
    ],
  },
  {
    question: "Which article of the Indian Constitution grants the Right to Equality?",
    answers: [
      { text: "Article 14", correct: true },
      { text: "Article 19", correct: false },
      { text: "Article 21", correct: false },
      { text: "Article 25", correct: false },
    ],
  },
  {
    question: "Which article provides protection against arrest and detention?",
    answers: [
      { text: "Article 20", correct: true },
      { text: "Article 19", correct: false },
      { text: "Article 21", correct: false },
      { text: "Article 22", correct: false },
    ],
  },
  {
    question: "What is the minimum age for becoming a member of the Lok Sabha?",
    answers: [
      { text: "21 years", correct: false },
      { text: "25 years", correct: true },
      { text: "30 years", correct: false },
      { text: "35 years", correct: false },
    ],
  },
  {
    question: "Who was the first Law Minister of independent India?",
    answers: [
      { text: "Jawaharlal Nehru", correct: false },
      { text: "B.R. Ambedkar", correct: true },
      { text: "Sardar Patel", correct: false },
      { text: "Rajendra Prasad", correct: false },
    ],
  },
  {
    question: "Which article declares Hindi as the official language of India?",
    answers: [
      { text: "Article 343", correct: true },
      { text: "Article 356", correct: false },
      { text: "Article 370", correct: false },
      { text: "Article 395", correct: false },
    ],
  },
  {
    question: "What is the term of the President of India?",
    answers: [
      { text: "4 years", correct: false },
      { text: "5 years", correct: true },
      { text: "6 years", correct: false },
      { text: "7 years", correct: false },
    ],
  },
  {
    question: "Which amendment introduced the Preamble's words 'Socialist' and 'Secular'?",
    answers: [
      { text: "42nd Amendment", correct: true },
      { text: "44th Amendment", correct: false },
      { text: "73rd Amendment", correct: false },
      { text: "97th Amendment", correct: false },
    ],
  },
  {
    question: "Which article deals with the abolition of untouchability?",
    answers: [
      { text: "Article 15", correct: false },
      { text: "Article 17", correct: true },
      { text: "Article 19", correct: false },
      { text: "Article 21", correct: false },
    ],
  },
  {
    question: "Who was the leader of the Salt Satyagraha (Dandi March)?",
    answers: [
      { text: "Subhas Chandra Bose", correct: false },
      { text: "Mahatma Gandhi", correct: true },
      { text: "Jawaharlal Nehru", correct: false },
      { text: "Sardar Patel", correct: false },
    ],
  },
  {
    question: "Which movement was led by Mahatma Gandhi after the Jallianwala Bagh massacre?",
    answers: [
      { text: "Non-Cooperation Movement", correct: true },
      { text: "Civil Disobedience Movement", correct: false },
      { text: "Quit India Movement", correct: false },
      { text: "Salt Satyagraha", correct: false },
    ],
  },
  {
    question: "Who was the first woman Governor of an Indian state?",
    answers: [
      { text: "Indira Gandhi", correct: false },
      { text: "Sarojini Naidu", correct: true },
      { text: "Annie Besant", correct: false },
      { text: "Sucheta Kriplani", correct: false },
    ],
  },
  {
    question: "Which Indian freedom fighter is known as 'Netaji'?",
    answers: [
      { text: "Subhas Chandra Bose", correct: true },
      { text: "Bal Gangadhar Tilak", correct: false },
      { text: "Lala Lajpat Rai", correct: false },
      { text: "Bhagat Singh", correct: false },
    ],
  },
  {
    question: "In which year did India achieve independence?",
    answers: [
      { text: "1945", correct: false },
      { text: "1947", correct: true },
      { text: "1950", correct: false },
      { text: "1952", correct: false },
    ],
  },
  {
    question: "Who gave the slogan 'Do or Die' during the Quit India Movement?",
    answers: [
      { text: "Jawaharlal Nehru", correct: false },
      { text: "Mahatma Gandhi", correct: true },
      { text: "Sardar Patel", correct: false },
      { text: "Subhas Chandra Bose", correct: false },
    ],
  },
  {
    question: "Which session of the Indian National Congress declared 'Purna Swaraj'?",
    answers: [
      { text: "Calcutta Session", correct: false },
      { text: "Lahore Session", correct: true },
      { text: "Nagpur Session", correct: false },
      { text: "Bombay Session", correct: false },
    ],
  },
  {
    question: "Who wrote the book 'The Discovery of India'?",
    answers: [
      { text: "B.R. Ambedkar", correct: false },
      { text: "Jawaharlal Nehru", correct: true },
      { text: "Sarojini Naidu", correct: false },
      { text: "Maulana Azad", correct: false },
    ],
  },
  {
    question: "Which act introduced Dyarchy in provinces during British rule?",
    answers: [
      { text: "Government of India Act, 1935", correct: false },
      { text: "Indian Councils Act, 1909", correct: false },
      { text: "Regulating Act, 1773", correct: false },
      { text: "Government of India Act, 1919", correct: true },
    ],
  },
  {
    question: "Who was the founder of the Forward Bloc party?",
    answers: [
      { text: "Subhas Chandra Bose", correct: true },
      { text: "Jawaharlal Nehru", correct: false },
      { text: "Sardar Patel", correct: false },
      { text: "Maulana Azad", correct: false },
    ],
  },
  {
    question: "Which article of the Indian Constitution provides for the establishment of a Finance Commission?",
    answers: [
      { text: "Article 280", correct: true },
      { text: "Article 356", correct: false },
      { text: "Article 370", correct: false },
      { text: "Article 143", correct: false },
    ],
  },
  {
    question: "Who was the first woman President of the Indian National Congress?",
    answers: [
      { text: "Sarojini Naidu", correct: false },
      { text: "Annie Besant", correct: true },
      { text: "Indira Gandhi", correct: false },
      { text: "Sucheta Kriplani", correct: false },
    ],
  },
  {
    question: "What is the maximum number of members allowed in the Lok Sabha?",
    answers: [
      { text: "543", correct: true },
      { text: "550", correct: false },
      { text: "500", correct: false },
      { text: "545", correct: false },
    ],
  },
  {
    question: "Which movement was initiated by Mahatma Gandhi after the Chauri Chaura incident?",
    answers: [
      { text: "Civil Disobedience Movement", correct: false },
      { text: "Non-Cooperation Movement", correct: true },
      { text: "Quit India Movement", correct: false },
      { text: "Salt Satyagraha", correct: false },
    ],
  },
  {
    question: "Who was the founder of the Swaraj Party?",
    answers: [
      { text: "Motilal Nehru and C.R. Das", correct: true },
      { text: "Jawaharlal Nehru and Sardar Patel", correct: false },
      { text: "Subhas Chandra Bose and Lala Lajpat Rai", correct: false },
      { text: "B.R. Ambedkar and M.K. Gandhi", correct: false },
    ],
  },
  {
    question: "Which article grants the Right to Freedom of Speech and Expression?",
    answers: [
      { text: "Article 14", correct: false },
      { text: "Article 19", correct: true },
      { text: "Article 21", correct: false },
      { text: "Article 25", correct: false },
    ],
  },
  {
    question: "Which amendment introduced the Goods and Services Tax (GST) in India?",
    answers: [
      { text: "97th Amendment", correct: false },
      { text: "101st Amendment", correct: true },
      { text: "122nd Amendment", correct: false },
      { text: "132nd Amendment", correct: false },
    ],
  },
  {
    question: "Who was the first Indian to become the President of the United Nations General Assembly?",
    answers: [
      { text: "Vijaya Lakshmi Pandit", correct: true },
      { text: "Jawaharlal Nehru", correct: false },
      { text: "Sarojini Naidu", correct: false },
      { text: "Indira Gandhi", correct: false },
    ],
  },
  {
    question: "Which act provided separate electorates for Muslims during British rule?",
    answers: [
      { text: "Indian Councils Act, 1909", correct: true },
      { text: "Government of India Act, 1919", correct: false },
      { text: "Government of India Act, 1935", correct: false },
      { text: "Regulating Act, 1773", correct: false },
    ],
  },
  {
    question: "Which freedom fighter is known as the 'Iron Man of India'?",
    answers: [
      { text: "Mahatma Gandhi", correct: false },
      { text: "Sardar Vallabhbhai Patel", correct: true },
      { text: "Subhas Chandra Bose", correct: false },
      { text: "Bhagat Singh", correct: false },
    ],
  },
  {
    question: "Which article provides for the imposition of a state emergency (President's Rule)?",
    answers: [
      { text: "Article 352", correct: false },
      { text: "Article 356", correct: true },
      { text: "Article 360", correct: false },
      { text: "Article 370", correct: false },
    ],
  },
  {
    question: "Who coined the slogan 'Inquilab Zindabad'?",
    answers: [
      { text: "Bhagat Singh", correct: true },
      { text: "Chandrashekhar Azad", correct: false },
      { text: "Subhas Chandra Bose", correct: false },
      { text: "Lala Lajpat Rai", correct: false },
    ],
  },
  {
    question: "Which session of the Indian National Congress was presided over by Mahatma Gandhi?",
    answers: [
      { text: "Belgaum Session, 1924", correct: true },
      { text: "Lahore Session, 1929", correct: false },
      { text: "Calcutta Session, 1920", correct: false },
      { text: "Nagpur Session, 1920", correct: false },
    ],
  },
  {
    question: "Which article of the Indian Constitution deals with the Right to Education?",
    answers: [
      { text: "Article 21A", correct: true },
      { text: "Article 19", correct: false },
      { text: "Article 14", correct: false },
      { text: "Article 25", correct: false },
    ],
  },
  {
    question: "Who founded the Hindustan Socialist Republican Association (HSRA)?",
    answers: [
      { text: "Bhagat Singh", correct: true },
      { text: "Chandrashekhar Azad", correct: false },
      { text: "Subhas Chandra Bose", correct: false },
      { text: "Lala Lajpat Rai", correct: false },
    ],
  },
  {
    question: "Which article declares India as a Union of States?",
    answers: [
      { text: "Article 1", correct: true },
      { text: "Article 3", correct: false },
      { text: "Article 12", correct: false },
      { text: "Article 15", correct: false },
    ],
  },
  {
    question: "Who was the leader of the Bardoli Satyagraha?",
    answers: [
      { text: "Mahatma Gandhi", correct: false },
      { text: "Sardar Vallabhbhai Patel", correct: true },
      { text: "Jawaharlal Nehru", correct: false },
      { text: "Subhas Chandra Bose", correct: false },
    ],
  },
  {
    question: "Which act led to the partition of Bengal in 1905?",
    answers: [
      { text: "Indian Councils Act, 1909", correct: false },
      { text: "Partition of Bengal, 1905", correct: true },
      { text: "Government of India Act, 1919", correct: false },
      { text: "Government of India Act, 1935", correct: false },
    ],
  },
  {
    question: "Who was the first Indian to unfurl the Indian flag on foreign soil?",
    answers: [
      { text: "Madame Cama", correct: true },
      { text: "Bhikaji Cama", correct: false },
      { text: "Annie Besant", correct: false },
      { text: "Sarojini Naidu", correct: false },
    ],
  },
  {
    question: "Which article provides protection against double jeopardy?",
    answers: [
      { text: "Article 20", correct: true },
      { text: "Article 19", correct: false },
      { text: "Article 21", correct: false },
      { text: "Article 22", correct: false },
    ],
  },  
];

const rooms = {};

function shuffleArray(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("joinRoom", (room, name) => {
    socket.join(room);
    io.to(room).emit("message", `${name} has joined the game!`);
    // if (!rooms[room]) {
    //   rooms[room] = {
    //     players: [],
    //     currentQuestion: null,
    //     correctAnswer: null,
    //     questionTimeout: null,
    //     shouldAskNewQuestion: true,
    //   };
    // }

    if (!rooms[room]) {
      rooms[room] = {
        players: [],
        currentQuestion: null,
        correctAnswer: null,
        questionTimeout: null,
        shouldAskNewQuestion: true,
        questionCount: 0,
        questionList: shuffleArray(questions).slice(0, 10), 
      };
    }

    rooms[room].players.push({ id: socket.id, name });

    if (!rooms[room].currentQuestion) {
      askNewQuestion(room);
    }
  });

  socket.on("submitAnswer", (room, answerIndex) => {
    const currentPlayer = rooms[room].players.find(
      (player) => player.id === socket.id
    );

    if (currentPlayer) {
      const correctAnswer = rooms[room].correctAnswer;
      const isCorrect = correctAnswer !== null && correctAnswer === answerIndex;
      currentPlayer.score = isCorrect
        ? (currentPlayer.score || 0) + 1
        : (currentPlayer.score || 0) - 1;

      clearTimeout(rooms[room].questionTimeout);

      io.to(room).emit("answerResult", {
        playerName: currentPlayer.name,
        isCorrect,
        correctAnswer,
        scores: rooms[room].players.map((player) => ({
          name: player.name,
          score: player.score || 0,
        })),
      });

      // const winningThreshold = 5;
      // const winner = rooms[room].players.find(
      //   (player) => (player.score || 0) >= winningThreshold
      // );

      // if (winner) {
      //   io.to(room).emit("gameOver", { winner: winner.name });
      //   delete rooms[room];
      // } else {
      //   askNewQuestion(room);
      // }

      if (rooms[room].questionCount >= 10) {
        const winner = rooms[room].players.reduce((max, p) =>
          (p.score || 0) > (max.score || 0) ? p : max
        );
        io.to(room).emit("gameOver", { winner: winner.name });
        delete rooms[room];
      } else {
        askNewQuestion(room);
      }

    }
  });

  socket.on("disconnect", () => {
    for (const room in rooms) {
      rooms[room].players = rooms[room].players.filter(
        (player) => player.id !== socket.id
      );
    }
    console.log("A user disconnected");
  });
});

// function askNewQuestion(room) {
//   if (rooms[room].players.length === 0) {
//     clearTimeout(rooms[room].questionTimeout);
//     delete rooms[room];
//     return;
//   }

//   const randomIndex = Math.floor(Math.random() * questions.length);
//   const question = questions[randomIndex];
//   rooms[room].currentQuestion = question;
//   const correctAnswerIndex = question.answers.findIndex(
//     (answer) => answer.correct
//   );

//   rooms[room].correctAnswer = correctAnswerIndex;
//   rooms[room].shouldAskNewQuestion = true;
//   io.to(room).emit("newQuestion", {
//     question: question.question,
//     answers: question.answers.map((answer) => answer.text),
//     timer: 20,
//   });

//   rooms[room].questionTimeout = setTimeout(() => {
//     io.to(room).emit("answerResult", {
//       playerName: "No one",
//       isCorrect: false,
//       correctAnswer: rooms[room].correctAnswer,
//       scores: rooms[room].players.map((player) => ({
//         name: player.name,
//         score: player.score || 0,
//       })),
//     });

//     askNewQuestion(room);
//   }, 20000);
// }

function askNewQuestion(room) {
  if (rooms[room].players.length === 0) {
    clearTimeout(rooms[room].questionTimeout);
    delete rooms[room];
    return;
  }

  if (rooms[room].questionCount >= 10) {
    const winner = rooms[room].players.reduce((max, p) =>
      (p.score || 0) > (max.score || 0) ? p : max
    );
    io.to(room).emit("gameOver", { winner: winner.name });
    delete rooms[room];
    return;
  }

  const question = rooms[room].questionList[rooms[room].questionCount];
  rooms[room].currentQuestion = question;
  const correctAnswerIndex = question.answers.findIndex(a => a.correct);
  rooms[room].correctAnswer = correctAnswerIndex;

  io.to(room).emit("newQuestion", {
    question: question.question,
    answers: question.answers.map(a => a.text),
    timer: 20,
  });

  rooms[room].questionCount++;

  rooms[room].questionTimeout = setTimeout(() => {
    io.to(room).emit("answerResult", {
      playerName: "No one",
      isCorrect: false,
      correctAnswer: rooms[room].correctAnswer,
      scores: rooms[room].players.map((p) => ({
        name: p.name,
        score: p.score || 0,
      })),
    });

    askNewQuestion(room);
  }, 20000);
}

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
