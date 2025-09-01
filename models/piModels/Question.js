const Database = require('better-sqlite3');
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
      this._db = new Database("./exam.db");
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
  static all(page, itemsPerPage, searchContent) {
    const db = this.db();
    const offset = (page - 1) * itemsPerPage;
    const searchParam = typeof searchContent != 'undefined'
      && searchContent !== null && searchContent !== '' ? ' AND content LIKE \'%' + searchContent + '%\' ' : '';
    let query = `SELECT * FROM question WHERE 1=1 ${searchParam} ORDER BY question_no ASC LIMIT ? OFFSET ?`;
    console.log('Query:', query);
    try {
      const rows = db.prepare(query).all(itemsPerPage, offset);
      const questions = [];
      for (const r of rows) {
        // Synchronously fetch related data using better-sqlite3
        const answer = Answer.find ? Answer.find(r.id) : null;
        const questionChoices = QuestionChoice.find ? QuestionChoice.find(r.id) : [];
        const votingAnswers = VotingAnswer.find ? VotingAnswer.find(r.id) : [];
        const questionImages = QuestionImage.find ? QuestionImage.find(r.id) : [];
        questions.push(new Question(
          r.id,
          r.question_no,
          r.content,
          r.examCode,
          r.source_url,
          answer,
          questionChoices,
          votingAnswers,
          questionImages
        ));
      }
      return questions;
    } catch (err) {
      return [];
    }
  }

  static count(searchContent) {
    const db = this.db();
    const searchParam = typeof searchContent != 'undefined'
      && searchContent !== null && searchContent !== '' ? ' AND content LIKE \'%' + searchContent + '%\' ' : '';
    let query = `SELECT COUNT(*) as count FROM question WHERE 1=1 ${searchParam}`;
    try {
      const row = db.prepare(query).get();
      return row.count;
    } catch (err) {
      return 0;
    }
  }

  // Find by ID
  static find(id) {
    const db = this.db();
    try {
      const row = db.prepare(`SELECT * FROM question WHERE id = ?`).get(id);
      if (!row) return null;
      const answer = Answer.find(row.id);
      const questionChoices = QuestionChoice.find(row.id);
      const votingAnswers = VotingAnswer.find(row.id);
      const questionImages = QuestionImage.find(row.id);
      return new Question(row.id, row.question_no, row.content, row.examCode, row.source_url, answer, questionChoices, votingAnswers, questionImages);
    } catch (err) {
      return null;
    }
  }     

  // Update
  update() {
    const db = Question.db();
    db.run(
      `UPDATE question SET text = ?, answer = ? WHERE id = ?`,
      [this.text, this.answer, this.id],
      function (err) {
        if (err) return false;
        return true;
      }
    );
  }

  // Delete
  delete() {
    const db = Question.db();
    db.run(`DELETE FROM question WHERE id = ?`, [this.id], function (err) {
      if (err) return false;
      return true;
    });
  }
}

module.exports = Question;