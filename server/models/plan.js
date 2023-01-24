class Plan {
    constructor(id, title, projectID, resourceID, eta, index) {
        this.id = id;
        this.title = title;
        this.projectID = projectID;
        this.resourceID = resourceID;
        this.eta = eta;
        this.index = index;
    }
}

module.exports = Plan;