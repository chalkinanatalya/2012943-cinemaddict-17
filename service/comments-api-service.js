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

  addComment = async (comment, movie) => (
    await this._load({
      url: `comments/${movie.id}`,
      method: Method.POST,
      body: JSON.stringify(comment),
      headers: new Headers({'Content-Type': 'application/json'}),
    }).then(ApiService.parseResponse)
  );

  deleteComment = async (commentId) => {
    const response = await this._load({
      url: `comments/${commentId}`,
      method: Method.DELETE,
    });

    return response;
  };
}
