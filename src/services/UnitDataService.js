import http from "../http-common";

class UnitsDataService {

    getAll() {
        return http.get("/units");
      }

}

export default new UnitsDataService();