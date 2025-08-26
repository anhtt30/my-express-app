const sqlite3 = require("sqlite3").verbose();
const Answer = require("./Answer");
const QuestionChoice = require("./QuestionChoice");
const VotingAnswer  = require("./VotingAnswer");
const QuestionImage  = require("./QuestionImage");

class Question {
  constructor(id, questionNo, content, examCode, sourceUrl, answer, questionChoices = [], votingAnswers = [], questionImages = []) {
    this.id = id;
    this.questionNo = questionNo;
    this.content = content;
    this.examCode = examCode;
    this.sourceUrl = sourceUrl;
    this.answer = answer; // Associated Answer object
    this.votingAnswers = votingAnswers; // Associated VotingAnswer objects
    this.questionChoices = questionChoices; // Associated QuestionChoice objects
    this.questionImages = questionImages; // Associated QuestionImage objects
  }

  // Open DB connection (singleton pattern)
  static db() {
    if (!this._db) {
      this._db = new sqlite3.Database("./exam.db");
    }
    return this._db;
  }

  // Create a new question
  static create(text, answer, callback) {
    const db = this.db();
    db.run(
      `INSERT INTO question (text, answer) VALUES (?, ?)`,
      [text, answer],
      function (err) {
        if (err) return callback(err);
        callback(null, new Question(this.lastID, text, answer));
      }
    );
  }

  // Get all questions
  static all(page, itemsPerPage, callback) {
    const db = this.db();
    const offset = (page - 1) * itemsPerPage;

    db.all(`SELECT * FROM question ORDER BY question_no ASC LIMIT ? OFFSET ?`, [itemsPerPage, offset], (err, rows) => {
      if (err) return callback(err);
      const questions = [];
      let pending = rows.length;
      if (pending === 0) return callback(null, questions); // No questions found
      rows.forEach((r, idx) => {
        Answer.find(r.id, (err, answer) => {
          if (err) return callback(err);
          QuestionChoice.find(r.id, (err, questionChoices) => {
            if (err) return callback(err);
            VotingAnswer.find(r.id, (err, votingAnswers) => {
              if (err) return callback(err);
              QuestionImage.find(r.id, (err, questionImages) => {
                if (err) return callback(err);
                questions[idx] = new Question(r.id, r.question_no, r.content, r.examCode, r.source_url, answer, questionChoices, votingAnswers, questionImages);
                if (--pending === 0) {
                  console.log(questions);
                  console.log(page);
                  callback(null, questions);
                }
              });
            });
          });
        });
      });
    });
  }

  static count(callback) {
    const db = this.db();
    db.get(`SELECT COUNT(*) as count FROM question`, (err, row) => {
      if (err) return callback(err);
      callback(null, row.count);
    });
  }

  // Find by ID
  static find(id, callback) {
    const db = this.db();
    db.get(`SELECT * FROM question WHERE id = ?`, [id], (err, row) => {
      if (err) return callback(err);
      if (!row) return callback(null, null);
      Answer.find(row.id, (err, answer) => {
        if (err) return callback(err);
        QuestionChoice.find(row.id, (err, questionChoices) => {
          if (err) return callback(err);
          VotingAnswer.find(row.id, (err, votingAnswers) => {
            if (err) return callback(err);
            QuestionImage.find(row.id, (err, questionImages) => {
              if (err) return callback(err);
              callback(null, new Question(row.id, row.question_no, row.content, row.examCode , row.source_url, answer, questionChoices, votingAnswers, questionImages));
            });
          });
        });
      });
    });
  }

  // Update
  update(callback) {
    const db = Question.db();
    db.run(
      `UPDATE question SET text = ?, answer = ? WHERE id = ?`,
      [this.text, this.answer, this.id],
      function (err) {
        if (err) return callback(err);
        callback(null, true);
      }
    );
  }

  // Delete
  delete(callback) {
    const db = Question.db();
    db.run(`DELETE FROM question WHERE id = ?`, [this.id], function (err) {
      if (err) return callback(err);
      callback(null, true);
    });
  }
}

module.exports = Question;