import http from "../http-common";

class RecipeStepsDataService {

    // // Hent alle steps for én opskrift
    getAll(recipeID) {
        return http.get(`/recipeSteps/${recipeID}`);
    }

    // Opret nyt step
    create(data) {
        return http.post("/recipesteps", data);
    }
    
    // Opdater et step 
    update(recipeID, step, data) {
        return http.put(`/recipesteps/${recipeID}/${step}`, data);
    }

    // Slet et step
    delete(recipeID, step) {
        return http.delete(`/recipesteps/${recipeID}/${step}`);
    }

}

export default new RecipeStepsDataService();