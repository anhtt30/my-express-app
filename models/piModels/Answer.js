const Database = require('better-sqlite3');

class Answer {
  constructor(id, questionId, content) {
    this.id = id;
    this.questionId = questionId;
    this.content = content;
  }

  // Open DB connection (singleton pattern)
  static db() {
    if (!this._db) {
      this._db = new Database("./exam.db");
    }
    return this._db;
  }

  // Find by question id
  static find(question_id) {
    const db = this.db();
    const stmt = db.prepare(`SELECT * FROM answer WHERE question_id = ?`);
    const row = stmt.get(question_id);

    if (!row) {
      return null; // no record found
    }

    return new Answer(row.id, row.question_id, row.content);
  }

}

module.exports = Answer;