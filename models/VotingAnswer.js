const sqlite3 = require("sqlite3").verbose();

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
      this._db = new sqlite3.Database("./exam.db");
    }
    return this._db;
  }

  // Find by question id
  static find(question_id, callback) {
    const db = this.db();
    db.all(`SELECT * FROM voting_answer WHERE question_id = ?`, [question_id], (err, rows) => {
      if (err) return callback(err);
      if (!rows || rows.length === 0) return callback(null, null);
      let finalRows = [];
      let totalRating = 0;
      rows.forEach( r => {
        totalRating += r.rating;
        if(totalRating <= 100) {
          finalRows.push(new VotingAnswer(r.id, r.question_id, r.content, r.rating));
        }
      });
      const answers = finalRows.map(row => new VotingAnswer(row.id, row.question_id, row.content, row.rating));
      callback(null, answers);
    });
  }

}

module.exports = VotingAnswer;