import ApiService from '../src/framework/api-service.js';

const Method = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE',
};

export default class CommentsApiService extends ApiService {
  getComments = async (movieId) => {
    const response = await this._load({url: `comments/${movieId}`}).then(ApiService.parseResponse);

    return response;
  };

  addComment = async (comment, movie) => {
    const response = await this._load({
      url: `comments/${movie.id}`,
      method: Method.POST,
      body: JSON.stringify(comment),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  };

  deleteComment = async (comment) => {
    const response = await this._load({
      url: `tasks/${comment.id}`,
      method: Method.DELETE,
    });

    return response;
  };
}
