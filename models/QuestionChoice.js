const sqlite3 = require("sqlite3").verbose();

class QuestionChoice {
  constructor(id, questionId, content) {
    this.id = id;
    this.questionId = questionId;
    this.content = content;
  }

  // Open DB connection (singleton pattern)
  static db() {
    if (!this._db) {
      this._db = new sqlite3.Database("./exam.db");
    }
    return this._db;
  }

  // Find by question id
  static find(question_id, callback) {
    const db = this.db();
    db.all(`SELECT * FROM question_choice WHERE question_id = ?`, [question_id], (err, rows) => {
      if (err) return callback(err);
      if (!rows || rows.length === 0) return callback(null, null);
      const choices = rows.map(row => new QuestionChoice(row.id, row.question_id, row.content));
      callback(null, choices);
    });
  }

}

module.exports = QuestionChoice;