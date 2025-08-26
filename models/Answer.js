const sqlite3 = require("sqlite3").verbose();

class Answer {
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
    db.get(`SELECT * FROM answer WHERE question_id = ?`, [question_id], (err, row) => {
      if (err) return callback(err);
      if (!row) return callback(null, null);
      callback(null, new Answer(row.id, row.question_id, row.content));
    });
  }

}

module.exports = Answer;