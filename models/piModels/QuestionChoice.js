const Database = require('better-sqlite3');

class QuestionChoice {
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
      const rows = db.prepare(`SELECT * FROM question_choice WHERE question_id = ?`).all(question_id);
      if (!rows || rows.length === 0) return [];
      const choices = rows.map(row => new QuestionChoice(row.id, row.question_id, row.content));
      return choices;
  }

}

module.exports = QuestionChoice;