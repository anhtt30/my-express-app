const sqlite3 = require("sqlite3").verbose();

class QuestionImage {
  constructor(id, questionId, imageBase64, imageUrl) {
    this.id = id;
    this.questionId = questionId;
    this.imageBase64 = imageBase64;
    this.imageUrl = imageUrl;
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
    db.all(`SELECT * FROM question_image WHERE question_id = ?`, [question_id], (err, rows) => {
      if (err) return callback(err);
      if (!rows || rows.length === 0) return callback(null, null);
      const images = rows.map(row => new QuestionImage(row.id, row.question_id, row.image_base64, row.image_url));
      callback(null, images);
    });
  }

}

module.exports = QuestionImage;