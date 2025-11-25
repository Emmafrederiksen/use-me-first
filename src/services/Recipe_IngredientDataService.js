import http from "../http-common";

class Recipe_IngredientDataService {
    create(data) {
        return http.post("/recipeingredients", data);
      }
      getByRecipeId(recipeId) {
        return http.get(`/recipeingredients/${recipeId}`);
      }
      update(recipeID,ingredientID, data) {
        return http.put(`/recipeingredients/${recipeID}/${ingredientID}`, data);
      }
      delete(recipeID,ingredientID) {
        return http.delete(`/recipeingredients/${recipeID}/${ingredientID}`);
    }
}

export default new Recipe_IngredientDataService();