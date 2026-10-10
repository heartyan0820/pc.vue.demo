import { hasPerm } from "./permission";
function setupDirective(app) {
  app.directive("hasPerm", hasPerm);
}
export {
  setupDirective
};
