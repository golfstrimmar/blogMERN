import axios from "axios";

export default class PostService {
  static async getAll(limit = 10, page = 1) {
    const response = await axios.get("https://react2024-plc4.onrender.com", {
      params: {
        _limit: limit,
        _page: page,
      },
    });
    return response;
  }

  static async getById(id) {
    const response = await axios.get(
      "https://react2024-plc4.onrender.com" + id,
    );
    return response;
  }

  static async getCommentsById(id) {
    const response = await axios.get(
      `https://react2024-plc4.onrender.com/comments`,
    );
    return response;
  }
}
