const Database = require('better-sqlite3');

class VotingAnswer {
  constructor(id, questionId, content, rating = 0) {
    this.id = id;
    this.questionId = questionId;
    this.content = content;
    this.rating = rating;
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
      const rows = db.prepare(`SELECT * FROM voting_answer WHERE question_id = ?`).all(question_id);
      if (!rows || rows.length === 0) return [];
      let finalRows = [];
      let totalRating = 0;
      for (const r of rows) {
        totalRating += r.rating;
        if (totalRating <= 100) {
          finalRows.push(new VotingAnswer(r.id, r.question_id, r.content, r.rating));
        }
      }
    return finalRows;
  }

}

module.exports = VotingAnswer;