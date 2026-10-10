import path from "path";
import { createDefineMock } from "vite-plugin-mock-dev-server";
const defineMock = createDefineMock((mock) => {
  mock.url = path.join(import.meta.env.VITE_APP_BASE_API + "/api/v1/", mock.url);
});
export {
  defineMock
};
