import http from "../http-common";

class IngredientDataService {
    getAll() {
        return http.get("/ingredients");
      }
      
    create(ingredientData) {
        return http.post("/ingredients", ingredientData);
      }

    update(id, ingredientData) {
        return http.put(`/ingredients/${id}`, ingredientData);
      }

    delete(id) {
        return http.delete(`/ingredients/${id}`);
      }
}

export default new IngredientDataService();