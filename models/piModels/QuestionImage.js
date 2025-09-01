const Database = require('better-sqlite3');

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
      this._db = new Database("./exam.db");
    }
    return this._db;
  }

  // Find by question id
  static find(question_id) {
    const db = this.db();
      const rows = db.prepare(`SELECT * FROM question_image WHERE question_id = ?`).all(question_id);
      if (!rows || rows.length === 0) return [];
      const images = rows.map(row => new QuestionImage(row.id, row.question_id, row.image_base64, row.image_url));
      return images;  
  }

}

module.exports = QuestionImage;