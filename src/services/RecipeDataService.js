import http from "../http-common";

class RecipeDataService {
  getAll() {
    return http.get("/recipes");
  }
  getOne(id) {
    return http.get(`/recipes/${id}`);
  }
  delete(id) {
    return http.delete(`/recipes/${id}`);
  }
  update(id, recipeData) {
    return http.put(`/recipes/${id}`, recipeData);
  }
  create(recipeData) {
    return http.post("/recipes", recipeData);
  }
}

export default new RecipeDataService();